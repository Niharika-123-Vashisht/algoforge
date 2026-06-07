from django.db import migrations, models


def mark_legacy_sample_runs(apps, schema_editor):
    """Tag older accepted submissions that only ran sample test cases."""
    Submission = apps.get_model('submissions', 'Submission')
    TestCase = apps.get_model('problems', 'TestCase')

    for submission in Submission.objects.all().iterator():
        total_tests = TestCase.objects.filter(problem_id=submission.problem_id).count()
        if total_tests == 0:
            continue
        results_count = len(submission.test_results or [])
        if results_count < total_tests:
            Submission.objects.filter(pk=submission.pk).update(is_sample_run=True)


def unmark_legacy_sample_runs(apps, schema_editor):
    Submission = apps.get_model('submissions', 'Submission')
    Submission.objects.update(is_sample_run=False)


class Migration(migrations.Migration):
    dependencies = [
        ('submissions', '0003_submission_test_results'),
        ('problems', '0004_problem_companies'),
    ]

    operations = [
        migrations.AddField(
            model_name='submission',
            name='is_sample_run',
            field=models.BooleanField(
                default=False,
                help_text='True when only sample test cases were executed (Run), not a full submit.',
            ),
        ),
        migrations.RunPython(mark_legacy_sample_runs, unmark_legacy_sample_runs),
    ]
