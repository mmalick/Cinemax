from django.urls import path
from .views import (
    get_popular_movies,
    get_upcoming_movies,
    get_now_playing_movies,
    get_top_rated_movies,
    get_movie_details,
    get_movie_credits,
    register_user,
    login_user,
)

urlpatterns = [
    path('movies/popular/', get_popular_movies),
    path('movies/upcoming/', get_upcoming_movies),
    path('movies/now_playing/', get_now_playing_movies),
    path('movies/top_rated/', get_top_rated_movies),
    path('movies/<int:movie_id>/', get_movie_details, name='movie-details'),
    path('movies/<int:movie_id>/credits/', get_movie_credits, name='movie-credits'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
]
