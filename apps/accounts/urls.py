from django.urls import path

from .views import UserCreateView, GoogleLoginAPIView, LogoutAPIView

app_name = 'accounts'

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='register'),
    path('google/', GoogleLoginAPIView.as_view(), name='google_login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
]