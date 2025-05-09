from django.urls import path
from .views import MemeListCreateView, MemeDetailView, MemeDownloadView

urlpatterns = [
    path('create/', MemeListCreateView.as_view(), name='meme-list-create'),
    path('detail/<int:pk>/', MemeDetailView.as_view(), name='meme-list-create'),
    path('download/<int:pk>/', MemeDownloadView.as_view(), name='meme-download'),
]
