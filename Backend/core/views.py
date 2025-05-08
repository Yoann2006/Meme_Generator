from django.shortcuts import render
from .models import Meme
from .serializers import MemeSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.

class MemeListCreateView(APIView):
    def get(self, request):
        memes = Meme.objects.all().order_by('-created_at')
        serializer = MemeSerializer(memes, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = MemeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MemeDetailView(APIView):
    def get(self, request, pk):
        meme = get_object_or_404(Meme, pk=pk)
        serializer = MemeSerializer(meme)
        return Response(serializer.data)