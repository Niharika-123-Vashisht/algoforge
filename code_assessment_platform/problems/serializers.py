from django.db.models import Q
from rest_framework import serializers
from .models import Language, Problem, TestCase


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ('id', 'name', 'judge0_id', 'slug', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at')


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ('id', 'input_data', 'expected_output', 'is_sample', 'order')

    def validate_order(self, value):
        if value < 0:
            raise serializers.ValidationError('Order must be non-negative.')
        return value


class TestCaseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ('input_data', 'expected_output', 'is_sample', 'order')


class ProblemListSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    success_rate = serializers.SerializerMethodField()
    tags = serializers.ListField(child=serializers.CharField(), read_only=True)
    companies = serializers.ListField(child=serializers.CharField(), read_only=True)

    class Meta:
        model = Problem
        fields = ('id', 'title', 'difficulty', 'success_rate', 'tags', 'companies', 'created_by_username', 'created_at', 'is_active')

    def get_success_rate(self, obj):
        from django.db.models import Count
        stats = obj.submissions.aggregate(
            total=Count('id'),
            accepted=Count('id', filter=Q(status='accepted'))
        )
        total = stats['total'] or 0
        accepted = stats['accepted'] or 0
        if total == 0:
            return 0
        return round((accepted / total) * 100, 1)


class ProblemDetailSerializer(serializers.ModelSerializer):
    test_cases = TestCaseSerializer(many=True, read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    tags = serializers.ListField(child=serializers.CharField(), read_only=True)
    companies = serializers.ListField(child=serializers.CharField(), read_only=True)

    class Meta:
        model = Problem
        fields = (
            'id', 'title', 'description', 'sample_input', 'sample_output',
            'difficulty', 'time_limit_seconds', 'memory_limit_mb',
            'tags', 'companies', 'created_by', 'created_by_username', 'created_at', 'updated_at',
            'is_active', 'test_cases'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class ProblemCreateUpdateSerializer(serializers.ModelSerializer):
    test_cases = TestCaseCreateSerializer(many=True, required=False)

    class Meta:
        model = Problem
        fields = (
            'title', 'description', 'sample_input', 'sample_output',
            'difficulty', 'time_limit_seconds', 'memory_limit_mb',
            'is_active', 'test_cases'
        )

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Title cannot be empty.')
        return value.strip()

    def validate_difficulty(self, value):
        if value not in dict(Problem.DIFFICULTY_CHOICES):
            raise serializers.ValidationError('Invalid difficulty.')
        return value

    def validate_time_limit_seconds(self, value):
        if value <= 0 or value > 15:
            raise serializers.ValidationError('Time limit must be between 1 and 15 seconds.')
        return value

    def validate_memory_limit_mb(self, value):
        if value <= 0 or value > 512:
            raise serializers.ValidationError('Memory limit must be between 1 and 512 MB.')
        return value

    def create(self, validated_data):
        test_cases_data = validated_data.pop('test_cases', [])
        validated_data['created_by'] = self.context['request'].user
        problem = Problem.objects.create(**validated_data)
        for i, tc in enumerate(test_cases_data):
            TestCase.objects.create(problem=problem, order=i, **tc)
        return problem

    def update(self, instance, validated_data):
        test_cases_data = validated_data.pop('test_cases', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if test_cases_data is not None:
            instance.test_cases.all().delete()
            for i, tc in enumerate(test_cases_data):
                TestCase.objects.create(problem=instance, order=i, **tc)
        return instance
