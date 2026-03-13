from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction

from .models import Submission
from .serializers import SubmissionListSerializer, SubmissionDetailSerializer, SubmissionCreateSerializer
from .services import execute_code, verdict_to_display


class SubmissionListCreateView(generics.ListCreateAPIView):
    """
    List submissions or create (submit) new code.
    All execution goes through Judge0 sandbox only — never runs user code on Django.
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['problem', 'user', 'status', 'language']

    def get_queryset(self):
        return Submission.objects.select_related('user', 'problem', 'language').order_by('-created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SubmissionCreateSerializer
        return SubmissionListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        problem = serializer.validated_data['problem']
        language = serializer.validated_data['language']
        source_code = serializer.validated_data['source_code']

        submission = Submission.objects.create(
            user=request.user,
            problem=problem,
            language=language,
            source_code=source_code,
            status='pending',
        )

        run_sample_only = request.data.get('run_sample_only', False)

        # Prefetch test cases; avoid N+1
        problem = (
            problem.__class__.objects.select_related('created_by')
            .prefetch_related('test_cases', 'submissions')
            .get(pk=problem.pk)
        )
        tc_qs = problem.test_cases.order_by('order')
        if run_sample_only:
            tc_qs = tc_qs.filter(is_sample=True)
        test_cases = list(tc_qs)

        if not test_cases:
            submission.status = 'internal_error'
            submission.stderr = 'No test cases for this problem.'
            submission.save()
            return self._submission_response(submission, passed=0, total=0)

        test_results = []
        final_result = None
        final_status = 'accepted'
        passed_count = 0

        for tc in test_cases:
            result = execute_code(
                source_code=source_code,
                language_id=language.judge0_id,
                stdin=tc.input_data or '',
                expected_output=tc.expected_output,
                time_limit=problem.time_limit_seconds,
                memory_limit_mb=problem.memory_limit_mb,
            )
            test_results.append({
                'test_case_id': tc.id,
                'input': tc.input_data,
                'expected_output': tc.expected_output,
                'status': result['status'],
                'stdout': result['stdout'],
                'stderr': result['stderr'],
                'compile_output': result['compile_output'],
                'time': result['time'],
                'memory': result['memory'],
            })
            final_result = result
            if result['status'] == 'accepted':
                passed_count += 1
            else:
                final_status = result['status']
                break

        submission.status = final_status
        if final_result:
            submission.stdout = final_result['stdout']
            submission.stderr = final_result['stderr']
            submission.compile_output = final_result['compile_output']
            t = final_result['time']
            submission.time_seconds = t if t is None else float(t)
            m = final_result['memory']
            submission.memory_kb = None if m is None else int(round(m))
            submission.judge0_token = final_result['token'] or ''
        submission.test_results = test_results
        submission.save()

        if submission.status == 'accepted' and not run_sample_only:
            with transaction.atomic():
                already_accepted = Submission.objects.filter(
                    user=request.user,
                    problem=problem,
                    status='accepted',
                ).exclude(id=submission.id).exists()
                if not already_accepted:
                    request.user.points += problem.difficulty_points()
                    request.user.save(update_fields=['points'])

        return self._submission_response(
            submission,
            passed=passed_count,
            total=len(test_cases),
        )

    def _submission_response(self, submission, passed, total):
        """Merge serializer output with HackerRank-style verdict summary."""
        data = SubmissionDetailSerializer(submission).data
        time_val = submission.time_seconds
        memory_val = submission.memory_kb
        data['verdict'] = verdict_to_display(submission.status)
        data['passed_test_cases'] = passed
        data['total_test_cases'] = total
        data['time'] = float(time_val) if time_val is not None else None
        data['memory'] = int(memory_val) if memory_val is not None else None
        return Response(data, status=status.HTTP_201_CREATED)


class SubmissionDetailView(generics.RetrieveAPIView):
    """Retrieve a single submission."""
    queryset = Submission.objects.select_related('user', 'problem', 'language')
    serializer_class = SubmissionDetailSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        submission = self.get_object()
        test_results = submission.test_results or []
        passed = sum(1 for t in test_results if t.get('status') == 'accepted')
        total = len(test_results)
        response.data['verdict'] = verdict_to_display(submission.status)
        response.data['passed_test_cases'] = passed
        response.data['total_test_cases'] = total
        response.data['time'] = (
            float(submission.time_seconds) if submission.time_seconds is not None else None
        )
        response.data['memory'] = (
            int(submission.memory_kb) if submission.memory_kb is not None else None
        )
        return response
