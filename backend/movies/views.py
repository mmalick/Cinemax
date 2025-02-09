import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Movie, Rating
from django.shortcuts import get_object_or_404

TMDB_BASE_URL = "https://api.themoviedb.org/3"

@api_view(['GET'])
def get_popular_movies(request):
    url = f"{TMDB_BASE_URL}/movie/popular?api_key={settings.TMDB_API_KEY}&language=en-US&page=1"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())  # Zwracamy całą odpowiedź zamiast tylko results
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)


@api_view(['GET'])
def get_upcoming_movies(request):
    url = f"{TMDB_BASE_URL}/movie/upcoming?api_key={settings.TMDB_API_KEY}&language=en-US&page=1"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)

@api_view(['GET'])
def get_now_playing_movies(request):
    url = f"{TMDB_BASE_URL}/movie/now_playing?api_key={settings.TMDB_API_KEY}&language=en-US&page=1"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)

@api_view(['GET'])
def get_top_rated_movies(request):
    url = f"{TMDB_BASE_URL}/movie/top_rated?api_key={settings.TMDB_API_KEY}&language=en-US&page=1"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)

@api_view(['POST'])
def rate_movie(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    user_rating = request.data.get('rating')

    if user_rating and 1 <= user_rating <= 5:
        Rating.objects.create(movie=movie, rating=user_rating)
        return Response({"message": "Rating saved"}, status=201)

    return Response({"error": "Invalid rating"}, status=400)

@api_view(['GET'])
def get_movie_details(request, movie_id):  # Dodano request jako pierwszy argument
    url = f"{TMDB_BASE_URL}/movie/{movie_id}?api_key={settings.TMDB_API_KEY}&language=pl-PL"
    response = requests.get(url)

    if response.status_code != 200:
        return JsonResponse({"error": "Nie znaleziono filmu"}, status=404)

    return JsonResponse(response.json())

@api_view(['GET'])
def get_movie_credits(request, movie_id):
    url = f"{TMDB_BASE_URL}/movie/{movie_id}/credits?api_key={settings.TMDB_API_KEY}&language=pl-PL"
    response = requests.get(url)

    if response.status_code != 200:
        return JsonResponse({"error": "Nie znaleziono obsady"}, status=404)

    data = response.json()
    cast = data.get("cast", [])  # Pobieramy listę aktorów

    # Zwracamy tylko najważniejsze informacje o aktorach
    actors = [
        {
            "id": actor["id"],
            "name": actor["name"],
            "character": actor["character"],
            "profile_path": actor["profile_path"],
        }
        for actor in cast[:10]  # Pobieramy max 10 aktorów
    ]

    return JsonResponse({"actors": actors})