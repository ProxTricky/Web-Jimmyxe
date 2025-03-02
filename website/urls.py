from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('dashboard/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
]
