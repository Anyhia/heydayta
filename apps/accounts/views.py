from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import get_user_model
import os


User = get_user_model()

# Create your views here.
class UserCreateView(generics.CreateAPIView):
    serializer_class = UserSerializer


class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]  # This line is critical. It means that this view does not require the user to be authenticated.
    def post(self, request):
        # Get the token from React
        token = request.data.get('token', None)

        if not token:
            return Response({'error':'Token required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verify token using Google's library
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                os.environ.get('GOOGLE_CLIENT_ID')
            )
            email=idinfo.get('email')
            username=idinfo.get('name')

            try:
                user=User.objects.get(email=email)
                created = False # If the user exists, give a welcome back message or something
            except User.DoesNotExist:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=None, # Unusable value
                )
                user.set_unusable_password() # For Google authentication, nobody can log in with a password (only with Google).
                user.save()
                created = True

            # Prepare data for frontend
            serializer = UserSerializer(user)
            # Set tokens with rest_framework_simplejwt.tokens
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)

            # Create response with access token and username only
            response = Response({
                'access': access,
                'username': serializer.data['username'],
                'created': created,
            })

            # Store refresh token in httpOnly cookie (same as regular login)
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                max_age=60*60*24*7,  # 7 days
                httponly=True,
                secure=False,  # Set to True in production with HTTPS
                samesite='Lax',
                path='/'
            )

            return response

        except ValueError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        
        


# User logs in → CustomTokenObtainPairView -> get access + refresh tokens​​
# User makes requests -> use access token (15 min)​
# Access token expires -> CustomTokenRefreshView → use refresh token to get new access token​​
# Refresh token expires -> user must log in again

# Custom view to get access token(saved in React) and refresh token(saved in httpOnly cookie)
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs) # Django's TokenObtainPairView returns a response with both tokens
        if response.status_code == 200:
            refresh_token = response.data['refresh']
            
            # Set refresh token in httpOnly cookie
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                max_age=60*60*24*7,
                httponly=True,  # Can't be accessed by JavaScript
                secure=False,    # Only sent over HTTPS
                samesite='Lax',
                path='/'
            )
            
            # Remove refresh token from response body to return only the access token
            del response.data['refresh']
            
        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Get refresh token from httpOnly cookie instead of request body
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token:
            # Create a mutable copy of the request data
            mutable_data = request.data.copy()
            
            # Add the refresh token from the cookie to the request data
            mutable_data['refresh'] = refresh_token
            
            # Update the underlying Django request POST data
            # This is the source of truth that Django REST Framework reads from
            # Setting request._request.POST ensures SimpleJWT can find the token
            request._request.POST = mutable_data
        
        # Call the parent class method to process the token refresh
        return super().post(request, *args, **kwargs)
    

class LogoutAPIView(APIView):
    def post(self, request):
        # Create the Response object and delete the refresh token
        # Add the SimpleJWT blacklist later
        response = Response({'message':'Logged Out'})
        response.delete_cookie('refresh_token')
        return response