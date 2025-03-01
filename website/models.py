from django.db import models

class Schedule(models.Model):
    DAYS_OF_WEEK = [
        ('Lundi', 'Lundi'),
        ('Mardi', 'Mardi'),
        ('Mercredi', 'Mercredi'),
        ('Jeudi', 'Jeudi'),
        ('Vendredi', 'Vendredi'),
        ('Samedi', 'Samedi'),
        ('Dimanche', 'Dimanche'),
    ]

    day = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    time = models.TimeField()
    game = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['day', 'time']

    def __str__(self):
        return f"{self.day} - {self.time} - {self.game}"

class SocialLink(models.Model):
    PLATFORMS = [
        ('twitch', 'Twitch'),
        ('youtube', 'YouTube'),
        ('twitter', 'Twitter'),
        ('instagram', 'Instagram'),
        ('tiktok', 'TikTok'),
        ('discord', 'Discord'),
    ]

    platform = models.CharField(max_length=20, choices=PLATFORMS)
    url = models.URLField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['platform']

    def __str__(self):
        return f"{self.get_platform_display()} - {self.url}"

class Banner(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='banners/')
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title
