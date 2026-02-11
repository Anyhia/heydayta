python3 -m venv venv
deactivate
source venv/bin/activate

<!--The dot creates the project inside the directory you are in  -->
django-admin startproject nameoftheproject .   

<!-- Updating the package list with sudo apt update ensures that you have the latest information about available packages and their versions from the repositories. This helps avoid issues with outdated packages or dependencies when you install new software. The package list is essentially a database of available software packages that your system can install. -->
sudo apt update
sudo apt install postgresql postgresql-contrib

<!-- to connect as the postgres superuser -->
sudo -u postgres psql 

<!-- Enter psql shell -->
psql -d your_database_name

<!-- Quit psql command-line tool -->
\q

<!-- To check which user you are currently logged in as, you can run this command  -->
SELECT current_user;

<!-- celery -->
celery -A CS50w_final_project worker --loglevel=info

<!-- redis -->
redis-server


cd your-project-root
tree

<!-- Heroku - you can view your logs anytime with:  -->
heroku addons:open papertrail --app heydayta