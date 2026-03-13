from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('google/', views.GoogleLoginView.as_view(), name='google_login'),
    path('google/callback/', views.google_callback_jwt, name='google-callback'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
    path('google/redirect/', views.google_login_redirect, name='google-login-redirect'),
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
]
