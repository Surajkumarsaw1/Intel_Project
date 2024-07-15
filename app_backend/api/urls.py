from django.urls import path,include
from .views import get_health_facilities , fetch_place_details,fetch_banking_facilities_banks,fetch_banking_facilities_atm,search_flights,get_iata_code
from .views import SchoolListView, TutorListView, EducationalAidListView,SchoolListFromDB
from .views import get_local_pick_and_drop_services,get_ola_price,get_uber_price
from .views import get_rental_vehical , calculate_distance,get_doctors



urlpatterns = [
    path('health_facilities/',get_health_facilities),
    path('health_facilities/details/',fetch_place_details),
    path('bank-facilities/', fetch_banking_facilities_banks),
    path('bank-facilities/atm/', fetch_banking_facilities_atm),
    path('tranport/flight/flight_search/',search_flights),
    path('tranport/flight/get_ita_code/', get_iata_code),
    path('educational/schools/', SchoolListView.as_view(), name='school-list'),
    path('educational/tutors/', TutorListView.as_view(), name='tutor-list'),
    path('educational/aids/', EducationalAidListView.as_view(), name='educational-aid-list'),
    path('educational/global-schools/', SchoolListFromDB.as_view(), name='educational-aid-list'),
    path('transport/transport-services/', get_local_pick_and_drop_services, name='transport-services'),
    path('transport/transport-services/ola-price/', get_ola_price, name='ola-price'),
    path('transport/transport-services/uber-price/', get_uber_price, name='uber-price'),
    path('transport/rental/', get_rental_vehical),
    path('calculate_distance/', calculate_distance),
    path('get_doctors/', get_doctors),

]