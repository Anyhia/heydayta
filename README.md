# HeyDayta - Personal Memory Vault

> A full-stack web application for capturing life's moments with AI-powered semantic search and intelligent reminders.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://heydayta-590c2392dfd2.herokuapp.com/)
[![Python](https://img.shields.io/badge/Python-3.10.12-blue)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.2.5-green)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-blue)](https://github.com/pgvector/pgvector)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Why I Built This](#why-i-built-this)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Live Demo](#live-demo)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Contact](#contact)

---

## 🎯 Overview

HeyDayta is a personal memory journaling application that helps users capture daily moments and retrieve them through natural language questions. Unlike traditional journaling apps, HeyDayta uses OpenAI embeddings and PostgreSQL's pgvector extension to enable semantic search—allowing users to ask questions like *"What did I eat for dinner last Tuesday?"* and receive accurate, context-aware answers.

**What Makes HeyDayta Different:**

- **Natural Language Reminders**: No calendar pickers or date dropdowns—just type *"remind me in 2 hours"*, *"tomorrow at 3pm"*, or *"in two weeks"* and HeyDayta understands. Fast, intuitive, and human.

- **All-in-One Memory Hub**: Journal entries, smart reminders, and AI-powered search in a single interface. No app-switching, no complexity—just one place for everything you need to remember.

- **Multilingual AI Search**: Ask questions in any language (*"¿Qué comí ayer?"* or *"Ce am mâncat ieri?"*) and get answers in the same language, thanks to GPT-4 integration.

- **Timezone-Aware Reminders**: Schedule reminders that fire at the correct local time, no matter where you are in the world. Celery + Redis handle background processing with precision.

- **Designed for Modern Life**: Built for people who need a fast, simple tool in an increasingly complex world. No learning curve, no feature bloat—just capture, search, and remember.

- **Bank-Level Security**: Google OAuth 2.0 with httpOnly cookie-based JWT refresh tokens. Your memories are private and protected.

---

## 💭 Why I Built This

In our fast-paced world, we're drowning in apps, notifications, and calendars. I wanted to create something **simple**—a single place to capture thoughts, set reminders without fighting with date pickers, and actually *find* what I wrote months ago by just asking a question.

HeyDayta combines the speed of natural language input with the power of AI search, wrapped in a clean, Star Trek-inspired interface. It's the app I wish existed when I needed to remember everything but had no time to organize anything.

**Technology used:** Django, React, OpenAI GPT-4, PostgreSQL pgvector, Celery, Redis  
**Deployment:** Production-ready on Heroku with 99.9% uptime

---

## ✨ Features

### Core Functionality
- **📝 Journal Entries**: Create timestamped log entries with custom categories
- **🔍 AI-Powered Search**: Natural language question answering using vector similarity search (L2 distance)
- **⏰ Smart Reminders**: Email-based reminders with natural language time parsing (*"in 3 days"*, *"next Monday"*)
- **🔐 Dual Authentication**: Traditional email/password and Google OAuth 2.0
- **🌍 Multilingual Support**: Automatic language detection for AI responses
- **📱 Responsive Design**: Mobile-friendly Star Trek-inspired UI

### Technical Highlights
- **Vector Embeddings**: OpenAI `text-embedding-3-small` model for semantic search
- **Persistent Sessions**: HttpOnly cookies for secure, persistent authentication
- **Auto-Refresh Tokens**: Seamless token renewal without re-authentication
- **Cross-Origin Isolation**: COOP headers configured for OAuth popup flows
- **Production-Ready Deployment**: Single Heroku dyno serving both API and static frontend

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Django 5.2.5** | REST API framework with Django REST Framework |
| **PostgreSQL + pgvector** | Database with vector similarity search extension |
| **Celery + Redis** | Asynchronous task queue for email reminders |
| **SimpleJWT** | JWT authentication with httpOnly cookie support |
| **Gunicorn** | WSGI HTTP server for production |
| **WhiteNoise** | Static file serving with compression |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | Component-based UI framework |
| **React Router** | Client-side routing with protected routes |
| **React Bootstrap** | Responsive UI components |
| **@react-oauth/google** | Google Sign-In integration |
| **Axios** | HTTP client with interceptors for token refresh |

### AI & Infrastructure
- **OpenAI API**: Text embeddings and GPT-4 completions
- **Heroku**: Hosting (web, worker, beat dynos)
- **Heroku Postgres**: Production database
- **Heroku Redis**: Message broker for Celery

---

## 🏗️ Architecture

### Deployment Model
Single Heroku application serving both Django API and React static build via WhiteNoise. All API routes are namespaced under `/api/`.

┌─────────────────────────────────────────────┐
│ Heroku App (heydayta) │
├─────────────────────────────────────────────┤
│ Web Dyno: Gunicorn │
│ ├─ Django API (/api/*) │
│ └─ React Static Files (/) │
│ │
│ Worker Dyno: Celery Worker │
│ Beat Dyno: Celery Beat (scheduler) │
├─────────────────────────────────────────────┤
│ Postgres Add-on (pgvector enabled) │
│ Redis Add-on (Celery broker) │
└─────────────────────────────────────────────┘


### Authentication Flow
1. User logs in (email/password or Google OAuth)
2. Backend returns JWT access token (30min) + httpOnly refresh token (7 days)
3. React stores access token in memory
4. On page reload, refresh token auto-renews access token
5. Axios interceptor handles 401 errors and token refresh

### AI Search Pipeline
1. User asks question → Create embedding via OpenAI API
2. Query PostgreSQL with L2Distance vector similarity
3. Retrieve closest matching log entries
4. Pass entries to GPT-4 with context-aware prompt
5. Return answer in user's language

---

## 🚀 Live Demo

**Production URL**: [https://heydayta-590c2392dfd2.herokuapp.com/](https://heydayta-590c2392dfd2.herokuapp.com/)

**Try these features:**
1. Sign up with Google or create an account
2. Create a journal entry with category "Captain's Logs"
3. Set a reminder using natural language: *"remind me in 2 hours to call mom"*
4. Ask a question: *"What did I write today?"*
5. Check your email for the reminder notification

---

## 💻 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ / npm 9+
- PostgreSQL 14+ with pgvector extension
- Redis server

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Anyhia/heydayta.git
cd heydayta

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install pgvector extension in PostgreSQL
# Connect to your database and run:
# CREATE EXTENSION vector;

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start Django development server
python manage.py runserver

Frontend Setup

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start

Celery Setup (Background Tasks)

# Terminal 1: Start Celery worker
celery -A CS50w_final_project worker --loglevel=info

# Terminal 2: Start Celery beat (scheduler)
celery -A CS50w_final_project beat --loglevel=info

🔐 Environment Variables
Create a .env file in the project root:

# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
DJANGO_SETTINGS_MODULE=CS50w_final_project.settings

# Database (Local Development)
DATABASE_NAME=heydayta_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_URL=  # Leave empty for local; Heroku sets this automatically

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Celery / Redis
REDIS_URL=redis://localhost:6379/0

# Email Settings (Gmail)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password  # Use App Password, not regular password

# Production (Heroku sets these automatically)
HEROKU_APP_HOST=your-app-name.herokuapp.com

Google OAuth Setup
Go to Google Cloud Console

Create OAuth 2.0 credentials

Add authorized origins:

http://localhost:3000 (development)

https://your-app-name.herokuapp.com (production)

Add redirect URIs:

http://localhost:8000/accounts/google/login/callback/

https://your-app-name.herokuapp.com/api/accounts/google

🚢 Deployment
Heroku Deployment (Production)

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Add buildpacks (order matters!)
heroku buildpacks:add --index 1 heroku/nodejs
heroku buildpacks:add --index 2 heroku/python

# Add Postgres and Redis add-ons
heroku addons:create heroku-postgresql:essential-0
heroku addons:create heroku-redis:mini

# Enable pgvector extension
heroku pg:psql
CREATE EXTENSION vector;
\q

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set OPENAI_API_KEY=sk-your-key
heroku config:set GOOGLE_CLIENT_ID=your-client-id
heroku config:set GOOGLE_CLIENT_SECRET=your-secret
heroku config:set EMAIL_HOST_USER=your-email@gmail.com
heroku config:set EMAIL_HOST_PASSWORD=your-app-password
heroku config:set DEBUG=False
heroku config:set HEROKU_APP_HOST=your-app-name.herokuapp.com

# Build React production files
cd frontend
npm run build
cd ..

# Deploy to Heroku
git add .
git commit -m "Production deployment"
git push heroku master

# Run migrations
heroku run python manage.py migrate

# Collect static files
heroku run python manage.py collectstatic --noinput

# Scale dynos
heroku ps:scale web=1 worker=1 beat=1

# View logs
heroku logs --tail

Production Optimizations Applied
Celery Worker Concurrency: Reduced to 2 to prevent R14 memory errors

Redis SSL: Configured for secure Heroku Redis connections

COOP Header: same-origin-allow-popups for Google OAuth compatibility

Static Files: WhiteNoise with compression for fast asset delivery

Database Connection Pooling: conn_max_age=600 for persistent connections

📚 API Documentation
Authentication Endpoints

POST /api/accounts/register/
POST /api/accounts/google/
POST /api/token/
POST /api/token/refresh/
POST /api/accounts/logout/

Log Endpoints

GET    /api/logs/          # List user's logs
POST   /api/logs/          # Create log/reminder
GET    /api/logs/{id}/     # Retrieve specific log
PUT    /api/logs/{id}/     # Update log
DELETE /api/logs/{id}/     # Delete log
POST   /api/logs/ask_question/  # AI-powered Q&A

Example: Create Journal Entry

curl -X POST https://heydayta-590c2392dfd2.herokuapp.com/api/logs/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entry": "Had an amazing dinner at the Italian restaurant",
    "category": "Captain'\''s Logs",
    "entry_type": "journal",
    "localDate": -60
  }'

Example: Create Reminder with Natural Language

curl -X POST https://heydayta-590c2392dfd2.herokuapp.com/api/logs/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entry": "Call mom in 2 hours",
    "category": "Reminders",
    "entry_type": "reminders",
    "localDate": -60
  }'

Example: Ask Question

curl -X POST https://heydayta-590c2392dfd2.herokuapp.com/api/logs/ask_question/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What did I eat for dinner?",
    "localDate": -60
  }'

🔮 Future Enhancements
 Mobile App: React Native version for iOS/Android

 Rich Text Editor: Markdown support with image uploads

 Data Export: Download journal entries as PDF/JSON

 Collaborative Journals: Share entries with family/friends

 Advanced Analytics: Mood tracking and visualization

 Voice Entries: Speech-to-text integration

 Multi-factor Authentication: Enhanced security with 2FA

 Webhooks: Integration with IFTTT/Zapier

 Recurring Reminders: Support for daily/weekly/monthly reminders

📄 License
This project is licensed under the MIT License.

👤 Contact
Gabriela Maricari
Full-Stack Developer | Django & React Specialist

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/Anyhia)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:gabriela.maricari@gmail.com) 
⭐ If you found this project interesting, please consider giving it a star!

This project was originally created as a final project for Harvard's CS50 Web Programming with Python and JavaScript course and has been significantly enhanced for production deployment.