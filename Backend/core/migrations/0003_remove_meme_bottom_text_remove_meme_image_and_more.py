# Generated by Django 5.1.3 on 2025-05-10 09:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_meme_generated_meme_alter_meme_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='meme',
            name='bottom_text',
        ),
        migrations.RemoveField(
            model_name='meme',
            name='image',
        ),
        migrations.RemoveField(
            model_name='meme',
            name='top_text',
        ),
    ]
