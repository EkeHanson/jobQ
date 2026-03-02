from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='auth-register'),
    path('login/', views.LoginView.as_view(), name='auth-login'),
    path('google/', views.GoogleLoginView.as_view(), name='auth-google'),
    path('linkedin/', views.LinkedInLoginView.as_view(), name='auth-linkedin'),
    path('logout/', views.LogoutView.as_view(), name='auth-logout'),
    path('me/', views.MeView.as_view(), name='auth-me'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
