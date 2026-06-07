from django.db import migrations, models


def backfill_points_awarded_and_user_scores(apps, schema_editor):
    Submission = apps.get_model('submissions', 'Submission')
    User = apps.get_model('users', 'User')
    TestCase = apps.get_model('problems', 'TestCase')

    def is_sample_only(submission):
        if submission.is_sample_run:
            return True
        total_tests = TestCase.objects.filter(problem_id=submission.problem_id).count()
        results_len = len(submission.test_results or [])
        return total_tests > 0 and results_len < total_tests

    def is_complete(submission):
        if submission.status != 'accepted' or is_sample_only(submission):
            return False
        results = submission.test_results or []
        return bool(results) and all(r.get('status') == 'accepted' for r in results)

    difficulty_points = {'easy': 10, 'medium': 20, 'hard': 30}

    for user in User.objects.all().iterator():
        solved_problem_ids = set()
        total_points = 0

        submissions = Submission.objects.filter(
            user_id=user.id,
            status='accepted',
        ).order_by('created_at')

        for submission in submissions.iterator():
            if not is_complete(submission):
                continue
            if submission.problem_id in solved_problem_ids:
                continue

            Submission.objects.filter(pk=submission.pk).update(points_awarded=True)
            problem = submission.problem
            total_points += difficulty_points.get(problem.difficulty, 10)
            solved_problem_ids.add(submission.problem_id)

        User.objects.filter(pk=user.pk).update(points=total_points)


def reset_points_awarded(apps, schema_editor):
    Submission = apps.get_model('submissions', 'Submission')
    Submission.objects.update(points_awarded=False)


class Migration(migrations.Migration):
    dependencies = [
        ('submissions', '0004_submission_is_sample_run'),
        ('users', '0002_user_points'),
        ('problems', '0004_problem_companies'),
    ]

    operations = [
        migrations.AddField(
            model_name='submission',
            name='points_awarded',
            field=models.BooleanField(
                default=False,
                help_text='True when leaderboard points were granted for this submission.',
            ),
        ),
        migrations.RunPython(backfill_points_awarded_and_user_scores, reset_points_awarded),
    ]
