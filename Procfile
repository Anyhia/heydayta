web: gunicorn CS50w_final_project.wsgi --log-file -
worker: celery -A CS50w_final_project worker --loglevel=info --concurrency=1
