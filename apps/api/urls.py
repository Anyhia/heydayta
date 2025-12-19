from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'api'

from .views import LogViewSet

router =DefaultRouter()
# Creates automatically the endpoints
router.register(r'logs', LogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]