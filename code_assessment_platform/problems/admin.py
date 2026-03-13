from django.contrib import admin
from .models import Language, Problem, TestCase


class TestCaseInline(admin.TabularInline):
    model = TestCase
    extra = 1


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'judge0_id', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'slug')


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('title', 'difficulty', 'created_by', 'is_active', 'created_at')
    list_filter = ('difficulty', 'is_active')
    search_fields = ('title', 'description')
    inlines = [TestCaseInline]
    raw_id_fields = ('created_by',)


@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    list_display = ('problem', 'order', 'is_sample')
    list_filter = ('is_sample',)
