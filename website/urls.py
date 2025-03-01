from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('dashboard/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
]
