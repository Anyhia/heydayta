from django.db import models
from django.contrib.auth import get_user_model
from pgvector.django import VectorField

class Log(models.Model):
    class EntryType(models.TextChoices):
        JOURNAL = 'journal', 'Journal'
        REMINDERS = 'reminders', 'Reminders'

    class Categories(models.TextChoices):
        CAPTAINS_LOGS = 'logs', 'Captains Logs'
        TRAVEL = 'travel', 'Travel'
        WORK = 'work', 'Work'
        HEALTH = 'health', 'Health'
        FAMILY = 'family', 'Family'
        IDEAS = 'ideas', 'Ideas'
        EDUCATION = 'education', 'Education'
    
    class Status(models.TextChoices):
        UNSENT = 'unsent', 'Unsent'
        SENT = 'sent', 'Sent'

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='logs')
    entry_type = models.CharField(max_length=10, choices=EntryType.choices, default=EntryType.JOURNAL)
    entry = models.TextField(max_length=1000, blank=False)
    category = models.CharField(max_length=10, choices=Categories.choices, default=Categories.CAPTAINS_LOGS)
    created_at = models.DateTimeField(auto_now_add=True)
    reminder_time = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=10, blank=True, null=True, choices=Status.choices, default=Status.UNSENT)
    embedding = VectorField(dimensions=1536)

