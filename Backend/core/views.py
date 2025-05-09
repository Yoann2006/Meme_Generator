from django.shortcuts import render
from .models import Meme
from .serializers import MemeSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from PIL import Image, ImageDraw, ImageFont
# from django.utils.text import slugify
import os
from django.conf import settings

# Create your views here.

class MemeListCreateView(APIView):
    def get(self, request):
        memes = Meme.objects.all().order_by('-created_at')
        serializer = MemeSerializer(memes, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = MemeSerializer(data=request.data)
        if serializer.is_valid():
            meme = serializer.save()
            
            image_path = meme.image.path
            img = Image.open(image_path).convert("RGB")
            draw = ImageDraw.Draw(img)
            
            font_path = os.path.join(settings.BASE_DIR, 'arial.ttf')
            font = ImageFont.truetype(font_path, size=40)
            
            top_text = meme.top_text.upper()
            bottom_text = meme.bottom_text.upper()
            
            image_width, image_height = img.size
            
            def draw_text(text, y):
                bbox = draw.textbbox((0, 0), text, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
                x = (image_width - text_width) / 2
                draw.text((x, y), text, font=font, fill="white", stroke_width=2, stroke_fill="black")
                
            if top_text:
                draw_text(top_text, y=10)
            if bottom_text:
                draw_text(bottom_text, y=image_height - 60)
            
            output_path = os.path.join(settings.MEDIA_ROOT, 'memes/generated/', f"meme_{meme.id}.jpg")
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            img.save(output_path)
            
            meme.generated_meme.name = f"memes/generated/meme_{meme.id}.jpg"
            meme.save()            
            return Response(MemeSerializer(meme).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class MemeDetailView(APIView):
    def get(self, request, pk):
        meme = get_object_or_404(Meme, pk=pk)
        serializer = MemeSerializer(meme)
        return Response(serializer.data)