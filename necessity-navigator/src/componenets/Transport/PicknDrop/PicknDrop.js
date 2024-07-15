import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import axios from 'axios';
import './PicknDrop.css'; // Import the CSS file

const PicknDrop = () => {
    const [map, setMap] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [destination, setDestination] = useState('');
    const [pickup, setPickup] = useState('');
    const [localServices, setLocalServices] = useState([]);
    const [olaPrice, setOlaPrice] = useState(null);
    const [uberPrice, setUberPrice] = useState(null);
    const [avgLocalPriceRange, setAvgLocalPriceRange] = useState({ min: 0, max: 0 });

    const containerStyle = {
        width: '100%',
        height: '300px'
    };

    const center = {
        lat: -3.745,
        lng: -38.523
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            error => console.log(error)
        );
    }, []);

    useEffect(() => {
        if (currentLocation) {
            axios.get('http://localhost:8000/api/transport/transport-services/', {
                params: currentLocation
            }).then(response => {
                setLocalServices(response.data.services);
                const { min_avg_price_per_hour, max_avg_price_per_hour } = response.data;
                setAvgLocalPriceRange({
                    min: min_avg_price_per_hour,
                    max: max_avg_price_per_hour
                });
            }).catch(error => console.log(error));
        }
    }, [currentLocation]);

    const calculateRoute = () => {
        if (pickup === '' || destination === '') {
            return;
        }
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: pickup,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirectionsResponse(result);

                    const pickupCoords = {
                        lat: result.routes[0].legs[0].start_location.lat(),
                        lng: result.routes[0].legs[0].start_location.lng()
                    };

                    const destinationCoords = {
                        lat: result.routes[0].legs[0].end_location.lat(),
                        lng: result.routes[0].legs[0].end_location.lng()
                    };

                    axios.post('http://localhost:8000/api/transport/transport-services/ola-price/', { origin: pickupCoords, destination: destinationCoords })
                        .then(response => setOlaPrice(response.data.price))
                        .catch(error => console.log(error));

                    axios.post('http://localhost:8000/api/transport/transport-services/uber-price/', { origin: pickupCoords, destination: destinationCoords })
                        .then(response => setUberPrice(response.data.price))
                        .catch(error => console.log(error));
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    };

    const onLoad = map => {
        setMap(map);
    };

    const onUnmount = map => {
        setMap(null);
    };

    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
            <div className="container">
                <div className="left-side">
                    <div className="map-container">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={currentLocation || center}
                            zoom={10}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                        >
                            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
                        </GoogleMap>
                    </div>
                    <div className="controls">
                        <Autocomplete onPlaceChanged={() => setPickup(document.getElementById('pickup').value)}>
                            <input type="text" id="pickup" placeholder="Enter pickup location" />
                        </Autocomplete>
                        <Autocomplete onPlaceChanged={() => setDestination(document.getElementById('destination').value)}>
                            <input type="text" id="destination" placeholder="Enter destination" />
                        </Autocomplete>
                        <button onClick={calculateRoute}>Get Route</button>
                    </div>
                    <div className="info-section">
                        <h2>Price Comparison</h2>
                        <p>Ola: {olaPrice ? `₹${olaPrice}` : 'Fetching...'}</p>
                        <p>Uber: {uberPrice ? `₹${uberPrice}` : 'Fetching...'}</p>
                        {directionsResponse && (
                            <p>
                                Local Avg Price Range: ₹{(avgLocalPriceRange.min * directionsResponse.routes[0].legs[0].distance.value / 1000).toFixed(2)} - ₹{(avgLocalPriceRange.max * directionsResponse.routes[0].legs[0].distance.value / 1000).toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>
                <div className="right-side">
                    <div className="info-section">
                        <h2>Local Service Providers</h2>
                        <ul className="service-list">
                            {localServices.map(service => (
                                <li key={service.id}>{service.name} - {service.contact}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </LoadScript>
    );
};

export default PicknDrop;
