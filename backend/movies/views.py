import requests
import random
import datetime
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Rating, MovieList
from .serializers import MovieListSerializer
from django.core.cache import cache

TMDB_BASE_URL = "https://api.themoviedb.org/3"
User = get_user_model()

@api_view(['GET'])
def get_popular_movies(request):
    page = request.GET.get("page", 1)
    url = f"{TMDB_BASE_URL}/movie/popular?api_key={settings.TMDB_API_KEY}&language=pl-PL&page={page}"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)

@api_view(['GET'])
def get_upcoming_movies(request):
    page = request.GET.get("page", 1)
    url = f"{TMDB_BASE_URL}/movie/upcoming?api_key={settings.TMDB_API_KEY}&language=pl-PL&page={page}"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)

@api_view(['GET'])
def get_now_playing_movies(request):
    page = request.GET.get("page", 1)
    url = f"{TMDB_BASE_URL}/movie/now_playing?api_key={settings.TMDB_API_KEY}&language=pl-PL&page={page}"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)

@api_view(['GET'])
def get_top_rated_movies(request):
    page = request.GET.get("page", 1)
    url = f"{TMDB_BASE_URL}/movie/top_rated?api_key={settings.TMDB_API_KEY}&language=pl-PL&page={page}"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)



@api_view(['GET'])
def get_movie_details(request, movie_id):
    movie_url_pl = f"{TMDB_BASE_URL}/movie/{movie_id}?api_key={settings.TMDB_API_KEY}&language=pl-PL"
    movie_url_en = f"{TMDB_BASE_URL}/movie/{movie_id}?api_key={settings.TMDB_API_KEY}&language=en-US"
    providers_url = f"{TMDB_BASE_URL}/movie/{movie_id}/watch/providers?api_key={settings.TMDB_API_KEY}"

    movie_response = requests.get(movie_url_pl)
    providers_response = requests.get(providers_url)

    if movie_response.status_code != 200:
        movie_response = requests.get(movie_url_en)

    if movie_response.status_code != 200:
        return JsonResponse({"error": "Nie znaleziono filmu"}, status=404)

    movie_data = movie_response.json()
    providers_data = providers_response.json()

    poster_path = movie_data.get("poster_path")
    if not poster_path:  
        movie_response = requests.get(movie_url_en)
        if movie_response.status_code == 200:
            movie_data = movie_response.json()
            poster_path = movie_data.get("poster_path")

    providers = providers_data.get("results", {}).get("PL", {}).get("flatrate", [])

    return JsonResponse({
        "id": movie_data.get("id"),
        "title": movie_data.get("title"),
        "overview": movie_data.get("overview"),
        "poster_path": poster_path,
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

    user = User.objects.create_user(
        username=data['username'],
        email=data['email'],
        password=data['password']
    )

    MovieList.objects.create(user=user, name="Ocenione Filmy", is_default=True)
    MovieList.objects.create(user=user, name="Do obejrzenia", is_default=True)

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

        rated_list, _ = MovieList.objects.get_or_create(user=request.user, name="Ocenione Filmy", is_default=True)

        if str(movie_id) not in rated_list.movie_ids:
            rated_list.movie_ids.append(str(movie_id))
            rated_list.save()

        return Response({"message": "Rating saved", "rating": rating_value})


@api_view(['GET'])
@permission_classes([AllowAny])
def search_movies(request):
    query = request.GET.get("query", "")

    if len(query) < 2:
        return JsonResponse({"results": []})

    url = f"https://api.themoviedb.org/3/search/movie"
    params = {
        "api_key": settings.TMDB_API_KEY,
        "query": query,
        "language": "pl-PL"
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        return JsonResponse({"error": "Błąd pobierania danych"}, status=response.status_code)

    return JsonResponse(response.json())


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_movie_lists(request):
    print(f"Użytkownik: {request.user}")

    if not request.user.is_authenticated:
        return Response({"error": "Brak autoryzacji"}, status=status.HTTP_401_UNAUTHORIZED)

    lists = MovieList.objects.filter(user=request.user)
    serializer = MovieListSerializer(lists, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_movie_list(request):
    name = request.data.get("name")
    if not name:
        return Response({"error": "Brak nazwy listy"}, status=status.HTTP_400_BAD_REQUEST)

    movie_list = MovieList.objects.create(user=request.user, name=name)
    return Response({"id": movie_list.id, "name": movie_list.name}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_movie_to_list(request, list_id):
    print(f"Użytkownik: {request.user}")

    if not request.user.is_authenticated:
        return Response({"error": "Użytkownik niezalogowany"}, status=status.HTTP_401_UNAUTHORIZED)

    movie_list = get_object_or_404(MovieList, id=list_id, user=request.user)

    movie_id = request.data.get("movie_id")
    if not movie_id:
        return Response({"error": "Brak ID filmu"}, status=status.HTTP_400_BAD_REQUEST)

    if movie_id in movie_list.movie_ids:
        return Response({"message": "Film już znajduje się na liście"}, status=status.HTTP_200_OK)

    movie_list.movie_ids.append(movie_id)
    movie_list.save()

    return Response({"message": "Film dodany do listy"}, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_movie_list_details(request, list_id):
    movie_list = get_object_or_404(MovieList, id=list_id, user=request.user)

    movie_ids = movie_list.movie_ids if isinstance(movie_list.movie_ids, list) else []

    return Response({
        "id": movie_list.id,
        "name": movie_list.name,
        "movie_ids": movie_ids,
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_movie_list(request, list_id):
    movie_list = get_object_or_404(MovieList, id=list_id, user=request.user)

    if movie_list.is_default:
        return Response({"error": "Nie można usunąć domyślnej listy"}, status=status.HTTP_400_BAD_REQUEST)

    movie_list.delete()
    return Response({"message": "Lista filmów została usunięta"}, status=status.HTTP_200_OK)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_movie_from_list(request, list_id, movie_id):
    movie_list = get_object_or_404(MovieList, id=list_id, user=request.user)

    if movie_id not in movie_list.movie_ids:
        return Response({"error": "Film nie znajduje się na liście"}, status=status.HTTP_400_BAD_REQUEST)

    movie_list.movie_ids.remove(movie_id)
    movie_list.save()

    return Response({"message": "Film usunięty z listy"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_movies(request, category):
    page = request.GET.get("page", 1)
    language = request.GET.get("language", "pl-PL")

    allowed_categories = ["popular", "now_playing", "top_rated", "upcoming"]
    if category not in allowed_categories:
        return JsonResponse({"error": "Niepoprawna kategoria"}, status=400)

    url = f"{TMDB_BASE_URL}/movie/{category}?api_key={settings.TMDB_API_KEY}&language={language}&page={page}"
    
    response = requests.get(url)

    if response.status_code == 200:
        return JsonResponse(response.json())

    return JsonResponse({"error": "Nie udało się pobrać filmów"}, status=response.status_code)

@api_view(['GET'])
def get_movie_of_the_day(request):
    """Zwraca losowy film dnia, ale zmienia go tylko raz dziennie."""
    
    today = datetime.date.today().isoformat()
    cached_movie = cache.get("movie_of_the_day")
    
    if cached_movie and cached_movie.get("date") == today:
        return JsonResponse(cached_movie["movie"])

    url = f"{TMDB_BASE_URL}/movie/popular?api_key={settings.TMDB_API_KEY}&language=pl-PL&page=1"
    response = requests.get(url)

    if response.status_code != 200:
        return JsonResponse({"error": "Nie udało się pobrać filmu dnia"}, status=500)

    data = response.json().get("results", [])
    if not data:
        return JsonResponse({"error": "Brak dostępnych filmów"}, status=404)

    random_movie = random.choice(data)

    cache.set("movie_of_the_day", {"date": today, "movie": {
        "id": random_movie["id"],
        "title": random_movie["title"],
        "overview": random_movie["overview"],
        "poster_path": random_movie["poster_path"]
    }}, timeout=86400)

    return JsonResponse(random_movie)