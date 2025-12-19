from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    profile_image = models.ImageField(null=True, blank=True, upload_to='images', default='images/camera.jpg')
