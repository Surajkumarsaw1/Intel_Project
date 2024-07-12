from django.urls import path, include
from .views import RegisterView , UserProfileView,register_transport_service,get_user_services,register_educational_service,register_healthcare_service

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('register-transport/',register_transport_service),
    path('register-healthcare/',register_healthcare_service),
    path('register-educational/',register_educational_service),

    path('profile/services/', get_user_services, name='get_user_services'),

]