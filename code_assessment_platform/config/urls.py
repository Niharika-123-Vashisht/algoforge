"""URL configuration for Code Assessment Platform."""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def root_view(_request):
    return JsonResponse({"message": "Mini Hackerrank Backend Running"})

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api/auth/', include('users.urls')),
    path('api/', include('problems.urls')),
    path('api/', include('submissions.urls')),
]
