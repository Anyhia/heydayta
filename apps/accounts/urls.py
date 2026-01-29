from django.urls import path

from .views import UserCreateView, GoogleLoginAPIView, LogoutAPIView, CurrentUserView

app_name = 'accounts'

urlpatterns = [
    path('register/', UserCreateView.as_view(), name='register'),
    path('google/', GoogleLoginAPIView.as_view(), name='google_login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
]