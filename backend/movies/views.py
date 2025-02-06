import requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view

TMDB_BASE_URL = "https://api.themoviedb.org/3"

@api_view(['GET'])
def get_popular_movies(request):
    url = f"{TMDB_BASE_URL}/movie/popular?api_key={settings.TMDB_API_KEY}&language=en-US&page=1"
    response = requests.get(url)
    if response.status_code == 200:
        return Response(response.json())
    return Response({"error": "Failed to fetch movies"}, status=response.status_code)
