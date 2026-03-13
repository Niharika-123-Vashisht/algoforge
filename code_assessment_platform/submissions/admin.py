from django.contrib import admin
from .models import Submission


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'problem', 'language', 'status', 'time_seconds', 'created_at')
    list_filter = ('status', 'language')
    search_fields = ('user__username', 'problem__title')
    raw_id_fields = ('user', 'problem', 'language')
    readonly_fields = ('created_at',)
