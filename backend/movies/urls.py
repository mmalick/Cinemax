from django.urls import path
from .views import get_popular_movies

urlpatterns = [
    path('movies/popular/', get_popular_movies, name='popular-movies'),
]
