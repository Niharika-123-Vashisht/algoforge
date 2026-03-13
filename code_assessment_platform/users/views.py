from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import os
from urllib.parse import urlencode
from rest_framework.views import APIView
from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.views import PasswordResetView
from django.urls import reverse_lazy
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from .serializers import UserRegistrationSerializer, UserProfileSerializer, UserListSerializer, LeaderboardSerializer

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'token': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {'username': user.username, 'email': user.email}
    }


class RegisterView(generics.CreateAPIView):
    """Register a new user. POST: username, email, password. Returns token and user."""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = get_tokens_for_user(user)
        return Response(data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Login with email and password. POST: email, password. Returns token and user."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')
        if not email or not password:
            return Response(
                {'detail': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        user_auth = authenticate(request, username=user.username, password=password)
        if not user_auth:
            return Response(
                {'detail': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        data = get_tokens_for_user(user_auth)
        return Response(data, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get or update current user profile. Requires JWT."""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """List users (e.g. for leaderboard). Authenticated."""
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]


class LeaderboardView(generics.ListAPIView):
    """Top 10 users by points."""
    serializer_class = LeaderboardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.order_by("-points", "username")[:10]


class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client


class LogoutView(APIView):
    """Logout. Optionally blacklist refresh token if provided. Always returns success."""
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.data.get('refresh') if request.data else None
        if refresh:
            try:
                token = RefreshToken(refresh)
                token.blacklist()
            except Exception:
                pass
        return Response({'detail': 'Logged out.'}, status=status.HTTP_200_OK)


class PasswordResetRequestView(PasswordResetView):
    email_template_name = 'registration/password_reset_email.html'
    subject_template_name = 'registration/password_reset_subject.txt'
    success_url = reverse_lazy('password_reset_done')


def google_login_redirect(_request):
    return redirect('/accounts/google/login/?process=login&next=/api/auth/google/callback/')


def google_callback_jwt(request):
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5174').rstrip('/')
    if not request.user.is_authenticated:
        return redirect(f"{frontend_url}/oauth/callback?error=unauthorized")

    tokens = get_tokens_for_user(request.user)
    params = urlencode({'access': tokens['access'], 'refresh': tokens['refresh']})
    return redirect(f"{frontend_url}/oauth/callback?{params}")
