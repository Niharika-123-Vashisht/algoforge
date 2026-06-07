"""
Judge0 API integration and leaderboard scoring.
"""
import logging

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import F

logger = logging.getLogger(__name__)

JUDGE0_STATUS_MAP = {
    1: "pending",
    2: "running",
    3: "accepted",
    4: "wrong_answer",
    5: "time_limit",
    6: "memory_limit",
    7: "runtime_error",
    8: "compile_error",
    9: "internal_error",
}

VERDICT_DISPLAY = {
    "accepted": "Accepted",
    "wrong_answer": "Wrong Answer",
    "time_limit": "Time Limit Exceeded",
    "memory_limit": "Memory Limit Exceeded",
    "runtime_error": "Runtime Error",
    "compile_error": "Compilation Error",
    "internal_error": "Internal Error",
    "pending": "Pending",
    "running": "Running",
}

MAX_CPU_TIME_SEC = 2
MAX_MEMORY_MB = 256
MAX_WALL_TIME_SEC = 15
MAX_FILE_SIZE_KB = 1024
MAX_STDOUT_STDERR_CHARS = 50_000


def _cap_cpu_time(seconds):
    try:
        s = int(seconds)
    except (TypeError, ValueError):
        s = MAX_CPU_TIME_SEC
    return min(max(s, 1), MAX_CPU_TIME_SEC)


def _cap_memory_kb(memory_limit_mb):
    try:
        mb = int(memory_limit_mb)
    except (TypeError, ValueError):
        mb = MAX_MEMORY_MB
    mb = min(max(mb, 16), MAX_MEMORY_MB)
    return mb * 1024


def execute_code(
    source_code: str,
    language_id: int,
    stdin: str = "",
    expected_output: str = None,
    time_limit: int = None,
    memory_limit_mb: int = None,
) -> dict:
    cpu_sec = _cap_cpu_time(time_limit if time_limit is not None else MAX_CPU_TIME_SEC)
    memory_kb = _cap_memory_kb(memory_limit_mb if memory_limit_mb is not None else MAX_MEMORY_MB)

    url = f"{settings.JUDGE0_BASE_URL.rstrip('/')}/submissions"
    params = {"base64_encoded": "false", "wait": "true"}
    headers = {"Content-Type": "application/json"}
    if getattr(settings, "JUDGE0_API_KEY", None):
        headers["X-Auth-Token"] = settings.JUDGE0_API_KEY

    payload = {
        "source_code": source_code,
        "language_id": language_id,
        "stdin": stdin or "",
        "cpu_time_limit": float(cpu_sec),
        "cpu_extra_time": 0.5,
        "wall_time_limit": float(MAX_WALL_TIME_SEC),
        "memory_limit": float(memory_kb),
        "max_file_size": MAX_FILE_SIZE_KB,
        "enable_network": False,
    }
    if expected_output is not None:
        payload["expected_output"] = expected_output

    http_timeout = int(MAX_WALL_TIME_SEC) + 25

    try:
        resp = requests.post(
            url, params=params, headers=headers, json=payload, timeout=http_timeout
        )
        resp.raise_for_status()
        data = resp.json()
    except requests.Timeout:
        return {
            "status": "time_limit",
            "stdout": "",
            "stderr": "Execution timed out waiting for Judge0 (wall time).",
            "compile_output": "",
            "time": None,
            "memory": None,
            "token": None,
        }
    except requests.RequestException as e:
        return {
            "status": "internal_error",
            "stdout": "",
            "stderr": str(e),
            "compile_output": "",
            "time": None,
            "memory": None,
            "token": None,
        }

    status_id = data.get("status", {}).get("id")
    our_status = JUDGE0_STATUS_MAP.get(status_id, "internal_error")

    def _truncate(text):
        if not text:
            return ""
        if len(text) > MAX_STDOUT_STDERR_CHARS:
            return text[: MAX_STDOUT_STDERR_CHARS] + "\n... [truncated]"
        return text

    return {
        "status": our_status,
        "stdout": _truncate(data.get("stdout") or ""),
        "stderr": _truncate(data.get("stderr") or ""),
        "compile_output": _truncate(data.get("compile_output") or ""),
        "time": data.get("time"),
        "memory": data.get("memory"),
        "token": data.get("token"),
    }


def verdict_to_display(status_slug: str) -> str:
    return VERDICT_DISPLAY.get(status_slug, status_slug.replace("_", " ").title())


def parse_bool(value, default=False):
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in ('true', '1', 'yes', 'on')
    return bool(value)


def _total_test_count(problem):
    if hasattr(problem, '_prefetched_objects_cache') and 'test_cases' in problem._prefetched_objects_cache:
        return len(problem.test_cases.all())
    return problem.test_cases.count()


def is_sample_only_submission(submission, problem=None):
    """Detect Run (sample-only) submissions even for legacy rows."""
    if getattr(submission, 'is_sample_run', False):
        return True

    problem = problem or submission.problem
    total_tests = _total_test_count(problem)
    results_len = len(submission.test_results or [])
    return total_tests > 0 and results_len < total_tests


def is_complete_acceptance(submission, problem=None):
    """
    A full submit that passed every executed test case.
    Trusts submission.status='accepted' for non-sample runs.
    """
    if submission.status != 'accepted':
        return False
    if is_sample_only_submission(submission, problem):
        return False

    results = submission.test_results or []
    if not results:
        return False

    return all(result.get('status') == 'accepted' for result in results)


def user_has_solved_problem(user, problem, exclude_submission_id=None):
    """True if user already received points for this problem."""
    from .models import Submission

    awarded_qs = Submission.objects.filter(
        user=user,
        problem=problem,
        points_awarded=True,
    )
    if exclude_submission_id:
        awarded_qs = awarded_qs.exclude(id=exclude_submission_id)
    if awarded_qs.exists():
        return True

    queryset = Submission.objects.filter(
        user=user,
        problem=problem,
        status='accepted',
        is_sample_run=False,
    )
    if exclude_submission_id:
        queryset = queryset.exclude(id=exclude_submission_id)

    for prior in queryset.select_related('problem').iterator():
        if is_complete_acceptance(prior, problem):
            return True
    return False


def award_leaderboard_points(user, problem, submission):
    """
    Award problem points on first complete acceptance.
    Returns (awarded, points_added, new_total).
    """
    User = get_user_model()

    logger.info(
        '[LEADERBOARD] Evaluating points: user_id=%s problem_id=%s submission_id=%s '
        'verdict=%s is_sample_run=%s results=%s',
        user.id,
        problem.id,
        submission.id,
        submission.status,
        submission.is_sample_run,
        len(submission.test_results or []),
    )

    if not is_complete_acceptance(submission, problem):
        logger.info(
            '[LEADERBOARD] Points NOT awarded: not a complete full acceptance '
            '(user_id=%s, problem_id=%s, submission_id=%s)',
            user.id,
            problem.id,
            submission.id,
        )
        user = User.objects.filter(pk=user.pk).only('points').first()
        return False, 0, user.points if user else 0

    with transaction.atomic():
        locked_user = User.objects.select_for_update().get(pk=user.pk)

        if user_has_solved_problem(locked_user, problem, exclude_submission_id=submission.id):
            logger.info(
                '[LEADERBOARD] Points NOT awarded: duplicate solve '
                '(user_id=%s, problem_id=%s, submission_id=%s)',
                locked_user.id,
                problem.id,
                submission.id,
            )
            return False, 0, locked_user.points

        from .models import Submission as SubmissionModel

        points_to_add = problem.difficulty_points()
        User.objects.filter(pk=locked_user.pk).update(points=F('points') + points_to_add)
        SubmissionModel.objects.filter(pk=submission.pk).update(points_awarded=True)

        locked_user.refresh_from_db(fields=['points'])
        logger.info(
            '[LEADERBOARD] Points AWARDED: user_id=%s problem_id=%s submission_id=%s '
            'points_added=%s new_total=%s',
            locked_user.id,
            problem.id,
            submission.id,
            points_to_add,
            locked_user.points,
        )
        return True, points_to_add, locked_user.points


def recalculate_user_points(user):
    """Rebuild a user's total points from accepted full submissions."""
    from .models import Submission

    solved_problem_ids = set()
    total_points = 0

    submissions = (
        Submission.objects.filter(user=user, status='accepted')
        .select_related('problem')
        .prefetch_related('problem__test_cases')
        .order_by('created_at')
    )

    for submission in submissions:
        if submission.problem_id in solved_problem_ids:
            continue
        if is_complete_acceptance(submission):
            total_points += submission.problem.difficulty_points()
            solved_problem_ids.add(submission.problem_id)

    return total_points


def sync_user_points(user):
    """Persist recalculated points for one user."""
    User = get_user_model()
    calculated = recalculate_user_points(user)
    if user.points != calculated:
        logger.info(
            '[LEADERBOARD] Syncing user_id=%s points: %s -> %s',
            user.id,
            user.points,
            calculated,
        )
        User.objects.filter(pk=user.pk).update(points=calculated)
    return calculated


def sync_all_user_points():
    """Recalculate and persist points for every user."""
    User = get_user_model()
    for user in User.objects.all().iterator():
        sync_user_points(user)
