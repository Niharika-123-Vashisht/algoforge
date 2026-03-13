from django.urls import path
from . import views

urlpatterns = [
    path('languages/', views.LanguageListCreateView.as_view(), name='language-list'),
    path('languages/<int:pk>/', views.LanguageDetailView.as_view(), name='language-detail'),
    path('problems/', views.ProblemListCreateView.as_view(), name='problem-list'),
    path('problems/<int:pk>/', views.ProblemDetailView.as_view(), name='problem-detail'),
]
