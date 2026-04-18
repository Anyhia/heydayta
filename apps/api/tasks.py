from celery import shared_task
from django.core.mail import EmailMessage
from django.conf import settings
from pywebpush import webpush, WebPushException
import json

from .models import Log, PushSubscription


@shared_task
def send_email_reminder(reminder_id):
    print(f"Starting reminder for ID: {reminder_id}")

    try:
        log = Log.objects.get(id=reminder_id)
    except Log.DoesNotExist:
        print(f"Reminder {reminder_id} not found in database")
        return
    if log.entry_type != 'reminders':
        print(f"Reminder {reminder_id} is no longer a reminder, skipping")
        return

    # Prevent duplicate sends
    if log.status == 'sent':
        print(f"✅ Reminder {reminder_id} already sent, skipping")
        return

    # --- Email ---
    try:
        print(f"Sending email to {log.user.email}")
        email = EmailMessage(
            subject='You have a reminder from HeyDayta',
            body=log.entry,
            from_email='HeyDayta Reminders <hello@heydayta.app>',
            to=[log.user.email],
            reply_to=['hello@heydayta.app'],
        )
        email.send()
        print(f"✅ Email sent for reminder {reminder_id}")
    except Exception as e:
        print(f"❌ Email failed for reminder {reminder_id}: {e}")
        raise

    # --- Push notifications ---
    subscriptions = PushSubscription.objects.filter(user=log.user)
    print(f"Found {subscriptions.count()} push subscription(s) for user {log.user.username}")

    for subscription in subscriptions:
        try:
            webpush(
                subscription_info={
                    "endpoint": subscription.endpoint,
                    "keys": {
                        "p256dh": subscription.p256dh,
                        "auth": subscription.auth,
                    }
                },
                data=json.dumps({
                    "title": "HeyDayta Reminder",
                    "body": log.entry,
                }),
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims={"sub": settings.VAPID_MAILTO},
            )
            print(f"✅ Push sent to subscription {subscription.id}")
        except WebPushException as e:
            # 410 Gone = subscription is no longer valid, delete it
            if e.response is not None and e.response.status_code == 410:
                print(f"Subscription {subscription.id} expired (410), deleting")
                subscription.delete()
            else:
                # Log other push errors but don't raise — email already sent
                print(f"❌ Push failed for subscription {subscription.id}: {e}")

    # Mark as sent after both email and push have been attempted
    log.status = 'sent'
    log.save()
    print(f"✅ Reminder {reminder_id} marked as sent")