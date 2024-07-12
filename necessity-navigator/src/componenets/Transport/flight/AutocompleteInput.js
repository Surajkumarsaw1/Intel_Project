import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './AutocompleteInput.css';
const AutocompleteInput = ({ label, onSelect }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        if (inputValue.length > 2) {
            fetchSuggestions(inputValue);
        } else {
            setSuggestions([]);
        }
    }, [inputValue]);

    const fetchSuggestions = async (query) => {
        try {
            const response = await axios.post('http://localhost:8000/api/tranport/flight/get_ita_code/', { location: query });
            if (response.data.locations) {
                setSuggestions(response.data.locations);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    };

    const handleSelect = (suggestion) => {
        setInputValue(suggestion.name);
        setSuggestions([]);
        onSelect(suggestion);
    };

    const handleClickOutside = (event) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
            setSuggestions([]);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="autocomplete-input">
            <label>{label}</label>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter city or airport"
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list" ref={suggestionsRef}>
                    {suggestions.map((suggestion) => (
                        <li key={suggestion.iataCode} onClick={() => handleSelect(suggestion)}>
                            {suggestion.name} ({suggestion.iataCode})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteInput;