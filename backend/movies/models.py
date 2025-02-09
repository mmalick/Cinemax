from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    release_date = models.DateField()
    poster_url = models.URLField()

    def __str__(self):
        return self.title

class Rating(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="ratings")
    user = models.CharField(max_length=255)  # Możesz zmienić na ForeignKey do użytkownika
    score = models.IntegerField()

    def __str__(self):
        return f"{self.user} - {self.movie.title}: {self.score}"
