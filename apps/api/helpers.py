from openai import OpenAI
import os
from django.utils import timezone
import dateparser

def create_embedding(log):
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
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
    
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    # Format the local datetime nicely for OpenAI
    local_time_str = user_local_datetime.strftime('%Y-%m-%d %H:%M:%S')
    
    prompt = (
        f"The current date and time is {local_time_str} (user's local time). "
        "Read the following text and extract the reminder date and time. "
        "Interpret any relative time (e.g., 'in two minutes', 'tomorrow at 3pm', 'next week') relative to the current time above. "
        "Return ONLY the datetime in ISO 8601 format: YYYY-MM-DDTHH:MM:SS "
        "(no timezone suffix, no extra text). "
        f"Text: '{log}'"
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
    if not result:
        return None
    
    try:
        # Parse the ISO string from OpenAI (naive datetime)
        reminder_dt_naive = datetime.fromisoformat(result.replace('Z', ''))
        
        # Convert from user's local time to UTC
        # offset is negative for timezones ahead of UTC (e.g., -60 for CET = UTC+1)
        # So to convert local to UTC: subtract the offset (which adds because it's negative)
        offset = timedelta(minutes=timezone_offset_minutes)
        reminder_dt_utc_naive = reminder_dt_naive - offset
        
        # Make it timezone-aware in UTC (use dt_timezone.utc, not timezone.utc)
        reminder_dt_utc = timezone.make_aware(reminder_dt_utc_naive, dt_timezone.utc)
        
        return reminder_dt_utc
        
    except (ValueError, AttributeError) as e:
        print(f"Error parsing datetime from OpenAI: {result}, error: {e}")
        return None


def get_answer(context):
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    prompt = (
        # Instructions (# Prompt was improved with an AI assistant for clarity)
        f"Here is the current date and time: {context['question_date']}. "
        f"Please read the following question: '{context['question']}' "
        f"Answer it using only the information in these entry logs: '\n{context['closest_matches']}\n' "
        "Use the current date only to interpret time-related references (like 'today' or 'last week') in the question and logs. "
        "When you answer, do not mention the current date explicitly; instead, answer using the dates from the logs themselves. "
        "If you mention dates or times in your answer, rewrite them in a user friendly way (for example: 'on 2025‑12‑11 at 12:53') and never show timezone offsets or microseconds like '+00:00' or '.464844'."
        "Do not make any assumptions or use outside knowledge, usie only the information in the logs. "
        "Your answer should be friendly, concise, and only include information that directly answers the question. "
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