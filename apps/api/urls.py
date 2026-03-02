from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LogViewSet, PushSubscriptionView, VapidPublicKeyView

app_name = 'api'

from .views import LogViewSet

router =DefaultRouter()
# Creates automatically the endpoints
router.register(r'logs', LogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('push/subscribe/', PushSubscriptionView.as_view(), name='push_subscribe'),
    path('push/vapid-public-key/', VapidPublicKeyView.as_view(), name='vapid_public_key'),
]