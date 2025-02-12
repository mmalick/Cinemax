from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class Movie(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    release_date = models.DateField(null=True, blank=True)
    poster_url = models.URLField()

    def __str__(self):
        return self.title

class Rating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie_id = models.CharField(max_length=20)
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie_id')  

    def __str__(self):
        return f"{self.user.username} - {self.movie_id}: {self.rating}"

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)  
    saved_movies = models.JSONField(default=list, blank=True) 

    def __str__(self):
        return self.username


class MovieList(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="movie_lists")
    name = models.CharField(max_length=255)
    movie_ids = models.JSONField(default=list, blank=True) 
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.user.username}"


