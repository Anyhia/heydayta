from django.shortcuts import render
from rest_framework import generics
from rest_framework import serializers
from .serializers import UserSerializer
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
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


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Return the current authenticated user's info
        return Response({
            'username': request.user.username,
            'email': request.user.email,
            'id': request.user.id
        })


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
            print(f"✅ Google token verified for: {email}")

            try:
                user=User.objects.get(email=email)
                created = False # If the user exists, give a welcome back message or something
                print(f"✅ Existing user found: {user.username}") 
            except User.DoesNotExist:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=None, # Unusable value
                )
                user.set_unusable_password() # For Google authentication, nobody can log in with a password (only with Google).
                user.save()
                created = True
                print(f"✅ New user created: {user.username}")

            # Prepare data for frontend
            serializer = UserSerializer(user)
            # Set tokens with rest_framework_simplejwt.tokens
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)

            print(f"✅ JWT tokens generated")

            # Create response with access token and username only
            response = Response({
                'access': access,
                'username': serializer.data['username'],
                'created': created,
            })
            print(f"✅ Response object created, about to set cookie")

            # Store refresh token in httpOnly cookie (same as regular login)
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                max_age=60*60*24*7,  # 7 days
                httponly=True,
                secure=os.getenv('DEBUG', 'False') != 'True',
                samesite='Lax',
                path='/'
            )
            print(f"✅ Cookie set! Value: {str(refresh)[:20]}...")
            return response

        except ValueError:
            print(f"❌ Google token verification failed")
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
                secure=os.getenv('DEBUG', 'False') != 'True',  # True in production, False locally
                samesite='Lax',
                path='/'
            )
            
            # Remove refresh token from response body to return only the access token
            del response.data['refresh']
            

        return response

# CUSTOM SERIALIZER: Reads refresh token from cookie instead of request body
class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    
    # Tell Django: "Don't expect 'refresh' in the request body"
    refresh = None
    
    def validate(self, attrs):
        # Get the refresh token from the cookie
        refresh_token = self.context['request'].COOKIES.get('refresh_token')
        
        # If no cookie, raise an error immediately
        if not refresh_token:
            raise serializers.ValidationError('No refresh token provided')
        
        # Set the token for validation
        attrs['refresh'] = refresh_token
        
        # Validate the token and generate a new access token
        return super().validate(attrs)


# CUSTOM VIEW: Uses our custom serializer that reads from cookies
class CustomTokenRefreshView(TokenRefreshView):
    # Use CookieTokenRefreshSerializer instead of the default one
    serializer_class = CookieTokenRefreshSerializer

    

class LogoutAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        response = Response({'message': 'Logged Out'})
        
        # Django's delete_cookie() has a known quirk where it doesn't always match
        # the exact parameters used in set_cookie(). To reliably delete the cookie,
        # we use set_cookie() with max_age=0 (which expires it immediately) and
        # match ALL parameters exactly as they were set during login.
        response.set_cookie(
            key='refresh_token',
            value='',  # Empty value
            max_age=0,  # Expires immediately - deletes the cookie
            httponly=True,  # Must match the set_cookie parameters
            secure=os.getenv('DEBUG', 'False') != 'True',  # Must match
            samesite='Lax',  # Must match
            path='/'  # Must match
        )
        return response