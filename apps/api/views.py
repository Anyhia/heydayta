
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



# Create your views here.
class LogViewSet(viewsets.ModelViewSet):
    queryset=Log.objects.all()
    serializer_class=LogSerializer
    permission_classes = [IsAuthenticated] 

    # Override the queryset, to get only the entries from the current user.
    def get_queryset(self):
        entries=Log.objects.filter(user=self.request.user).order_by('-created_at')
        return entries  

    def create(self, request):
        try:       
            # request.data is often a QueryDict, which is designed to be immutable for safety. 
            # Make a copy to work with a mutable object instead, and modify request.data without errors.
            data = request.data.copy()
            if(data.get('entry_type') == 'reminders'):
                timezone_offset_minutes = int(data.get('localDate', 0))  # e.g., -60 for CET
                UTC = timezone.now()
                user_local_datetime = UTC - timedelta(minutes=timezone_offset_minutes)
                
                # Pass both the local datetime and the offset
                result = get_reminder_time(
                    data.get('entry'), 
                    user_local_datetime,
                    timezone_offset_minutes
                )
                
                if result is None:
                    return Response({'error': 'Could not find a valid time to set your reminder. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)
                
                data['reminder_time'] = result  # result is already in UTC
                data['entry_type'] = 'reminders'
            try:
                #  Create the vector by passing the log text to the embedding function
                embedding_vector = create_embedding(data.get('entry'))
                if embedding_vector is None:
                    raise Exception("Embedding creation failed.")
                data['embedding'] = embedding_vector
            except Exception as e:
                return Response({'error': 'Embedding creation failed. Please check your OpenAI quota and API key.'}, status=status.HTTP_400_BAD_REQUEST)
            data['category'] =data.get('category')
            
            # Save the data
            serializer = LogSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            # Get the saved log instance, to access the id and the reminder_time  
            log=serializer.save(user=request.user)
            if log.entry_type == 'reminders' and log.reminder_time:
                try: 
                    reminder_id = log.id
                    reminder_time = log.reminder_time
                    # Schedule the task, add the id of the log as an argument
                    send_email_reminder.apply_async(
                        args=[reminder_id],
                        eta=reminder_time
                    )
                except Exception as e:
                    return Response({'error': f'Failed to schedule reminder: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(LogSerializer(log).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post']) 
    def ask_question(self, request):
        # Get the question from user and embed it
        question = request.data['question']
        question_embedding = create_embedding(question)
        if question_embedding is None:
            return Response(
                {'error': 'Embedding creation failed. Please check your OpenAI quota and API key.'}, 
                status=status.HTTP_400_BAD_REQUEST)
        
        # Get the timezone offset from the request
        timezone_offset_minutes = int(request.data.get('localDate', 0))  # e.g., -60 for CET
        UTC = timezone.now()  # current UTC date and time
        question_date = UTC - timedelta(minutes=timezone_offset_minutes)  # user's local datetime

        # If the date is naive, add timezone
        if timezone.is_naive(question_date):
            question_date = timezone.make_aware(question_date, timezone.utc)

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
    
        # Convert query set to plain text with local timestamps
        log_data = []
        user_tz_offset = timedelta(minutes=timezone_offset_minutes)
        for log in closest_matches:
            # Convert UTC to user's local time
            local_time = log.created_at - user_tz_offset
            
            # Format in a friendly way
            date_str = local_time.strftime('%Y-%m-%d at %H:%M')
            log_data.append(f"{date_str}: {log.entry}")
        
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
            return Response({'answer': answer})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



