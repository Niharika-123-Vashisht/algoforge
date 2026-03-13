from django.db import models
from django.conf import settings


class Submission(models.Model):
    """User code submission for a problem."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('accepted', 'Accepted'),
        ('wrong_answer', 'Wrong Answer'),
        ('time_limit', 'Time Limit Exceeded'),
        ('memory_limit', 'Memory Limit Exceeded'),
        ('runtime_error', 'Runtime Error'),
        ('compile_error', 'Compilation Error'),
        ('internal_error', 'Internal Error'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    problem = models.ForeignKey(
        'problems.Problem',
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    language = models.ForeignKey(
        'problems.Language',
        on_delete=models.PROTECT,
        related_name='submissions'
    )
    source_code = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    judge0_token = models.CharField(max_length=100, blank=True)
    stdout = models.TextField(blank=True)
    stderr = models.TextField(blank=True)
    compile_output = models.TextField(blank=True)
    time_seconds = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True)
    memory_kb = models.PositiveIntegerField(null=True, blank=True)
    test_results = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'submissions'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.problem.title} ({self.status})'
