from rest_framework import serializers

from .models import Log

class LogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Log
        fields = ('id', 'user', 'entry_type', 'entry', 'created_at', 'reminder_time', 'status', 'embedding')
        extra_kwargs = {
            'entry':{'required': True},
            'user': {'read_only': True},
            'embedding': {'required': True},
        }

    def validate(self, data):
        if data.get('entry_type') == 'reminders' and not data.get('reminder_time'):
            raise serializers.ValidationError('For Reminders, the date the reminder should be sent is required')
        return data



