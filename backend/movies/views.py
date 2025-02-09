import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from .models import Rating

TMDB_BASE_URL = "https://api.themoviedb.org/3"
User = get_user_model()

@api_view(['GET'])
def get_popular_movies(request):
    page = request.GET.get("page", 1)
    url = f"{TMDB_BASE_URL}/movie/popular?api_key={settings.TMDB_API_KEY}&language=en-US&page={page}"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)

@api_view(['GET'])
def get_upcoming_movies(request):
    page = request.GET.get("page", 1)
    url = f"{TMDB_BASE_URL}/movie/upcoming?api_key={settings.TMDB_API_KEY}&language=en-US&page={page}"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)

@api_view(['GET'])
def get_now_playing_movies(request):
    page = request.GET.get("page", 1)
    url = f"{TMDB_BASE_URL}/movie/now_playing?api_key={settings.TMDB_API_KEY}&language=en-US&page={page}"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)

@api_view(['GET'])
def get_top_rated_movies(request):
    page = request.GET.get("page", 1)
    url = f"{TMDB_BASE_URL}/movie/top_rated?api_key={settings.TMDB_API_KEY}&language=en-US&page={page}"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)

@api_view(['GET'])
def get_movie_details(request, movie_id):
    movie_url = f"{TMDB_BASE_URL}/movie/{movie_id}?api_key={settings.TMDB_API_KEY}&language=pl-PL"
    providers_url = f"{TMDB_BASE_URL}/movie/{movie_id}/watch/providers?api_key={settings.TMDB_API_KEY}"

    movie_response = requests.get(movie_url)
    providers_response = requests.get(providers_url)

    if movie_response.status_code != 200:
        return JsonResponse({"error": "Nie znaleziono filmu"}, status=404)

    movie_data = movie_response.json()
    providers_data = providers_response.json()

    providers = providers_data.get("results", {}).get("PL", {}).get("flatrate", [])

    return JsonResponse({
        "title": movie_data.get("title"),
        "overview": movie_data.get("overview"),
        "poster_path": movie_data.get("poster_path"),
        "vote_average": movie_data.get("vote_average"),
        "vote_count": movie_data.get("vote_count"),
        "streaming": [
            {"name": p["provider_name"], "logo": f"https://image.tmdb.org/t/p/w200{p['logo_path']}"}
            for p in providers
        ]
    })

@api_view(['GET'])
def get_movie_credits(request, movie_id):
    url = f"{TMDB_BASE_URL}/movie/{movie_id}/credits?api_key={settings.TMDB_API_KEY}&language=pl-PL"
    response = requests.get(url)

    if response.status_code != 200:
        return JsonResponse({"error": "Nie znaleziono obsady"}, status=404)

    data = response.json()
    cast = data.get("cast", [])

    actors = [
        {
            "id": actor["id"],
            "name": actor["name"],
            "character": actor["character"],
            "profile_path": actor["profile_path"],
        }
        for actor in cast[:10]
    ]

    return JsonResponse({"actors": actors})

@api_view(['POST'])
def register_user(request):
    data = request.data

    if User.objects.filter(username=data['username']).exists():
        return Response({'detail': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=data['email']).exists():
        return Response({'detail': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(  # ✅ Zmienione na create_user
        username=data['username'],
        email=data['email'],
        password=data['password']
    )

    return Response({'detail': 'User created successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_user(request):
    data = request.data
    user = authenticate(username=data['username'], password=data['password'])

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def rate_movie(request, movie_id):
    if request.method == 'GET':
        try:
            rating = Rating.objects.get(user=request.user, movie_id=str(movie_id))
            return Response({"rating": rating.rating}, status=status.HTTP_200_OK)
        except Rating.DoesNotExist:
            return Response({"rating": None}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        data = request.data
        rating_value = data.get("rating")

        if not rating_value or not (1 <= rating_value <= 10):
            return Response({"error": "Invalid rating"}, status=status.HTTP_400_BAD_REQUEST)

        rating, created = Rating.objects.update_or_create(
            user=request.user,
            movie_id=str(movie_id),
            defaults={"rating": rating_value}
        )

        return Response({"message": "Rating saved", "rating": rating_value})
