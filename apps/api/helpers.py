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
        "3. If a specific hour is stated (e.g., 'at 8'), always use that exact hour. Do not override specific hours with part-of-day defaults (e.g., 'evening at 8' means 20:00, not 18:00). Only apply these defaults when NO specific hour is given: morning = 09:00, afternoon = 14:00, evening = 18:00, night = 21:00. Default to 09:00 if no time is mentioned at all.\n"
        "4. If a time of day is mentioned without AM/PM, and that time has already passed today, interpret it as PM if the AM version has passed and PM has not, or as the next day if both have passed.\n"
        "5. If a day of the week is mentioned without 'last' or 'past', always pick the next upcoming occurrence of that day, even if it is tomorrow.\n"
        "6. The returned datetime must always be strictly in the future relative to the current date and time. If the only possible interpretation is in the past, return None.\n"
        "7. The text to analyze may be in any language. Translate the temporal meaning to English internally before calculating the date.\n"  
        "8. Return ONLY the final computed date in strict ISO 8601 format (YYYY-MM-DDTHH:MM:SS) or the word None.\n"
        "9. Do not include any other words, explanations, or punctuation.\n\n"
        f"Text to analyze: '{log}'\n"
        "Output:"
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



def extract_date_range(question, user_local_datetime, timezone_offset_minutes):
    """
    Extract a date range from a question using OpenAI.

    Args:
        question: The user's question (e.g., "what did I do last week?")
        user_local_datetime: User's current local datetime (timezone-aware)
        timezone_offset_minutes: User's timezone offset from UTC in minutes (e.g., -60 for CET)

    Returns:
        dict with 'date_from' and 'date_to' as timezone-aware UTC datetimes, or None
    """
    from datetime import datetime, timedelta, timezone as dt_timezone
    from django.utils import timezone
    from openai import OpenAI
    from django.conf import settings
    import json

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    local_time_str = user_local_datetime.strftime('%A, %Y-%m-%d %H:%M:%S')

    prompt = (
        f"The current date and time is {local_time_str} (user's local time). "
        "The week starts on Monday.\n\n"
        "A user is asking a question about their personal journal. "
        "Your job is to understand what time period they are asking about.\n\n"
        "Rules:\n"
        "1. If the question contains no time reference at all, return exactly: null\n"
        "2. If you can identify a time period — even if phrased informally or ambiguously — "
        "return a JSON object with exactly two keys: \"date_from\" and \"date_to\", "
        "both in strict ISO 8601 format (YYYY-MM-DDTHH:MM:SS), in the user's local time.\n"
        "3. These words always indicate a time reference and must always produce a date range, "
        "regardless of the verb used in the question: "
        "today, yesterday, this week, last week, this month, last month, this year, last year, "
        "this morning, this afternoon, this evening, tonight, "
        "and their equivalents in any language.\n"
        "4. Be generous in interpreting all other time references. "
        "Informal or indirect phrasing still has a clear meaning — "
        "calculate the range that best matches the intent.\n"
        "5. Only apply these time-of-day defaults when NO specific hour is given: "
        "morning = 09:00, afternoon = 12:00, evening = 18:00, night = 21:00. "
        "If no time of day is mentioned, use 00:00:00 for date_from and 23:59:59 for date_to.\n"
        "6. The question may be in any language. Understand the meaning before calculating.\n"
        "7. Return ONLY the JSON object or the word null. No explanation, no markdown, no extra text.\n\n"
        f"User question: '{question}'\n"
        "Output:"
    )

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that understands what time period a user is asking about. Return only a JSON object or null."},
            {"role": "user", "content": prompt}
        ],
        max_completion_tokens=80,
        temperature=0
    )

    result = completion.choices[0].message.content.strip()

    if not result or result == "null":
        return None

    try:
        parsed = json.loads(result)
        offset = timedelta(minutes=timezone_offset_minutes)

        date_from_naive = datetime.fromisoformat(parsed['date_from'])
        date_to_naive = datetime.fromisoformat(parsed['date_to'])

        date_from_utc = timezone.make_aware(date_from_naive + offset, dt_timezone.utc)
        date_to_utc = timezone.make_aware(date_to_naive + offset, dt_timezone.utc)

        return {'date_from': date_from_utc, 'date_to': date_to_utc}

    except (ValueError, KeyError, json.JSONDecodeError) as e:
        print(f"Error parsing date range from OpenAI: {result}, error: {e}")
        return None



def get_answer(context):
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    if context.get('has_date_filter'):
        prompt = (
            "You are an assistant answering a user's question based ONLY on the provided journal logs.\n\n"
            "Guidelines:\n"
            "1. Be friendly, direct, and concise. Do not add conversational filler.\n"
            "2. The logs provided are already filtered to the exact time period the user asked about. "
            "Just answer based on what is in the logs — do not reason about dates or time.\n"
            "3. Only mention the date or time of an entry if the user asks 'when' something happened, "
            "or if the timing is necessary to fully answer the question.\n"
            "4. Date formatting: When you DO mention a date, state the exact calendar date from the log "
            "(e.g., 'on December 11, 2025') instead of saying 'today' or 'last year'. "
            "Never use raw database timestamps, timezone offsets, or microseconds.\n"
            "5. Treat all entry types equally — journal entries and reminders are both things the user wrote. "
            "Do not ignore reminders when answering questions about what the user said or wrote.\n"
            "6. When the user asks what they wrote, said, or did in a time period, list ALL entries from the logs — "
            "both journal entries and reminders. Do not filter out entries you consider unimportant. "
            "Only say you could not find information if the logs are genuinely empty.\n"
            "7. Answer in the same language as the question.\n\n"
            "=== LOGS ===\n"
            f"{context['closest_matches']}\n"
            "=== END LOGS ===\n\n"
            f"User Question: '{context['question']}'"
        )
    else:
        prompt = (
            f"Today's date is: {context['question_date']}.\n\n"
            "You are an assistant answering a user's question based ONLY on the provided journal logs.\n\n"
            "Guidelines:\n"
            "1. Be friendly, direct, and concise. Do not add conversational filler.\n"
            "2. Resolving time: Use today's date only to understand the user's question (e.g., if they ask 'what did I do last week?'). When reading the logs, rely strictly on the log's own timestamp to know when an event happened.\n"
            "3. Only mention the date or time of an entry if the user asks 'when' something happened, or if the timing is necessary to fully answer the question.\n"
            "4. Date formatting: When you DO mention a date, state the exact calendar date from the log (e.g., 'on December 11, 2025') instead of saying 'today' or 'last year'. Never use raw database timestamps, timezone offsets, or microseconds.\n"
            "5. Treat all entry types equally — journal entries and reminders are both things the user wrote. Do not ignore reminders when answering questions about what the user said or wrote.\n"
            "6. If the logs do not contain a clear, direct answer to the question, reply only with a short sentence saying you could not find that information in the journal. Do NOT piece together an answer from unrelated entries. Do NOT infer, guess, or connect entries that do not explicitly mention the topic asked about.\n"
            "7. Answer in the same language as the question.\n\n"
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