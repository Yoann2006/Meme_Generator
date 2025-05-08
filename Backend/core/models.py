from django.db import models

# Create your models here.

class Meme(models.Model):
    image = models.ImageField(upload_to='memes/originals/')
    top_text = models.CharField(max_length=255, blank=True)
    bottom_text = models.CharField(max_length=255, blank=True)
    generated_meme = models.ImageField(upload_to='memes/generated/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)