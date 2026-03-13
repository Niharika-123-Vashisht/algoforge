from rest_framework import serializers
from .models import Submission
from problems.models import Problem, Language

# Only these languages are sent to Judge0; prevents arbitrary language_id abuse
ALLOWED_LANGUAGE_SLUGS = frozenset({"python", "cpp", "java", "javascript"})


class SubmissionListSerializer(serializers.ModelSerializer):
    problem_title = serializers.CharField(source='problem.title', read_only=True)
    language_name = serializers.CharField(source='language.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Submission
        fields = (
            'id', 'user', 'username', 'problem', 'problem_title', 'language', 'language_name',
            'status', 'time_seconds', 'memory_kb', 'test_results', 'created_at'
        )


class SubmissionDetailSerializer(serializers.ModelSerializer):
    problem_title = serializers.CharField(source='problem.title', read_only=True)
    language_name = serializers.CharField(source='language.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Submission
        fields = (
            'id', 'user', 'username', 'problem', 'problem_title', 'language', 'language_name',
            'source_code', 'status', 'stdout', 'stderr', 'compile_output',
            'time_seconds', 'memory_kb', 'test_results', 'judge0_token', 'created_at'
        )


class SubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ('problem', 'language', 'source_code')

    def validate_problem(self, value):
        if not Problem.objects.filter(id=value.id, is_active=True).exists():
            raise serializers.ValidationError('Problem not found or inactive.')
        return value

    def validate_language(self, value):
        if not value.is_active:
            raise serializers.ValidationError('Language is not supported.')
        if value.slug not in ALLOWED_LANGUAGE_SLUGS:
            raise serializers.ValidationError(
                'Only Python, C++, Java, and JavaScript are allowed for submission.'
            )
        return value

    def validate_source_code(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Source code cannot be empty.')
        if len(value) > 100_000:
            raise serializers.ValidationError('Source code too long.')
        return value
