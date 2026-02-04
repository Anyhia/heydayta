from __future__ import absolute_import, unicode_literals

from celery import shared_task
from django.core.mail import send_mail
from .models import Log


@shared_task
def send_email_reminder(reminder_id):
    print(f"Starting email reminder for ID: {reminder_id}")
    
    try:
        log = Log.objects.get(id=reminder_id)
        
        print(f"Sending email to {log.user.email}")
        send_mail(
            subject='You have a reminder from HeyDayta',
            message=log.entry,
            from_email='HeyDayta Reminders <gabriela.maricari@gmail.com>',
            recipient_list=[log.user.email],
        )
        
        # Mark as sent only after FIRST email
        if log.status == 'unsent':
            log.status = 'sent'
            log.save()
        
        print(f"Reminder {reminder_id} sent")
        
    except Log.DoesNotExist:
        print(f"Reminder {reminder_id} not found in database")
    except Exception as e:
        print(f"Error sending reminder {reminder_id}: {e}")
        raise

