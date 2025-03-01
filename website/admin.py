from django.contrib import admin
from .models import Schedule, SocialLink, Banner

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('day', 'time', 'game', 'is_active')
    list_filter = ('day', 'is_active')
    search_fields = ('game', 'description')

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'is_active')
    list_filter = ('platform', 'is_active')
    search_fields = ('url',)

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title',)
    ordering = ('order', '-created_at')
