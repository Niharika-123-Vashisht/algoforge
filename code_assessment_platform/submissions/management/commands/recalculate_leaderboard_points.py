from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from submissions.models import Submission
from submissions.services import is_complete_acceptance, sync_user_points


class Command(BaseCommand):
    help = 'Recalculate user leaderboard points from accepted full submissions.'

    def handle(self, *args, **options):
        User = get_user_model()
        updated_count = 0

        for user in User.objects.all().order_by('username'):
            solved_problem_ids = set()

            submissions = Submission.objects.filter(
                user=user,
                status='accepted',
            ).select_related('problem').prefetch_related('problem__test_cases').order_by('created_at')

            for submission in submissions:
                Submission.objects.filter(pk=submission.pk).update(points_awarded=False)

            for submission in submissions:
                if submission.problem_id in solved_problem_ids:
                    continue
                if is_complete_acceptance(submission):
                    Submission.objects.filter(pk=submission.pk).update(points_awarded=True)
                    solved_problem_ids.add(submission.problem_id)

            old_points = user.points
            new_points = sync_user_points(user)
            if old_points != new_points:
                self.stdout.write(f'{user.username}: {old_points} -> {new_points}')
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Leaderboard recalculation complete. Updated {updated_count} user(s).'
            )
        )
