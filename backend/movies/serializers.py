from rest_framework import serializers
from .models import Rating, MovieList

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['movie_id', 'rating']

class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieList
        fields = ['id', 'name', 'movie_ids']  