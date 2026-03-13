from django.db import models
from django.conf import settings


class Language(models.Model):
    """Supported programming language (maps to Judge0 language_id)."""
    name = models.CharField(max_length=100)
    judge0_id = models.IntegerField(unique=True)
    slug = models.SlugField(max_length=20, unique=True)  # e.g. python, cpp, javascript
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'languages'
        ordering = ['name']

    def __str__(self):
        return self.name


class Problem(models.Model):
    """Coding problem with description, sample I/O, and test cases."""
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    sample_input = models.TextField(blank=True)
    sample_output = models.TextField(blank=True)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='easy')
    time_limit_seconds = models.PositiveIntegerField(default=2)
    memory_limit_mb = models.PositiveIntegerField(default=256)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_problems'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    tags = models.JSONField(default=list, blank=True)  # e.g. ["Arrays", "Hash Map"]
    companies = models.JSONField(default=list, blank=True)  # e.g. ["Google", "Amazon", "Microsoft", "Meta"]

    class Meta:
        db_table = 'problems'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def difficulty_points(self):
        return {
            "easy": 10,
            "medium": 20,
            "hard": 30,
        }.get(self.difficulty, 10)


class TestCase(models.Model):
    """Input/output test case for a problem."""
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='test_cases')
    input_data = models.TextField()
    expected_output = models.TextField()
    is_sample = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'test_cases'
        ordering = ['problem', 'order', 'id']

    def __str__(self):
        return f'{self.problem.title} - Test #{self.order}'
