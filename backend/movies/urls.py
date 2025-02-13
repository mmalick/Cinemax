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
    rate_movie,
    search_movies,
    get_movie_lists,
    create_movie_list,
    add_movie_to_list,
    remove_movie_from_list,
    get_movie_list_details,
    delete_movie_list,
    get_movie_of_the_day
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
    path('movies/<int:movie_id>/rate/', rate_movie, name='rate-movie'),
    path('search-movies/', search_movies, name='search-movies'),
    path("lists/", get_movie_lists, name="get-movie-lists"),
    path("lists/<int:list_id>/", get_movie_list_details, name="get-movie-list-details"),  # Endpoint dla szczegółów listy
    path("lists/create/", create_movie_list, name="create-movie-list"),
    path("lists/<int:list_id>/add/", add_movie_to_list, name="add-movie-to-list"),
    path("lists/<int:list_id>/remove/<int:movie_id>/", remove_movie_from_list, name="remove-movie-from-list"),
    path("lists/<int:list_id>/delete/", delete_movie_list, name="delete-movie-list"),
    path("lists/<int:list_id>/get/", delete_movie_list, name="delete-movie-list"),
    path('movies/movie-of-the-day/', get_movie_of_the_day, name='movie-of-the-day'),
]

