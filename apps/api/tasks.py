from __future__ import absolute_import, unicode_literals

from celery import shared_task
from django.core.mail import send_mail
from .models import Log


@shared_task
def send_email_reminder(reminder_id):
    log = Log.objects.get(id=reminder_id)
    send_mail(
        subject='You have a reminder from HeyDayta',
        message=log.entry,
        from_email='gabriela.maricari@gmail.com', 
        recipient_list=[log.user.email],
    )


