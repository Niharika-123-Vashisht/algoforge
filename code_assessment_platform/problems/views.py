from django.db import connection
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Language, Problem
from .serializers import (
    LanguageSerializer,
    ProblemListSerializer,
    ProblemDetailSerializer,
    ProblemCreateUpdateSerializer,
)


def _is_sqlite():
    return connection.vendor == 'sqlite'


def _filter_ids_by_json_list_contains(queryset, field_name, value):
    """
    Return IDs of rows where the JSON list field contains value.
    Used when the DB does not support JSONField __contains (e.g. SQLite).

    Must not use .only() here: the queryset may already use select_related
    (e.g. created_by), and deferring fields conflicts with select_related.
    """
    if not value:
        return None
    ids = []
    for obj in queryset.iterator(chunk_size=500):
        data = getattr(obj, field_name, None) or []
        if isinstance(data, list) and value in data:
            ids.append(obj.id)
    return ids


class LanguageListCreateView(generics.ListCreateAPIView):
    """List all languages or create (admin)."""
    queryset = Language.objects.filter(is_active=True)
    serializer_class = LanguageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.method == 'GET':
            return Language.objects.filter(is_active=True)
        return Language.objects.all()


class LanguageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a language."""
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [IsAuthenticated]


class ProblemListCreateView(generics.ListCreateAPIView):
    """List problems or create a new problem."""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['difficulty', 'is_active']

    def get_queryset(self):
        qs = Problem.objects.select_related('created_by').prefetch_related(
            'test_cases', 'submissions'
        )
        # Search first so SQLite tag/company filtering iterates over a smaller set
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(title__icontains=search)

        # Tag filter: tags array contains the given tag
        # SQLite JSONField does not support __contains on arrays; filter in Python
        tag = self.request.query_params.get('tag', '').strip()
        if tag:
            if _is_sqlite():
                ids = _filter_ids_by_json_list_contains(qs, 'tags', tag)
                qs = qs.filter(id__in=ids) if ids else qs.none()
            else:
                qs = qs.filter(tags__contains=[tag])

        # Company filter: same pattern as tags for SQLite compatibility
        company = self.request.query_params.get('company', '').strip()
        if company:
            if _is_sqlite():
                ids = _filter_ids_by_json_list_contains(qs, 'companies', company)
                qs = qs.filter(id__in=ids) if ids else qs.none()
            else:
                qs = qs.filter(companies__contains=[company])

        return qs

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProblemCreateUpdateSerializer
        return ProblemListSerializer


class ProblemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a problem."""
    queryset = Problem.objects.select_related('created_by').prefetch_related('test_cases')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return ProblemCreateUpdateSerializer
        return ProblemDetailSerializer
