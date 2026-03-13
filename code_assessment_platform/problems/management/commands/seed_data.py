"""
Load sample data: 2 users, 30+ problems with test cases, 5 submissions.
Run: python manage.py seed_data
"""
import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from problems.models import Language, Problem, TestCase
from submissions.models import Submission

User = get_user_model()


def load_problems_json():
    """Load problems from problems/data/problems_data.json."""
    data_path = Path(__file__).resolve().parent.parent.parent / 'data' / 'problems_data.json'
    if not data_path.exists():
        raise FileNotFoundError(f'Problems data file not found: {data_path}')
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if not isinstance(data, list) or len(data) < 30:
        raise ValueError(f'problems_data.json must contain at least 30 problems, found {len(data) if isinstance(data, list) else 0}')
    return data


class Command(BaseCommand):
    help = 'Load sample data (2 users, 30+ problems, 5 submissions).'

    def handle(self, *args, **options):
        # 1. Languages (Judge0 IDs: Python 71, Java 91, C++ 52, JavaScript 63)
        lang_py, _ = Language.objects.get_or_create(
            slug='python',
            defaults={'name': 'Python (3.8.1)', 'judge0_id': 71, 'is_active': True}
        )
        lang_java, _ = Language.objects.get_or_create(
            slug='java',
            defaults={'name': 'Java (OpenJDK 15)', 'judge0_id': 91, 'is_active': True}
        )
        lang_cpp, _ = Language.objects.get_or_create(
            slug='cpp',
            defaults={'name': 'C++ (GCC 7.4.0)', 'judge0_id': 52, 'is_active': True}
        )
        lang_js, _ = Language.objects.get_or_create(
            slug='javascript',
            defaults={'name': 'JavaScript (Node.js 12.14.0)', 'judge0_id': 63, 'is_active': True}
        )
        self.stdout.write('Languages ready.')

        # 2. Users (create only if not present)
        alice, created_a = User.objects.get_or_create(
            username='alice',
            defaults={
                'email': 'alice@example.com',
                'first_name': 'Alice',
                'last_name': 'Smith',
                'bio': 'Python enthusiast.',
            },
        )
        if created_a:
            alice.set_password('alice123')
            alice.save()
        bob, created_b = User.objects.get_or_create(
            username='bob',
            defaults={
                'email': 'bob@example.com',
                'first_name': 'Bob',
                'last_name': 'Jones',
                'bio': 'Competitive coder.',
            },
        )
        if created_b:
            bob.set_password('bob123')
            bob.save()
        self.stdout.write('Users ready (alice/alice123, bob/bob123).')

        # 3. Problems with test cases - load from problems_data.json
        problems_data = load_problems_json()
        created_count = 0
        for i, p_data in enumerate(problems_data):
            problem, created = Problem.objects.get_or_create(
                title=p_data['title'],
                defaults={
                    'description': p_data['description'],
                    'sample_input': p_data.get('sample_input', ''),
                    'sample_output': p_data.get('sample_output', ''),
                    'difficulty': p_data.get('difficulty', 'easy').lower(),
                    'time_limit_seconds': 2,
                    'memory_limit_mb': 256,
                    'created_by': alice,
                    'is_active': True,
                    'tags': p_data.get('tags', []),
                    'companies': p_data.get('companies', []),
                },
            )
            updates = {}
            if not created and p_data.get('tags'):
                updates['tags'] = p_data['tags']
            if not created and p_data.get('companies'):
                updates['companies'] = p_data['companies']
            if updates:
                for k, v in updates.items():
                    setattr(problem, k, v)
                problem.save(update_fields=list(updates.keys()))
            if created:
                created_count += 1
            # Ensure test cases exist (create if missing)
            if not problem.test_cases.exists():
                for j, tc in enumerate(p_data.get('test_cases', [])):
                    TestCase.objects.create(
                        problem=problem,
                        input_data=tc.get('input_data', ''),
                        expected_output=tc.get('expected_output', ''),
                        is_sample=tc.get('is_sample', False),
                        order=j,
                    )
        self.stdout.write(f'Problems ready ({Problem.objects.count()} total, {created_count} newly created).')

        # 4. Submissions (5) - create only if we don't have 5 yet
        p1 = Problem.objects.filter(title='Hello World').first()
        p2 = Problem.objects.filter(title='Sum of Two Numbers').first()
        p3 = Problem.objects.filter(title='FizzBuzz').first()
        if Submission.objects.count() >= 5:
            self.stdout.write(self.style.SUCCESS('Sample data already loaded.'))
            return
        Submission.objects.create(
            user=alice, problem=p1, language=lang_py,
            source_code='print("Hello, World!")',
            status='accepted', time_seconds=0.01, memory_kb=10000,
        )
        Submission.objects.create(
            user=bob, problem=p1, language=lang_js,
            source_code='console.log("Hello, World!");',
            status='accepted', time_seconds=0.02, memory_kb=12000,
        )
        Submission.objects.create(
            user=alice, problem=p2, language=lang_py,
            source_code='a=int(input())\nb=int(input())\nprint(a+b)',
            status='accepted', time_seconds=0.01, memory_kb=9000,
        )
        Submission.objects.create(
            user=bob, problem=p2, language=lang_cpp,
            source_code='#include <iostream>\nusing namespace std;\nint main(){int a,b;cin>>a>>b;cout<<a+b;}',
            status='accepted', time_seconds=0.01, memory_kb=8000,
        )
        Submission.objects.create(
            user=alice, problem=p3, language=lang_py,
            source_code='n=int(input())\nfor i in range(1,n+1):\n  s=""\n  if i%3==0: s+="Fizz"\n  if i%5==0: s+="Buzz"\n  print(s or i)',
            status='accepted', time_seconds=0.05, memory_kb=11000,
        )
        # Update points for sample data
        for u in (alice, bob):
            accepted = Submission.objects.filter(user=u, status="accepted").select_related("problem")
            total = 0
            seen = set()
            for s in accepted:
                key = s.problem_id
                if key in seen:
                    continue
                seen.add(key)
                total += s.problem.difficulty_points()
            u.points = total
            u.save(update_fields=["points"])
        self.stdout.write(self.style.SUCCESS(
            f'Sample data loaded: 2 users, {Problem.objects.count()} problems, 5 submissions.'
        ))
