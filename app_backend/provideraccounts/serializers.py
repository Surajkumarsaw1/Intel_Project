from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TransportService,HealthcareService,EducationalService

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken. Please choose another.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class TransportServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportService
        fields = [
            'id', 'user', 'name', 'type_of_service', 'contact_info', 
            'address', 'latitude', 'longitude', 'vehicle_type', 
            'price_per_km', 'cars', 'bikes', 'scooty', 'suvs', 
            'avg_price_range_per_hour'
        ]
        read_only_fields = ['user']

    def validate(self, attrs):
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is required")

        user = request.user
        type_of_service = attrs.get('type_of_service')
        name = attrs.get('name')
        address = attrs.get('address')
        contact_info = attrs.get('contact_info')
        latitude = attrs.get('latitude')
        longitude = attrs.get('longitude')

        if type_of_service == TransportService.PICK_AND_DROP:
            vehicle_type = attrs.get('vehicle_type')
            price_per_km = attrs.get('price_per_km')
            if TransportService.objects.filter(
                user=user, name=name, type_of_service=type_of_service, 
                vehicle_type=vehicle_type, price_per_km=price_per_km, 
                address=address, contact_info=contact_info, 
                latitude=latitude, longitude=longitude
            ).exists():
                raise serializers.ValidationError("You have already registered a similar Pick and Drop service. To make changes, please edit it from your dashboard.")
        elif type_of_service == TransportService.VEHICLE_RENTAL:
            cars = attrs.get('cars')
            bikes = attrs.get('bikes')
            scooty = attrs.get('scooty')
            suvs = attrs.get('suvs')
            avg_price_range_per_hour = attrs.get('avg_price_range_per_hour')
            if TransportService.objects.filter(
                user=user, name=name, type_of_service=type_of_service, 
                address=address, contact_info=contact_info, 
                latitude=latitude, longitude=longitude, cars=cars, 
                bikes=bikes, scooty=scooty, suvs=suvs, 
                avg_price_range_per_hour=avg_price_range_per_hour
            ).exists():
                raise serializers.ValidationError("You have already registered a similar Vehicle Rental service. To make changes, please edit it from your dashboard.")

        return attrs

class HealthcareServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthcareService
        fields = [
            'id', 'user', 'name', 'service_type', 'address', 'latitude', 'longitude', 'contact_info', 'details', 'speciality', 
            'emergency_services', 'provide_home_service', 'provide_all_basic_tests', 'specific_tests'
        ]
        read_only_fields = ['id', 'user']

        
class EducationalServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationalService
        fields = [
            'user', 'service_type', 'name', 'address', 'latitude', 'longitude',
            'contact_info', 'details',  'grade_range', 'streams',
            'board', 'sports_facility', 'computer_lab', 'library',
            'subjects_taught', 'avg_pricing', 'hours_per_day', 'aid_type', 'sell_or_donate'
        ]
        read_only_fields = ['user']




