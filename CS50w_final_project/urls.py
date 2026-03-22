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
from django.views.decorators.cache import never_cache



urlpatterns = [
    path(os.environ.get('DJANGO_ADMIN_URL', 'admin/'), admin.site.urls),
    path('api/', include('apps.api.urls', namespace='api')),
    path('api/accounts/', include('apps.accounts.urls', namespace='accounts')),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),


    re_path(r'^(?!captain-bridge-desk|api).*$', never_cache(TemplateView.as_view(
        template_name='index.html',
        extra_context={'STATIC_URL': settings.STATIC_URL}
    ))),

]
