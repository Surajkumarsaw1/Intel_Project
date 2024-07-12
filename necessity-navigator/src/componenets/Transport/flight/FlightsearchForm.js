import React, { useState } from 'react';
import AutocompleteInput from './AutocompleteInput';
import axios from 'axios';
import './FlightsearchForm.css'
const FlightSearchForm = () => {
    const [departure, setDeparture] = useState(null);
    const [destination, setDestination] = useState(null);
    const [date, setDate] = useState('');
    const [flights, setFlights] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/tranport/flight/flight_search/', {
                departure: departure.name,
                destination: destination.name,
                date: date,
            });
            setFlights(response.data.flights.data || []);
        } catch (error) {
            console.error('Error searching for flights:', error);
        }
    };

    return (
        <div className="flight-search-container">
            <form className="flight-search-form" onSubmit={handleSearch}>
                <div className="input-group">
                    <AutocompleteInput label="Departure" onSelect={setDeparture} />
                </div>
                <div className="input-group">
                    <AutocompleteInput label="Destination" onSelect={setDestination} />
                </div>
                <div className="input-group">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <button type="submit">Search Flights</button>
                </div>
            </form>
            {flights.length > 0 ? (
                <ul className="flight-list">
                    {flights.map((flight, index) => (
                        <li key={index}>
                            {flight.itineraries.map((itinerary, itinIndex) => (
                                <div key={itinIndex}>
                                    <p>
                                        {itinerary.segments[0].departure.iataCode} to{' '}
                                        {itinerary.segments[itinerary.segments.length - 1].arrival.iataCode} on{' '}
                                        {itinerary.segments[0].departure.at}
                                    </p>
                                    <p>
                                        Flight Duration: {itinerary.duration}
                                    </p>
                                    <p>
                                        Flight Type: {itinerary.segments.map(segment => segment.cabin).join(', ')}
                                    </p>
                                    <p>
                                        Airlines: {itinerary.segments.map(segment => segment.carrierName).join(', ')}
                                    </p>
                                    <p>
                                        Price (INR): {flight.price.grandTotalINR}
                                    </p>
                                    <p>
                                        Baggage Limit: {itinerary.segments.map(segment => {
                                            const bags = segment.includedCheckedBags;
                                            return bags ? `${bags.weight} ${bags.weightUnit}` : 'No baggage info';
                                        }).join(', ')}
                                    </p>
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No flights found.</p>
            )}
        </div>
    );
};

export default FlightSearchForm;
