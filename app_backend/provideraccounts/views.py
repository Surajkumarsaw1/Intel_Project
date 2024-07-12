from rest_framework import generics
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .serializers import  TransportServiceSerializer
from .models import  TransportService,HealthcareService,EducationalService
from .serializers import TransportServiceSerializer,HealthcareServiceSerializer,EducationalServiceSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow any user to register


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'username': user.username,
            'email': user.email,
        }
        return Response(user_data)
    

@api_view(['POST'])
def register_transport_service(request):
    serializer = TransportServiceSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_healthcare_service(request):
    serializer = HealthcareServiceSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_educational_service(request):
    serializer = EducationalServiceSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_services(request):
    user = request.user
    
    transport_services = TransportService.objects.filter(user=user)
    education_services = EducationalService.objects.filter(user=user)
    healthcare_services = HealthcareService.objects.filter(user=user)
    
    transport_serializer = TransportServiceSerializer(transport_services, many=True)
    education_serializer = EducationalServiceSerializer(education_services, many=True)
    healthcare_serializer = HealthcareServiceSerializer(healthcare_services, many=True)
    
    return Response({
        'transport_services': transport_serializer.data,
        'education_services': education_serializer.data,
        'healthcare_services': healthcare_serializer.data,
    })