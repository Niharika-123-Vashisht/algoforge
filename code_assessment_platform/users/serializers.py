from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password], style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'bio')
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'bio': {'required': False, 'allow_blank': True},
        }

    def validate_username(self, value):
        value = (value or '').strip()
        if not value:
            raise serializers.ValidationError('Username is required.')
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('This username is already taken.')
        return value

    def validate_email(self, value):
        value = (value or '').strip().lower()
        if not value:
            raise serializers.ValidationError('Email is required.')
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        attrs.pop('password_confirm', None)
        return attrs

    def create(self, validated_data):
        """
        Create user with hashed password via set_password (never store raw password).
        """
        password = validated_data.pop('password')
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        user = User(
            username=username,
            email=email,
            first_name=validated_data.pop('first_name', '') or '',
            last_name=validated_data.pop('last_name', '') or '',
            bio=validated_data.pop('bio', '') or '',
        )
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'bio', 'date_joined', 'created_at', 'updated_at')
        read_only_fields = ('id', 'username', 'date_joined', 'created_at', 'updated_at')


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'points', 'first_name', 'last_name')
