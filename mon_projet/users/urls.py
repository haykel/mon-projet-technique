from django.urls import path
from .views import UserCreateAPIView, LoginAPIView, LogoutAPIView

urlpatterns = [
    path('register/', UserCreateAPIView.as_view(), name='api_register'),
    path('login/',    LoginAPIView.as_view(),      name='api_login'),
    path('logout/',   LogoutAPIView.as_view(),     name='api_logout'),
]