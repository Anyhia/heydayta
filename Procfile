web: gunicorn CS50w_final_project.wsgi --log-file -
worker: celery -A CS50w_final_project worker --loglevel=info
beat: celery -A CS50w_final_project beat --loglevel=inf