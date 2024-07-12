from django.db import models
from django.contrib.auth.models import User


class TransportService(models.Model):
    PICK_AND_DROP = 'PD'
    VEHICLE_RENTAL = 'VR'
    SERVICE_CHOICES = [
        (PICK_AND_DROP, 'Pick and Drop'),
        (VEHICLE_RENTAL, 'Vehicle Rental'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    type_of_service = models.CharField(max_length=2, choices=SERVICE_CHOICES)
    contact_info = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()

   
    vehicle_type = models.CharField(max_length=255, blank=True, null=True)
    price_per_km = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    cars = models.BooleanField(default=False)
    bikes = models.BooleanField(default=False)
    scooty = models.BooleanField(default=False)
    suvs = models.BooleanField(default=False)
    avg_price_range_per_hour = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'name', 'type_of_service', 'address', 'latitude', 'longitude'],
                name='unique_transport_service'
            ),
            models.UniqueConstraint(
                fields=['user', 'name', 'type_of_service', 'vehicle_type', 'price_per_km', 'address', 'contact_info', 'latitude', 'longitude'],
                condition=models.Q(type_of_service='PD'),
                name='unique_pick_and_drop_service'
            ),
            models.UniqueConstraint(
                fields=['user', 'name', 'type_of_service', 'address', 'contact_info', 'latitude', 'longitude', 'cars', 'bikes', 'scooty', 'suvs', 'avg_price_range_per_hour'],
                condition=models.Q(type_of_service='VR'),
                name='unique_vehicle_rental_service'
            )
        ]


class HealthcareService(models.Model):
    SERVICE_TYPE_CHOICES = [
        ('Hospital', 'Hospital'),
        ('Clinic', 'Clinic'),
        ('Physiotherapist', 'Physiotherapist'),
        ('Lab', 'Lab'),
        ('Pharmacy', 'Pharmacy'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    contact_info = models.CharField(max_length=255)
    details = models.TextField()
    speciality = models.CharField(max_length=255, blank=True, null=True)
    emergency_services = models.BooleanField(default=False)  # Hospital specific
    provide_home_service = models.BooleanField(default=False)  # Lab specific
    provide_all_basic_tests = models.BooleanField(default=False)  # Lab specific
    specific_tests = models.TextField(blank=True, null=True)  # Lab specific

 
class EducationalService(models.Model):
    SERVICE_TYPES = [
        ('school', 'School'),
        ('tutor', 'Tutor'),
        ('educational aid', 'Educational Aid'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    contact_info = models.CharField(max_length=255)
    details = models.TextField()
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPES)
    grade_range = models.CharField(max_length=50, blank=True, null=True)
    streams = models.JSONField(blank=True, null=True)  
    board = models.CharField(max_length=50, blank=True, null=True)
    sports_facility = models.BooleanField(default=False)
    computer_lab = models.BooleanField(default=False)
    library = models.BooleanField(default=False)
    subjects_taught = models.CharField(max_length=255, blank=True, null=True)
    avg_pricing = models.CharField(max_length=255, blank=True, null=True)
    hours_per_day = models.CharField(max_length=255, blank=True, null=True)
    aid_type = models.CharField(max_length=50, blank=True, null=True)
    sell_or_donate = models.CharField(max_length=50, blank=True, null=True)

 
    
      






      
