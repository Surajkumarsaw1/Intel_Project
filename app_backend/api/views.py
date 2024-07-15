import os
import requests
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from cachetools import cached, TTLCache
from cachetools.keys import hashkey
from dotenv import load_dotenv
from django.conf import settings
from provideraccounts.models import HealthcareService,EducationalService,TransportService
from provideraccounts.serializers import HealthcareServiceSerializer,EducationalServiceSerializer,TransportServiceSerializer
from geopy.distance import geodesic
import pandas as pd
from django.utils.decorators import method_decorator
from fuzzywuzzy import process

load_dotenv()

CSV_FILE_PATH = os.path.join(settings.BASE_DIR, 'data', 'merged_fixed_deposit_savings_interest_rates.csv')

API_KEY = os.getenv("GOOGLE_API_KEY")


def withinradius(lat1,lng1,lat2,lng2):
    return geodesic((lat1, lng1), (lat2, lng2)).meters


cache = TTLCache(maxsize=100, ttl=3600)

def custom_cache_key(location, place_type, api_key):
    location_tuple = tuple(location.items()) if isinstance(location, dict) else location
    return hashkey(location_tuple, place_type, api_key)

def fetch_local_places_with_distance(location, api_key):
    user_lat = location['lat']
    user_lng = location['lng']
    radius = 5000
    
    healthcare_services = HealthcareService.objects.all()
    healthcare_serializer = HealthcareServiceSerializer(healthcare_services, many=True)
    
    nearby_healthcare_services = []
    
    for service in healthcare_services:
        if service.latitude is not None and service.longitude is not None:
            distance = withinradius(user_lat, user_lng, service.latitude, service.longitude)
            if distance <= radius:
                nearby_healthcare_services.append({
                    'name': service.name if service.name else '',
                    'service_type': service.service_type if service.service_type else '',
                    'address': service.address if service.address else '',
                    'contact_info': service.contact_info if service.contact_info else '',
                    'details': service.details if service.details else '',
                    'speciality': service.speciality if service.speciality else '',
                    'emergency_services': service.emergency_services if service.emergency_services else False,
                    'provide_home_service': service.provide_home_service if service.provide_home_service else False,
                    'provide_all_basic_tests': service.provide_all_basic_tests if service.provide_all_basic_tests else False,
                    'distance': distance/1000
                })
    return nearby_healthcare_services

@cached(cache, key=custom_cache_key)
def fetch_places_with_distance(location, place_type, api_key):
    url = (
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        f"?location={location['lat']},{location['lng']}&radius=5000&type={place_type}&key={api_key}"
    )
    try:
        response = requests.get(url)
        response.raise_for_status()
        places = response.json().get('results', [])
        
        combined_results = []

        for result in places[:20]:
            name = result.get('name', 'Not available')
            address = result.get('vicinity', 'Unknown')
            opening_hours = result.get('opening_hours', {}).get('open_now', 'Not specified')
            rating = result.get('rating', 'No rating')
            place_location = result.get('geometry', {}).get('location', {})
            place_id = result.get('place_id', 'error')
            
            facility_data = {
                'type': place_type,
                'name': name,
                'address': address,
                'open_now': opening_hours,
                'rating': rating,
                'distance': None,
                'place_id': place_id,
                'location': place_location
            }
            combined_results.append(facility_data)
        
        return combined_results

    except requests.RequestException as e:
        print(f"Error fetching places or calculating distance: {e}")
        return []

@api_view(['POST'])
def get_health_facilities(request):
    location = request.data
    
    if not all(k in location for k in ('lat', 'lng')):
        return Response({"error": "Invalid location data"}, status=status.HTTP_400_BAD_REQUEST)
   
    if not API_KEY:
        return Response({"error": "API key not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    place_types = ['hospital', 'pharmacy']
    combined_results = []
    all_nearby_healthcare_services = []

    for place_type in place_types:
        places = fetch_places_with_distance(location, place_type, API_KEY)
        combined_results.extend(places)
    
    nearby_healthcare_services = fetch_local_places_with_distance(location, API_KEY)
  
  

    return Response({
        'facilities': combined_results,
        
        'nearby_healthcare_services': nearby_healthcare_services
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def calculate_distance(request):
    location = request.data.get('location')
    services = request.data.get('services')
    service_type = request.data.get('servicetype')

    if not location or not services or not service_type:
        print("working")
        return Response({"error": "Missing required parameters"}, status=status.HTTP_400_BAD_REQUEST)
    
    api_key = API_KEY
    user_lat = location.get('lat')
    user_lng = location.get('lng')

    for service in services:
        service_location = service.get('location')
        service_lat = service_location['lat']
        service_lng = service_location['lng']
        
        if service_lat is not None and service_lng is not None:
            distance_url = (
                f"https://maps.googleapis.com/maps/api/distancematrix/json"
                f"?origins={user_lat},{user_lng}&destinations={service_lat},{service_lng}&key={api_key}"
            )
            try:
                distance_response = requests.get(distance_url)
                distance_response.raise_for_status()
                rows = distance_response.json().get('rows', [])
                
                if rows:
                    elements = rows[0].get('elements', [])
                    if elements:
                        distance = elements[0].get('distance', {}).get('value', 0) / 1000
                        service['distance'] = distance
            except requests.RequestException as e:
                print(f"Error calculating distance: {e}")
                service['distance'] = None
        else:
            print(f"Skipping service with missing lat/lng: {service}")

    if service_type == 'healthcare':
        local_services = request.data.get('local_services', [])
        all_results = [
            {**facility, 'type': facility.get('type', facility.get('service_type'))}
            for facility in (services + local_services)
        ]   
        nearest_hospital = min(
            (facility for facility in all_results if facility['type'] == 'hospital'),
            key=lambda x: x['distance'] if x['distance'] is not None else float('inf'),
            default=None
        )
        nearest_pharmacy = min(
            (facility for facility in all_results if facility['type'] == 'pharmacy'),
            key=lambda x: x['distance'] if x['distance'] is not None else float('inf'),
            default=None
        )
        return Response({
            'services': services,
            'nearest_hospital': nearest_hospital,
            'nearest_pharmacy': nearest_pharmacy
        }, status=status.HTTP_200_OK)
    
    elif service_type == 'bank':
        nearest_bank = min(
            (service for service in services if service['type'] == 'bank'),
            key=lambda x: x['distance'] if x['distance'] is not None else float('inf'),
            default=None
        )
        return Response({
            'services': services,
            'nearest_bank': nearest_bank
        }, status=status.HTTP_200_OK)
    
    elif service_type == 'atm': 
        nearest_atm = min(
            (service for service in services if service['type'] == 'atm'),
            key=lambda x: x['distance'] if x['distance'] is not None else float('inf'),
            default=None
        )
        return Response({
            'services': services,
            'nearest_atm': nearest_atm
        }, status=status.HTTP_200_OK)
    
    else:
        print("no")
        return Response({"error": "Invalid service type"}, status=status.HTTP_400_BAD_REQUEST)


@cached(cache)
def fetch_place_details_from_api(place_id, api_key):

    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&key={api_key}&fields=reviews,opening_hours,price_level,formatted_phone_number"
    try:
        response = requests.get(url)
        response.raise_for_status()
        result = response.json().get('result', {})
        details = {
            'reviews': result.get('reviews', []),
            'opening_hours': result.get('opening_hours', {}).get('weekday_text', 'Not specified'),
            'price_level': result.get('price_level', 'Not specified'),
            'contact': result.get('formatted_phone_number','No contact info')
        }
        return details
    except requests.RequestException as e:
        print(f"Error fetching place details: {e}")
        return {}

@api_view(['POST'])
def fetch_place_details(request):
    location = request.data

    place_id = request.data.get('place_id', None)

    if not place_id:
        return Response({"error": "Invalid place ID"}, status=status.HTTP_400_BAD_REQUEST)

    if not API_KEY:
        return Response({"error": "API key not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    details = fetch_place_details_from_api(place_id, API_KEY)

    return Response(details, status=status.HTTP_200_OK)


import pandas as pd
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def get_doctors(request):
    def reverse_geocode(lat, lng, api_key):
        url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            results = response.json().get('results', [])
            if results:
                state = city = None
                for component in results[0]['address_components']:
                    if 'administrative_area_level_1' in component['types']:
                        state = component['long_name']
                    if 'locality' in component['types']:
                        city = component['long_name']
                return state, city
        return None, None

    def filter_doctors_by_location(state, city):
        doctors_df = pd.read_csv(os.path.join(settings.BASE_DIR, 'data', 'doctor_info.csv'))
        filtered_doctors = doctors_df[(doctors_df['State'] == state)]
        return filtered_doctors.to_dict('records')

    lat = request.data.get('lat')
    lng = request.data.get('lng')

    if not lat or not lng:
        return Response({"error": "Latitude and longitude are required"}, status=status.HTTP_400_BAD_REQUEST)

    state, city = reverse_geocode(lat, lng, API_KEY)

    if not state or not city:
        return Response({"error": "Could not determine state and city from coordinates"}, status=status.HTTP_400_BAD_REQUEST)

    filtered_doctors = filter_doctors_by_location(state, city)

    return Response({
        'state': state,
        
        'doctors': filtered_doctors
    }, status=status.HTTP_200_OK)









def clean_bank_name(name):
    return name.replace('atm', '').replace('branch', '').replace('&', 'and').strip().lower()





def clean_float(value):
    try:
        return float(value)
    except (ValueError, TypeError):
        return None
    



def load_interest_rates(file_path):
    interest_rates_df = pd.read_csv(file_path, encoding='ISO-8859-1')
    bank_interest_rates = {}
    for _, row in interest_rates_df.iterrows():
        bank_name = row['Bank'].strip().lower()
        bank_interest_rates[bank_name] = {
            'savings_interest_rate': clean_float(row['Highest Savings Interest Rate (%)']),
            'fd_interest_rate': clean_float(row.get('Highest FD Interest Rate (%)'))
        }
    return bank_interest_rates



def is_valid_json_value(value):
    if isinstance(value, float):
        if value != value or value in (float('inf'), float('-inf')):
            return False
    return True

def clean_json(data):
    if isinstance(data, dict):
        return {k: clean_json(v) for k, v in data.items() if is_valid_json_value(v)}
    elif isinstance(data, list):
        return [clean_json(v) for v in data if is_valid_json_value(v)]
    else:
        return data if is_valid_json_value(data) else None




@api_view(['POST'])
def fetch_banking_facilities_banks(request):
    location = request.data

    if not all(k in location for k in ('lat', 'lng')):
        return Response({"error": "Invalid location data"}, status=status.HTTP_400_BAD_REQUEST)

    if not API_KEY:
        return Response({"error": "API key not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    combined_results = []
    place_type = 'bank'
    combined_results.extend(fetch_places_with_distance(location, place_type, API_KEY))

    combined_results = [place for place in combined_results if "ATM" not in place['name']]

   
    bank_interest_rates = load_interest_rates(CSV_FILE_PATH)
    bank_names = list(bank_interest_rates.keys())

    
    for result in combined_results:
        bank_name = clean_bank_name(result.get('name', ''))
        matched_bank, score = process.extractOne(bank_name, bank_names)
        if score >= 80: 
            result['interest_rates'] = bank_interest_rates[matched_bank]

   
    

    return Response({
        'facilities': combined_results,
        
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def fetch_banking_facilities_banks1(request):
    location = request.data

    if not all(k in location for k in ('lat', 'lng')):
        return Response({"error": "Invalid location data"}, status=status.HTTP_400_BAD_REQUEST)

    if not API_KEY:
        return Response({"error": "API key not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    combined_results = []
    place_type = 'bank'
    
    combined_results.extend(fetch_places_with_distance(location, place_type, API_KEY))
    print(combined_results)

    best_bank = min(
        (facility for facility in combined_results if facility['type'] == 'school'),
        key=lambda x: (x['distance'], -float(x['rating'] if x['rating'] != 'No rating' else 0)),
        default=None
    )
  
    return Response({
        'facilities': combined_results,
        'best_school': best_bank,
    }, status=status.HTTP_200_OK)



@api_view(['POST'])
def fetch_banking_facilities_atm(request):
    location = request.data

    if not all(k in location for k in ('lat', 'lng')):
        return Response({"error": "Invalid location data"}, status=status.HTTP_400_BAD_REQUEST)

    if not API_KEY:
        return Response({"error": "API key not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    combined_results = []
    place_type = 'atm'
    combined_results.extend(fetch_places_with_distance(location, place_type, API_KEY))


    response_data = {
        'facilitiesAtm': combined_results,
        
    }

    cleaned_response_data = clean_json(response_data)

    return Response(cleaned_response_data, status=status.HTTP_200_OK)

def get_amadeus_access_token():
    response = requests.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        data={
            'grant_type': 'client_credentials',
            'client_id': 'oAhULZUlBYf3dOZ82fHfqTwGemvu0yGj',
            'client_secret': 'hU073GxVODUEly4U'
        }
    )
    return response.json().get('access_token')

@api_view(['POST'])
def get_iata_code(request):
    data = request.data
    location_name = data['location']
    access_token = get_amadeus_access_token()
    url = 'https://test.api.amadeus.com/v1/reference-data/locations'
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    params = {
        'keyword': location_name,
        'subType': 'CITY,AIRPORT'
    }
    
    response = requests.get(url, headers=headers, params=params)
    locations = response.json()
    if locations and 'data' in locations and len(locations['data']) > 0:
        return Response({'locations': locations['data']})
    return Response({'locations': []})

@api_view(['POST'])
def search_flights(request):
    data = request.data
    departure_city = data['departure']
    destination_city = data['destination']
    date = data['date']

    access_token = get_amadeus_access_token()

    def fetch_iata_code(city_name):
        url = 'https://test.api.amadeus.com/v1/reference-data/locations'
        headers = {'Authorization': f'Bearer {access_token}'}
        params = {'keyword': city_name, 'subType': 'CITY,AIRPORT'}
        response = requests.get(url, headers=headers, params=params)
        locations = response.json()
        if locations and 'data' in locations and len(locations['data']) > 0:
            return locations['data'][0]['iataCode']
        return None

    departure_iata = fetch_iata_code(departure_city)
    destination_iata = fetch_iata_code(destination_city)

    if not departure_iata or not destination_iata:
        return Response({'error': 'Invalid departure or destination city/state name'}, status=400)

    url = 'https://test.api.amadeus.com/v2/shopping/flight-offers'
    headers = {'Authorization': f'Bearer {access_token}'}
    params = {
        'originLocationCode': departure_iata,
        'destinationLocationCode': destination_iata,
        'departureDate': date,
        'adults': 1,
    }

    response = requests.get(url, headers=headers, params=params)
    flights = response.json()


    exchange_rate = get_exchange_rate('EUR', 'INR')

    carrier_names = fetch_carrier_names(access_token)

    for flight in flights.get('data', []):
        price_in_eur = float(flight['price']['grandTotal'])
        price_in_inr = price_in_eur * exchange_rate
        flight['price']['grandTotalINR'] = round(price_in_inr, 2)

        for itinerary in flight['itineraries']:
            for segment in itinerary['segments']:
                segment['carrierName'] = carrier_names.get(segment['carrierCode'], segment['carrierCode'])
                segment['includedCheckedBags'] = next(
                    (item for item in flight['travelerPricings'][0]['fareDetailsBySegment'] if item['segmentId'] == segment['id']), {}
                ).get('includedCheckedBags', {})

                
                segment['cabin'] = next(
                    (item['cabin'] for item in flight['travelerPricings'][0]['fareDetailsBySegment'] if item['segmentId'] == segment['id']), None
                )
    return Response({'flights': flights})

def get_exchange_rate(from_currency, to_currency):
    response = requests.get(f'https://api.exchangerate-api.com/v4/latest/{from_currency}')
    rates = response.json().get('rates', {})
    return rates.get(to_currency, 1)


def fetch_carrier_names(access_token):
    url = 'https://test.api.amadeus.com/v1/reference-data/airlines'
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(url, headers=headers)
    airlines = response.json().get('data', [])
    
    carrier_names = {}
    for airline in airlines:
        iata_code = airline.get('iataCode')
        common_name = airline.get('name') 
        if iata_code and common_name:
            carrier_names[iata_code] = common_name
    
    return carrier_names




class SchoolListView(generics.ListAPIView):
    serializer_class = EducationalServiceSerializer
    
    def get_queryset(self):
        return EducationalService.objects.filter(service_type='school', user=self.request.user)


class TutorListView(generics.ListAPIView):
    serializer_class = EducationalServiceSerializer
   

    def get_queryset(self):
        return EducationalService.objects.filter(service_type='tutor', user=self.request.user)


class EducationalAidListView(generics.ListAPIView):
    serializer_class = EducationalServiceSerializer
    

    def get_queryset(self):
        return EducationalService.objects.filter(service_type='educational aid', user=self.request.user)

@method_decorator(csrf_exempt, name='dispatch')
class SchoolListFromDB(APIView):
    def post(self, request, *args, **kwargs):
        latitude = request.data.get('lat')
        longitude = request.data.get('lng')
        filter_by = request.data.get('filter')

        if not latitude or not longitude:
            return Response({'error': 'Latitude and longitude are required'}, status=400)

        state, district, block = self.get_state_from_coordinates(latitude, longitude)

        if not state:
            return Response({'error': 'Failed to get state from coordinates'}, status=400)

        nearby_schools = self.get_nearby_schools(state, district, block, filter_by)
        return Response(nearby_schools)

    def get_state_from_coordinates(self, latitude, longitude):
        api_key = API_KEY
        url = f'https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={api_key}'
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data['status'] == 'OK':
                state = None
                district = None
                block = None
                for result in data['results']:
                    for component in result['address_components']:
                        if 'administrative_area_level_1' in component['types']:
                            state = component['long_name']
                        if 'administrative_area_level_2' in component['types']:
                            district = component['long_name']
                        if 'sublocality_level_1' in component['types']:
                            block = component['long_name']
                return state, district, block
        return None, None, None

    def get_nearby_schools(self, state, district, block, filter_by):
        file_path = os.path.join(settings.BASE_DIR, 'data', 'school_info.csv')
        school_data = pd.read_csv(file_path, encoding='ISO-8859-1')

        if filter_by == 'state':
            filtered_schools = school_data[school_data['State'] == state]
        elif filter_by == 'district':
            filtered_schools = school_data[(school_data['State'] == state) & (school_data['District'] == district)]
        elif filter_by == 'block':
            filtered_schools = school_data[(school_data['State'] == state) & (school_data['District'] == district) & (school_data['Block'] == block)]
        else:
            filtered_schools = school_data

        return filtered_schools.to_dict('records')

@api_view(['GET'])
def get_local_pick_and_drop_services(request):
    try:
        user_lat = float(request.query_params.get('lat'))
        user_lng = float(request.query_params.get('lng'))
    except (TypeError, ValueError):
        return Response({'error': 'Invalid or missing latitude and longitude parameters.'}, status=400)

    user_location = (user_lat, user_lng)
    services = TransportService.objects.filter(type_of_service='Pick and Drop')
    
    filtered_services = []
    min_avg_price = float('inf')
    max_avg_price = float('-inf')
    
    for service in services:
        service_location = (service.latitude, service.longitude)
        distance = geodesic(user_location, service_location).kilometers
        
        if distance <= 15:
            filtered_services.append(service)
            min_avg_price = min(min_avg_price, service.price_per_km)
            max_avg_price = max(max_avg_price, service.price_per_km)
    
    if min_avg_price == float('inf'):
        min_avg_price = 0
    if max_avg_price == float('-inf'):
        max_avg_price = 0
    
    serializer = TransportServiceSerializer(filtered_services, many=True)
    return Response({
        'services': serializer.data,
        'min_avg_price_per_hour': min_avg_price,
        'max_avg_price_per_hour': max_avg_price
    })

OLA_SERVER_TOKEN = 'your_ola_server_token'

@api_view(['POST'])
def get_ola_price(request):
    data = request.data
    start_lat = data['origin']['lat']
    start_lng = data['origin']['lng']
    end_lat = data['destination']['lat']
    end_lng = data['destination']['lng']

    url = 'https://sandbox-t.olacabs.com/v1/products'
    headers = {
        'Authorization': f'Bearer {OLA_SERVER_TOKEN}',
        'Content-Type': 'application/json',
    }
    params = {
        'pickup_lat': start_lat,
        'pickup_lng': start_lng,
        'drop_lat': end_lat,
        'drop_lng': end_lng,
    }
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        prices = response.json().get('ride_estimate', [])
        if prices:
            return Response({'price': prices[0]['total_fare']})
        else:
            return Response({'error': 'No prices available'}, status=400)
    else:
        return Response({'error': response.json()}, status=response.status_code)



UBER_SERVER_TOKEN = 'your_uber_server_token'

@api_view(['POST'])
def get_uber_price(request):
    data = request.data
    start_lat = data['origin']['lat']
    start_lng = data['origin']['lng']
    end_lat = data['destination']['lat']
    end_lng = data['destination']['lng']

    url = 'https://api.uber.com/v1.2/estimates/price'
    headers = {
        'Authorization': f'Token {UBER_SERVER_TOKEN}',
        'Content-Type': 'application/json',
    }
    params = {
        'start_latitude': start_lat,
        'start_longitude': start_lng,
        'end_latitude': end_lat,
        'end_longitude': end_lng,
    }
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        prices = response.json().get('prices', [])
        if prices:
            return Response({'price': prices[0]['estimate']})
        else:
            return Response({'error': 'No prices available'}, status=400)
    else:
        return Response({'error': response.json()}, status=response.status_code)
    



@api_view(['GET'])
def get_rental_vehical(request):
    try:
        user_lat = float(request.query_params.get('lat'))
        user_lng = float(request.query_params.get('lng'))
    except (TypeError, ValueError):
        return Response({'error': 'Invalid or missing latitude and longitude parameters.'}, status=400)

    user_location = (user_lat, user_lng)
    services = TransportService.objects.filter(type_of_service='VR')
    
    filtered_services = []
    
    
    for service in services:
        service_location = (service.latitude, service.longitude)
        distance = geodesic(user_location, service_location).kilometers
        
        if distance <= 15:
            filtered_services.append(service)
          
    serializer = TransportServiceSerializer(filtered_services, many=True)
    
    return Response({
        'services': serializer.data
    })
