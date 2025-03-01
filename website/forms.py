from django import forms
from .models import Schedule, SocialLink, Banner

class ScheduleForm(forms.ModelForm):
    class Meta:
        model = Schedule
        fields = ['day', 'time', 'game', 'description', 'is_active']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
            'time': forms.TimeInput(attrs={'type': 'time'}),
        }

class SocialLinkForm(forms.ModelForm):
    class Meta:
        model = SocialLink
        fields = ['platform', 'url', 'is_active']

class BannerForm(forms.ModelForm):
    class Meta:
        model = Banner
        fields = ['title', 'image', 'is_active', 'order']
        widgets = {
            'order': forms.NumberInput(attrs={'min': 0}),
        }
