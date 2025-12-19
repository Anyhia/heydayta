# HeyDayta

HeyDayta is a Star‑Trek‑flavored memory vault that turns your life into a personal captain's log. Inspired by Data's flawless memory, it lets you record important moments, query your past in natural language, and summon reminders exactly when you need them.

## Description

HeyDayta is an interactive journal that turns your life into a searchable archive, letting you write personal logs, set email reminders, and query your past with natural‑language questions such as 'When was the last time I went to Brugge?'. Under the hood, HeyDayta runs on a Django REST Framework API with a React frontend, PostgreSQL database, and Celery workers that send reminder emails in the background.

## Features

- Private feed showing only the signed‑in user's entries

- Two entry types:

    - Journal – free‑form notes and memories

    - Reminder – entries that trigger scheduled email notifications

- Basic filters by type and category

- Natural‑language search over your own entries, using OpenAI embeddings behind the scenes

- Modern, LCARS‑inspired dark UI built with React‑Bootstrap

## Tech Stack

Backend: 
Django

    - Django REST Framework

    - PostgreSQL

    - Celery for background tasks (email reminders)

    - pgvector for storing embeddings

    - OpenAI Python client for embeddings and Q&A over entries

Authentication: 

    - djangorestframework-simplejwt with the access token returned in JSON and the refresh token stored in an httpOnly cookie​

    - Protected DRF viewsets that only return the signed‑in user's logs

    - Google OAuth login with a custom DRF endpoint

Frontend: 

    - React

    - React‑Bootstrap

    - Axios

    - React Router

    - Font Awesome

    - Google OAuth 

## Installation

    - Backend: create and activate a virtual env, install requirements.txt, configure environment variables (SECRET_KEY, PostgreSQL, JWT settings, email settings, and Celery broker), run migrate, then start the Django server on http://localhost:8000

    - Celery: run a Redis server, then start a Celery worker so reminder emails can be queued and sent.

    - Frontend: install dependencies, then start the React dev server; the Axios instance is configured with baseURL: http://localhost:8000/api so it talks to the Django API


## Getting started

Prerequisites

    Python and Node.js

    PostgreSQL

    Redis (as Celery broker in development)

    Celery (running with Redis) for reminder emails

Backend setup

    Clone the repo and create a virtual env

    Install Python dependencies from requirements.txt

    Create a PostgreSQL database and user, then run Django migrations

    Create a .env with SECRET_KEY, PostgreSQL DB, OPENAI_API_KEY, and Google OAuth ID and Secret; other settings (JWT and Celery) are configured directly in settings.py


Frontend setup

    - From the frontend folder, install Node dependencies

    - Create a .env for the frontend with REACT_APP_GOOGLE_CLIENT_ID for Google login. The Axios instance is configured with baseURL: http://localhost:8000/api so it talks to the Django API

Run the app (development):

    - Django / DRF server: python manage.py runserver in the backend folder

    - React dev server: npm start (or your runner) in the frontend folder

    - Celery worker: celery -A cs50-final-project worker --loglevel=info in the backend folder

    - Redis: run a local Redis server, Celery will use it as broker

## Usage

    - Register or log in, then create either journal entries or reminders

    - Journal entries store your text and optional category; reminder entries also store a reminder time and later trigger an email

    - Use the search box to ask natural‑language questions about your past (for example 'When was the last time I went to Brugge?') 
      and see answers based on your own entries.


## Distinctiveness and Complexity


This project started from the idea that modern life produces many small but important memories that are easy to lose. Instead of scrolling through old notes to find a specific moment, you have a personal history that is easier to search and revisit. The idea was to have something a bit like Data from Star Trek: not just a basic journal, but an interactive memory vault where you ask in normal language and get answers from your own past entries.

The app is also different from a basic journal because of the Ask Dayta feature. Instead of only listing entries, the backend creates embeddings for each log and for each question, stores them in a pgvector field in PostgreSQL, and uses them to find the most relevant memories. OpenAI is then used to answer in natural language, so you can type things like 'When was my last trip to Brugge?' and get a readable answer instead of a raw list of records. 

Compared to my previous Django projects, here I used Django REST Framework for the backend and React for the frontend, so the two parts talk to each other through a JSON API, so the backend sends and receives data as JSON instead of HTML pages. The backend uses DRF viewsets and routers, and the React app calls those endpoints with Axios and React Router. Getting them to work well together meant dealing with CORS and cookies and learning how to design and test the endpoints It was also my first time using React hooks, context and route protection, which made the project more challenging.

Authentication was one of the challenging parts. The app uses JWT tokens with djangorestframework-simplejwt, with the access token in JSON and the refresh token stored in an httpOnly cookie for better security. On the frontend there is a Axios instance, a setApiToken helper, and interceptors that attach the Authorization header and try to refresh the token on 401 responses. At first this did not always work: sometimes /logs/ was called before the Axios request interceptor had been attached, because the interceptor was defined inside App.js, so the request went out without the Authorization header. Moving the interceptor setup into the api module (next to the Axios instance) and letting React update the token used by that instance fixed the bug. React StrictMode made the problem more visible in development by causing the effect in App.js to run twice. So two /logs/ requests were sent: one before the interceptor was ready (and it failed) and one after the interceptor was attached (and it worked).

The auth system also includes Google login with a custom DRF view that verifies the Google ID token, creates or finds the user, and then issues the same JWT tokens as the normal login flow. To support Google sign in, I combined three parts: a React Google OAuth library on the frontend, Google's Python library on the backend to verify the Google ID token, and SimpleJWT to create my own access and refresh tokens after the Google token is validated. Getting all of this right required reading documentation for DRF, SimpleJWT, CORS, cookies, and Google OAuth and making them work together.​

Instead of SQLite, the app uses PostgreSQL with the pgvector extension so that each log can store an embedding vector from the OpenAI API and be searched with vector similarity queries. This kind of built‑in vector search is the main reason I choose Postgres for this project. Celery has its own configuration and processes to run, which adds complexity compared to a previous apps. It runs reminder work in the background, so reminders do not block normal requests. On the frontend, React‑Bootstrap and custom CSS are used to build a responsive LCARS‑style interface.

Overall, HeyDayta combines several different elements in one project: a Django REST Framework backend, a React single‑page app (React handles navigation), JWT auth with httpOnly cookies and interceptors, Google OAuth, Celery workers with Redis, PostgreSQL with pgvector, and OpenAI‑based embeddings and question answering.

This is more than a standard CRUD site and required solving real integration problems, especially with authentication, tokens, and cross‑origin communication between the React app and the DRF API.



## Architecture and Implementation Notes

    - Shared Axios instance with auth header: I moved the request interceptor into the api.js file and added a setApiToken function so React can update the token that Axios uses for the Authorization header before components send requests (this fixed the problem where the request to /logs/ was sent before the Authorization header was added)

    - AuthProvider and loading state: added an AuthProvider context that calls /token/refresh/ when the app starts and uses a loading flag so protected pages do not send the user to the login screen while the refresh request is still running.

    - Email: in development, Django uses the console email backend, so reminder emails are printed to the terminal instead of being sent. You can switch to an SMTP backend later by updating the email settings in settings.py

    - Make sure to access both apps through http://localhost (not 127.0.0.1), so cookies and CORS work correctly between the React frontend (http://localhost:3000) and the Django API (http://localhost:8000).


## Project Structure

Backend (Django / DRF):

    - The backend is split into two Django apps: accounts for authentication and user management, and api for logs, reminders, and Ask Dayta endpoints

    - manage.py – Django's main entry point for running the server and management commands

    - CS50w_final_project/settings.py – global project settings (database, apps, JWT, Celery, CORS, email, etc)

    - CS50w_final_project/urls.py – root URL configuration that includes app URLs

    - CS50w_final_project/celery.py – Celery configuration so reminder email tasks run in the background

    Accounts:

        - apps/accounts/models.py – custom User model used for authentication

        - apps/accounts/serializers.py – serializers for user registration and auth

        - apps/accounts/views.py – auth views (JWT login, logout, Google login API)

        - apps/accounts/urls.py – URL routes for account and auth endpoints

        - apps/accounts/tests.py – tests for the accounts app 

    API:

        - apps/api/models.py – Log model with fields for entry type, category, reminder time, status, and embedding vector

        - apps/api/serializers.py – DRF serializers for logs

        - apps/api/views.py – LogViewSet and API views for creating logs, reminders, and for Ask Dayta questions

        - apps/api/helpers.py – helper functions for OpenAI embeddings, reminder time extraction, and question answering

        - apps/api/tasks.py – Celery tasks that send reminder emails based on saved logs

        - apps/api/urls.py – API URL routes 


Frontend (React)

    frontend/src/index.js – React entry point that renders the app

    frontend/src/index.css – global styles

    frontend/src/App.js – main app component that sets up routes and wraps the app in providers

    frontend/src/api.js – Axios instance with baseURL and auth header logic

    Components: 

        - Auth/AuthProvider.js – React context that keeps the current user's token and username, calls /token/refresh/ when the app starts to restore the session, and provides simple login and logout functions to the rest of the app

        - Auth/ProtectedRoute.js – wrapper that only shows children when the user is authenticated

        - Auth/Login.js – login form for username/password auth

        - Auth/Register.js – registration form for new users

        - Auth/Logout.js – logout button 

        - Auth/GoogleLoginButton.js – button that starts Google login and calls the backend Google login API

        - NavBar.js – navbar with user dropdown

        - About.js – page describing the app

        - Log.js – form for creating new journal entries or reminder entries

        - ShowLogs.js – list that shows the current user's logs

        - Question.js – Ask Dayta component where users type questions

Other

    requirements.txt – Python dependencies needed to run the backend and Celery worker

    RESOURCES.md – list of tutorials, articles, and documentation pages that were used while building the project


## Future Improvements

HeyDayta was originally imagined as a mobile‑first memory app with voice input: speaking entries instead of typing, setting reminders by voice, and asking questions using the Web Speech API for speech‑to‑text and voice control. Having a DRF backend and a React frontend should make it easier to add a mobile client later, because the same REST API can be reused by a React Native or other mobile app instead of being tied to pages rendered directly by Django templates.

For background jobs, a next step would be to run Celery workers as daemons in production so the reminder worker keeps running reliably in the background. The reminder model could also be improved with tracking fields like sent, sent_at, or a status field (pending/sent/failed) to make it easier to debug 'Why didn’t I get my reminder?' and to support cancelling or expiring reminders that are no longer needed.
