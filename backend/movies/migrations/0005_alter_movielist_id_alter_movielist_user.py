# Generated by Django 5.1.6 on 2025-02-11 22:48

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0004_remove_movielist_movies_movielist_movie_ids'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movielist',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='movielist',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movie_lists', to=settings.AUTH_USER_MODEL),
        ),
    ]
