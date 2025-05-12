from django.urls import path
from .views import MemeListCreateView, MemeDetailView, serve_meme_file

urlpatterns = [
    path('create/', MemeListCreateView.as_view(), name='meme-list-create'),
    path('detail/<int:pk>/', MemeDetailView.as_view(), name='meme-list-create'),
    path('<int:pk>/file/', serve_meme_file, name='serve_meme_file'),
]
