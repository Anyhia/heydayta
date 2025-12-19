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

# def get_reminder_time(log):
#     reminder_time = dateparser.parse(log)
#     if not reminder_time:
#         raise ValueError("Could not parse reminder time from input!")
#     return reminder_time

def get_reminder_time(log, date):
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    print(date)
    prompt = (
        # Instructions
        f"Today's date is {date}. "
        "Please read the following text and extract the reminder date and time as an ISO 8601 datetime string. " 
        "Interpret any relative time (for example, 'in two weeks', 'tomorrow morning', 'next month') relative to today's date. "
        "Always choose a future datetime if the text allows it. " 
        "Returned only the ISO string ( no extra words, labels, or punctuation etc.), " 
        # Show the actual text for extraction, plug in the log(entry) and today's date
        f"Text: '{log}'."
    )
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo", # Cheaper and good for extracting date
        messages=[
            {"role": "system", "content": "You are a helpful assistant that extracts the date from the text."},
            {"role": "user", "content": prompt}
        ],
        max_completion_tokens=50,
        temperature=0
    )

    result = completion.choices[0].message.content
    if not result:
        return None
    return result



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