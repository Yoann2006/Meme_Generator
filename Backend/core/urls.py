from django.urls import path
from .views import MemeListCreateView, MemeDetailView

urlpatterns = [
    path('create/', MemeListCreateView.as_view(), name='meme-list-create'),
    path('detail/<int:pk>/', MemeDetailView.as_view(), name='meme-list-create'),       
]