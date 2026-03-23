from openai import OpenAI
import os
from django.utils import timezone
import dateparser
from django.conf import settings

def create_embedding(log):

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    log=log.replace('\n', ' ')
    response = client.embeddings.create(
        input=log,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

def get_reminder_time(log, user_local_datetime, timezone_offset_minutes):
    """
    Extract reminder datetime from log text using OpenAI.
    
    Args:
        log: The reminder text (e.g., "remind me in 2 minutes")
        user_local_datetime: User's current local datetime (timezone-aware)
        timezone_offset_minutes: User's timezone offset from UTC in minutes (e.g., -60 for CET)
    
    Returns:
        datetime object in UTC, or None if extraction failed
    """
    from datetime import datetime, timedelta, timezone as dt_timezone
    from django.utils import timezone
    from openai import OpenAI
    from django.conf import settings
    
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    # Format the local datetime nicely for OpenAI
    local_time_str = user_local_datetime.strftime('%A, %Y-%m-%d %H:%M:%S')
    
    prompt = (
        f"The current date and time is {local_time_str} (user's local time). "
        "Extract the intended reminder date and time from the text provided at the bottom.\n\n"
        "Rules:\n"
        "1. If the text contains absolutely NO date, time, or temporal reference, return exactly the word: None\n"
        "2. Interpret any relative time (e.g., 'in two minutes', 'tomorrow', 'next Tuesday') relative to the user's current local time.\n"
        "3. If a date or day is mentioned but no specific time of day is provided, apply these defaults: morning = 09:00, afternoon = 14:00, evening = 18:00, night = 21:00. If no part of the day is implied, default to 09:00.\n"
        "4. Return ONLY the final computed date in strict ISO 8601 format (YYYY-MM-DDTHH:MM:SS) or the word None.\n"
        "5. Do not include any other words, explanations, or punctuation.\n\n"
        f"Text to analyze: '{log}'"
    )
    
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that extracts dates and times. Return only ISO 8601 datetime strings."},
            {"role": "user", "content": prompt}
        ],
        max_completion_tokens=50,
        temperature=0
    )

    result = completion.choices[0].message.content.strip()
    if not result or result == "None":
        return None
    
    try:
        # Parse the ISO string from OpenAI (naive datetime in user's local time)
        reminder_dt_naive = datetime.fromisoformat(result.replace('Z', ''))
        
        # Convert from user's local time to UTC
        # timezone_offset_minutes is NEGATIVE for timezones ahead of UTC
        # e.g., CET = UTC+1 → offset = -60 minutes
        # To convert local to UTC: ADD the offset (because it's negative, this subtracts 1 hour)
        offset = timedelta(minutes=timezone_offset_minutes)
        reminder_dt_utc_naive = reminder_dt_naive + offset
        
        # Make it timezone-aware in UTC
        reminder_dt_utc = timezone.make_aware(reminder_dt_utc_naive, dt_timezone.utc)
        
        return reminder_dt_utc
        
    except (ValueError, AttributeError) as e:
        print(f"Error parsing datetime from OpenAI: {result}, error: {e}")
        return None


def get_answer(context):
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    prompt = (
        f"Today's date is: {context['question_date']}.\n\n"
        "You are an assistant answering a user's question based ONLY on the provided journal logs.\n\n"
        "Guidelines:\n"
        "1. Be friendly, direct, and concise. Do not add conversational filler.\n"
        "2. Resolving time: Use today's date only to understand the user's question (e.g., if they ask 'what did I do last week?'). When reading the logs, rely strictly on the log's own timestamp to know when an event happened.\n"
        "3. Only mention the date or time of an entry if the user asks 'when' something happened, or if the timing is necessary to fully answer the question.\n"
        "4. Date formatting: When you DO mention a date, state the exact calendar date from the log (e.g., 'on December 11, 2025') instead of saying 'today' or 'last year'. Never use raw database timestamps, timezone offsets, or microseconds.\n"
        "5. Never make assumptions or use outside knowledge. If the answer is not in the logs, say so.\n"
        "6. Answer in the same language as the question.\n\n"
        "=== LOGS ===\n"
        f"{context['closest_matches']}\n"
        "=== END LOGS ===\n\n"
        f"User Question: '{context['question']}'"
    )
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo", # Cheaper and good for extracting date
        messages=[
            {"role": "system", "content": "You are a helpful assistant that answers questions"},
            {"role": "user", "content": prompt}
        ],
        max_completion_tokens=500,
        temperature=0
    )

    result = completion.choices[0].message.content
    if not result:
        return None
    return result


def transcribe_audio(audio_file):
    """
    Transcribes audio file using OpenAI Whisper API.
    
    Args:
        audio_file: A file object (from request.FILES) containing audio data
        
    Returns:
        str: The transcribed text, or None if transcription fails
    """
    try:
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        
        # OpenAI expects a tuple: (filename, file_content, content_type)
        # Django's InMemoryUploadedFile needs to be converted
        audio_file.seek(0)  # Reset file pointer to beginning
        
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=(audio_file.name, audio_file.read(), audio_file.content_type)
        )
        
        return transcript.text
        
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        return None