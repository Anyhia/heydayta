from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status

from django.urls import reverse

from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Log
from .serializers import LogSerializer
from .helpers import create_embedding, get_reminder_time, get_answer
from .tasks import send_email_reminder
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from pgvector.django import L2Distance
from datetime import timedelta
from django.utils import timezone
from dateutil.parser import isoparse


# Create your views here.
class LogViewSet(viewsets.ModelViewSet):
    queryset=Log.objects.all()
    serializer_class=LogSerializer
    permission_classes = [IsAuthenticated] 

    @action(detail=False, methods=['post']) 
    def ask_question(self, request):
        print("Request data:", request.data)
        # Get the question from user and embedd it
        question=request.data['question']
        question_embedding=create_embedding(question)
        if question_embedding is None:
            return Response(
                {'error': 'Embedding creation failed. Please check your OpenAI quota and API key.'}, 
                status=status.HTTP_400_BAD_REQUEST)
        # Get the date from the question
        local_date=int(request.data.get('localDate', 0)) # localDate in minutes (ex. -60)
        UTC = timezone.now() # current UTC date and time
        question_date = UTC - timedelta(minutes=local_date) # user’s local datetime

        # If the date is naive, add timezone
        if timezone.is_naive(question_date):
            question_date = timezone.make_aware(question_date, timezone.utc) # Adds +00:00 to the hour

        closest_matches = None

        # Compare the question embedding with the embeddings from the user
        closest_matches = Log.objects.filter(
            user=request.user
            ).order_by(
                L2Distance('embedding', question_embedding)
            )
        print("Closest matches", closest_matches)
        if not closest_matches.exists():
            return Response(
            {'error': 'Could not find an answer to your question. Please try asking a different question'}, 
            status=status.HTTP_400_BAD_REQUEST)
      
        # Instead of passing a query set to the context, make it plain text
        log_data = []
        for log in closest_matches:
            log_data.append(f"{log.created_at}: {log.entry}")
        logs_text = "\n".join(log_data)
        context = {
            'question': question,
            'closest_matches': logs_text,
            'question_date': question_date,
        }
        
        try:
            answer = get_answer(context)
            if answer is None:
                return Response(
                {'error': 'Could not find an answer to your question. Please try asking a different question'}, 
                status=status.HTTP_400_BAD_REQUEST)
            return Response({'answer':answer})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

