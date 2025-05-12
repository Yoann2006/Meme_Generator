from django.http import FileResponse
from .models import Meme
from .serializers import MemeSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

# from django.utils.text import slugify
import os
from django.conf import settings

# Create your views here.

class MemeListCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def get(self, request):
        memes = Meme.objects.all().order_by('-created_at')
        serializer = MemeSerializer(memes, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = MemeSerializer(data=request.data)
        if serializer.is_valid():
            meme = serializer.save()
            return Response(MemeSerializer(meme).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class MemeDetailView(APIView):
    def get(self, request, pk):
        meme = get_object_or_404(Meme, pk=pk)
        serializer = MemeSerializer(meme)
        return Response(serializer.data)
    
    def put(self, request, pk):
        meme = get_object_or_404(Meme, pk=pk)
        serializer = MemeSerializer(meme, data=request.data, partial=True)
        if serializer.is_valid():
            update_meme = serializer.save()
            return Response(MemeSerializer(update_meme).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        meme = get_object_or_404(Meme, pk=pk)
        meme.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

def serve_meme_file(self, request, pk):
    meme = get_object_or_404(Meme, pk=pk)
    if meme.generated_meme:
        file_path = meme.generated_meme.path
        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=f"meme_{meme.id}.jpg")
    return Response({"error" : "Meme not found."}, status=404)