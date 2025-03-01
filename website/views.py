from django.views.generic import TemplateView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Schedule, SocialLink, Banner
from .forms import ScheduleForm, SocialLinkForm, BannerForm

class HomeView(TemplateView):
    template_name = 'website/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['schedule'] = Schedule.objects.filter(is_active=True)
        context['social_links'] = SocialLink.objects.filter(is_active=True)
        context['banners'] = Banner.objects.filter(is_active=True)
        return context

class AdminDashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'website/admin/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['schedule_form'] = ScheduleForm()
        context['social_form'] = SocialLinkForm()
        context['banner_form'] = BannerForm()
        context['schedule'] = Schedule.objects.all()
        context['social_links'] = SocialLink.objects.all()
        context['banners'] = Banner.objects.all()
        return context

    def post(self, request, *args, **kwargs):
        form_type = request.POST.get('form_type')
        
        if form_type == 'schedule':
            form = ScheduleForm(request.POST)
            if form.is_valid():
                form.save()
                messages.success(request, 'Planning mis à jour avec succès')
            else:
                messages.error(request, 'Erreur dans le formulaire du planning')
                
        elif form_type == 'social':
            form = SocialLinkForm(request.POST)
            if form.is_valid():
                form.save()
                messages.success(request, 'Réseau social ajouté avec succès')
            else:
                messages.error(request, 'Erreur dans le formulaire des réseaux sociaux')
                
        elif form_type == 'banner':
            form = BannerForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                messages.success(request, 'Bannière ajoutée avec succès')
            else:
                messages.error(request, 'Erreur dans le formulaire des bannières')
                
        return redirect('admin-dashboard')
