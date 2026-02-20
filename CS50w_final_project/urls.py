"""
URL configuration for CS50w_final_project project.

"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.accounts.views import CustomTokenObtainPairView, CustomTokenRefreshView

from django.views.generic import TemplateView
from django.conf import settings
import os

from django.views.static import serve



urlpatterns = [
    path(os.environ.get('DJANGO_ADMIN_URL', 'admin/'), admin.site.urls),
    path('api/', include('apps.api.urls', namespace='api')),
    path('api/accounts/', include('apps.accounts.urls', namespace='accounts')),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),

    # Serve React root files (manifest, favicon, logos) directly from build folder
    # These must come before the catch-all route to index.html
    path('manifest.json', serve, {'document_root': settings.BASE_DIR / 'frontend/build', 'path': 'manifest.json'}),
    path('favicon.ico', serve, {'document_root': settings.BASE_DIR / 'frontend/build', 'path': 'favicon.ico'}),
    path('android-chrome-192x192.png', serve, {'document_root': settings.BASE_DIR / 'frontend/build', 'path': 'android-chrome-192x192.png'}),
    path('android-chrome-512x512.png', serve, {'document_root': settings.BASE_DIR / 'frontend/build', 'path': 'android-chrome-512x512.png'}),
    path('apple-touch-icon.png', serve, {'document_root': settings.BASE_DIR / 'frontend/build', 'path': 'apple-touch-icon.png'}),
    path('robots.txt', serve, {'document_root': settings.BASE_DIR / 'frontend/build', 'path': 'robots.txt'}),

    re_path(r'^(?!captain-bridge-desk|api).*$', TemplateView.as_view(
        template_name='index.html',
        extra_context={'STATIC_URL': settings.STATIC_URL}
    )),

]
