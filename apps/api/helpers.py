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
    Extract reminder datetime(s) from log text using OpenAI.
    
    Args:
        log: The reminder text (e.g., "remind me in 2 minutes")
        user_local_datetime: User's current local datetime (timezone-aware)
        timezone_offset_minutes: User's timezone offset from UTC in minutes (e.g., -60 for CET)
    
    Returns:
        list of datetime objects in UTC, or empty list if extraction failed
        # CHANGED: Used to return single datetime or None, now returns a list
        # This allows handling multiple reminders like "remind me 4 hours before and 1 hour before"
    """
    from datetime import datetime, timedelta, timezone as dt_timezone
    from django.utils import timezone
    
    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Format the local datetime nicely for OpenAI
        local_time_str = user_local_datetime.strftime('%Y-%m-%d %H:%M:%S')
        
        prompt = (
                f"The current date and time is {local_time_str} (user's local time). "
                
                # BETTER: Say "dates and times" or "datetimes" to be explicit
                # This clarifies we need BOTH the date (e.g., Feb 5) AND time (e.g., 3:00 PM)
                "Read the following text and extract ALL reminder dates and times mentioned. "
                
                # Rest stays the same...
                "Interpret any relative time (e.g., 'in two minutes', '4 hours before', 'one day before') "
                "relative to the current time or the main event. "
                "Return a JSON array of datetime strings in ISO 8601 format: [\"YYYY-MM-DDTHH:MM:SS\", \"YYYY-MM-DDTHH:MM:SS\"]. "
                "If only one reminder is found, return an array with one element: [\"YYYY-MM-DDTHH:MM:SS\"]. "
                f"Text: '{log}'"
            )
        
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                # CHANGED: Updated system message to mention JSON arrays
                # This primes OpenAI to return structured data, not just plain text
                {"role": "system", "content": "You are a helpful assistant that extracts dates and times. Return only JSON arrays of ISO 8601 datetime strings."},
                {"role": "user", "content": prompt}
            ],
            # CHANGED: Increased from 50 to 100 tokens
            # Why? Multiple datetimes take more space: ["2026-02-02T14:30:00", "2026-02-02T15:45:00"]
            # needs ~60 tokens, so 100 gives us room for 3-4 reminders safely
            max_completion_tokens=100,
            temperature=0  # UNCHANGED: Keep at 0 for consistent, deterministic results
        )

        result = completion.choices[0].message.content.strip()
        # CHANGED: Check if result is empty before parsing
        if not result:
            return []  # Return empty list instead of None

        try:
            import json  # Import json module to parse the array from OpenAI
            
            # CHANGED: Parse the JSON array from OpenAI
            # Expected format: ["2026-02-02T14:30:00", "2026-02-02T15:45:00"]
            # or for single reminder: ["2026-02-02T14:30:00"]
            result_json = json.loads(result)
            
            # SAFETY CHECK: If OpenAI returns a single string instead of array, convert it
            # Example: OpenAI might return "2026-02-02T14:30:00" instead of ["2026-02-02T14:30:00"]
            # This makes our code more robust to unexpected OpenAI responses
            if isinstance(result_json, str):
                result_json = [result_json]
            
            # NEW: Process EACH datetime in the array
            reminder_times = []  # Empty list to collect all the parsed datetimes
            
            for time_str in result_json:
                # Parse the ISO string from OpenAI (naive datetime in user's local time)
                # Example: "2026-02-02T14:30:00" becomes datetime object
                reminder_dt_naive = datetime.fromisoformat(time_str.replace('Z', ''))
                
                # Convert from user's local time to UTC (UNCHANGED - your existing logic)
                # timezone_offset_minutes is NEGATIVE for timezones ahead of UTC
                # e.g., CET = UTC+1 → offset = -60 minutes
                # To convert local to UTC: ADD the offset (because it's negative, this subtracts 1 hour)
                # Example: 6:52 PM CET + (-60 min) = 6:52 PM - 1 hour = 5:52 PM UTC ✅
                offset = timedelta(minutes=timezone_offset_minutes)
                reminder_dt_utc_naive = reminder_dt_naive + offset
                
                # Make it timezone-aware in UTC (UNCHANGED - your existing logic)
                reminder_dt_utc = timezone.make_aware(reminder_dt_utc_naive, dt_timezone.utc)
                
                # Add this datetime to our list
                reminder_times.append(reminder_dt_utc)
            
            # CHANGED: Return the list of all reminder times instead of a single datetime
            return reminder_times
            
        except (ValueError, AttributeError, json.JSONDecodeError) as e:
            # CHANGED: Added json.JSONDecodeError to catch JSON parsing errors
            # This handles cases where OpenAI returns invalid JSON
            print(f"Error parsing datetime from OpenAI: {result}, error: {e}")
            return []  # Return empty list instead of None
        
    except Exception as e:
        # This catches ALL errors: timeout, API errors, parsing errors, etc.
        print(f"Error in get_reminder_time: {type(e).__name__}: {str(e)}")
        return None


def get_answer(context):
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
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
        "Answer in the same language as the question."
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