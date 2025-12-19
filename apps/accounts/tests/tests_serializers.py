from rest_framework.test import APITestCase
from apps.accounts.serializers import UserSerializer

from django.contrib.auth import get_user_model

# Create your tests here.
User=get_user_model()

class UserSerializerValidationTest(APITestCase):

    def test_serializer_data_is_valid(self):
        data={
            'username':'MariaTralala',
            'email':'maria@office.com',
            'password':'marci296^!',
        }

        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})

    def test_serializer_password_validation(self):
        data={
            'username':'MariaTralala',
            'email':'maria@office.com',
            'password':'123',
        }

        serializer = UserSerializer(data=data)
        # Should return false, weak password
        is_valid = serializer.is_valid()

        # check if it is False. If True, the test fails.
        self.assertFalse(is_valid) 
        # assertIn checks if something is inside a container(list,dict).
        # If a password error is not found, the test fails
        self.assertIn('password', serializer.errors)

    def test_serializer_username_field(self):
        data={
            'email':'maria@office.com',
            'password':'marci296^!',
        }

        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

    def test_serializer_email_field(self):
        data={
            'username':'MariaTralala',
            'email':'mariaoffice.com',
            'password':'marci296^!',
        }

        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)


class UserSerializerCreateTests(APITestCase):

    def test_serializer_user_create(self):
        # create the data for testing
        data={
            'username':'MariaTralala',
            'email':'maria@office.com',
            'password':'marico739ly*!',
        }

        # create the serializer with data
        serializer=UserSerializer(data=data)
        # Validate
        self.assertTrue(serializer.is_valid())

        # Save the data(create() is called now)
        user=serializer.save()

        # Check if the user was created and if it is correct
        self.assertIsNotNone(user)
        self.assertIsNotNone(user.id)
        self.assertEqual(user.username, 'MariaTralala')
        self.assertEqual(user.email, 'maria@office.com')


    def test_hashed_password(self):
        # create the data for testing
        data={
            'username':'MariaTralala',
            'email':'maria@office.com',
            'password':'marico739ly*!',
        }

        serializer=UserSerializer(data=data)
        serializer.is_valid()
        user = serializer.save()

        # Check that is not saved as plain text
        self.assertNotEqual(user.password, 'marico739ly*!')
        # Check if starts with pbkdf2_sha256$
        self.assertTrue(user.password.startswith('pbkdf2_sha256$'))
        # Check if it is correct
        self.assertTrue(user.check_password('marico739ly*!'))