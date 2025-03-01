from django.contrib import admin
from django.contrib.admin import AdminSite
from .models import Schedule, SocialLink, Banner

class CustomAdminSite(AdminSite):
    site_header = 'Administration JimmyXE'
    site_title = 'JimmyXE Admin'
    index_title = 'Gestion du site'

admin_site = CustomAdminSite(name='customadmin')

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('day', 'time', 'game', 'is_active')
    list_filter = ('day', 'is_active')
    search_fields = ('game', 'description')
    ordering = ('day', 'time')

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'is_active')
    list_filter = ('platform', 'is_active')
    search_fields = ('platform', 'url')

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title',)
    ordering = ('order', '-created_at')
