from rest_framework.test import APITestCase
from rest_framework import status
from apps.accounts.serializers import UserSerializer

from django.contrib.auth import get_user_model
from django.urls import reverse

# Create your tests here.
User=get_user_model()

class UserRegisterViewTest(APITestCase):

    def setUp(self):
        self.url = reverse('accounts:register')

    def test_registration_success(self):
        data={
            'username':'MariaTralala',
            'email':'maria@office.com',
            'password':'marci296^!',
        }

        # Make a POST request with the data
        # Response is the data that it is send back from the API after processing their request
        response = self.client.post(self.url, data)

        # Chack status
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Chef if the username exists and it is correct 
        self.assertEqual(response.data['username'], 'MariaTralala')

        # Password is not send back to the frontend
        self.assertNotIn('password', response.data)

        # Check if the user exists in database
        self.assertTrue(User.objects.filter(username='MariaTralala'))

    def test_password_missing(self):
        data = {
            'username':'MariaTralala',
            'email':'maria@office.com',
        }

        response = self.client.post(self.url, data)

        # Check status code is 400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        #  Checks if the password in errors (response contains errors)
        self.assertIn('password', response.data)


    def test_email_missing(self):
        data = {
            'username':'MariaTralala',
            'password':'marci296^!',
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)