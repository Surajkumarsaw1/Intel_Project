import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BankingFacilities.css';
import { Link } from 'react-router-dom';

const BankingFacilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [facilitiesAtm, setFacilitiesAtm] = useState([]);
    const [nearestAtm, setNearestAtm] = useState(null);
    const [nearestBank, setNearestBank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bankDistances, setBankDistances] = useState({});
    const [atmDistances, setAtmDistances] = useState({});
    const location = JSON.parse(localStorage.getItem('location'));

    useEffect(() => {
        if (location && loading) {
            fetchFacilities(location);
            fetchFacilitiesAtm(location);
        }
    }, [location, loading]);

    const fetchFacilities = async (location) => {
        try {
            const response = await axios.post('http://localhost:8000/api/bank-facilities/', location);
            const data = response.data;
            setFacilities(data.facilities || []);
            await calculateDistances(location, data.facilities, 'bank');
        } catch (error) {
            console.error('Error fetching facilities:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFacilitiesAtm = async (location) => {
        try {
            const response = await axios.post('http://localhost:8000/api/bank-facilities/atm/', location);
            const data = response.data;
            setFacilitiesAtm(data.facilitiesAtm || []);
            await calculateDistances(location, data.facilitiesAtm, 'atm');
        } catch (error) {
            console.error('Error fetching ATM facilities:', error);
        } finally {
            setLoading(false);
        }
    };

    const openInNewTab = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const calculateDistances = async (location, services, serviceType) => {
        try {
            const response = await axios.post('http://localhost:8000/api/calculate_distance/', {
                location,
                services,
                servicetype: serviceType,
            });
            const data = response.data;
            const updatedServices = data.services;

            if (serviceType === 'bank') {
                setNearestBank(data.nearest_bank);
                const bankDistances = {};
                updatedServices.forEach(service => {
                    bankDistances[service.place_id || service.name] = service.distance;
                });
                setBankDistances(bankDistances);
            } else if (serviceType === 'atm') {
                setNearestAtm(data.nearest_atm);
                const atmDistances = {};
                updatedServices.forEach(service => {
                    atmDistances[service.place_id || service.name] = service.distance;
                });
                setAtmDistances(atmDistances);
            }
        } catch (error) {
            console.error('Error calculating distances:', error);
        }
    };

    return (
        <div className="banking-container">
            <div className='add-ons'>
                <div className='banking-top'>
                    <h2>Banking Basics</h2>
                    <div className='options-container'>
                        <div
                            className='option-item'
                            onClick={() => openInNewTab("https://www.hdfcbank.com/personal/resources/learning-centre/save/how-to-open-a-savings-account-online-in-five-steps")}
                        >
                            <h3>How to Open an Account</h3>
                        </div>
                        <div
                            className='option-item'
                            onClick={() => openInNewTab("https://www.hdfcbank.com/personal/resources/learning-centre/pay/know-how-to-activate-debit-card")}
                        >
                            <h3>How to Activate Bank Card</h3>
                        </div>
                    </div>

                </div>
                <div className='investment-info'><div className='banking-top'>
                    <h2>Investment Knowledge</h2>
                    <div className='options-container'>
                        <div
                            className='option-item'
                            onClick={() => openInNewTab("https://www.investopedia.com/terms/m/mutualfund.asp")}
                        >
                            <h3>Mutual Funds</h3>
                        </div>
                        <div
                            className='option-item'
                            onClick={() => openInNewTab("https://www.icicibank.com/blogs/sip/what-is-sip-and-how-does-it-work")}
                        >
                            <h3>SIP</h3>
                        </div>
                        <div
                            className='option-item'
                            onClick={() => openInNewTab("https://www.nerdwallet.com/article/investing/stock-market-basics-everything-beginner-investors-know")}
                        >
                            <h3>Stocks</h3>
                        </div>
                    </div>

                </div></div>
            </div>
            <div className='banking1'>
                <div className="banking-left">
                    <div className="banking-facilities-container">
                        <h2 className="banking-title">Banks Near You</h2>
                        <div className="banking-scrollable-container">
                            <div className="banking-facilities-list">
                                {facilities.map((facility, index) => (
                                    <div key={index} className="banking-facility-item">
                                        <h3>{facility.name}</h3>
                                        <p className="banking-paragraph"><span>Type:</span> {facility.type}</p>
                                        <p className="banking-paragraph"><span>Address:</span> {facility.address}</p>
                                        <p className="banking-paragraph"><span>Rating:</span> {facility.rating}</p>
                                        <p className="banking-paragraph"><span>Distance:</span> {bankDistances[facility.place_id || facility.name] || 'Calculating...'} km</p>
                                        <p className="banking-paragraph"><span>Is open:</span> {facility.open_now ? 'Yes' : 'No'}</p>
                                        <p className="banking-paragraph"><span>Highest Savings account interest rate:</span> {facility.interest_rates ? facility.interest_rates.savings_interest_rate : 'N/A'}%</p>
                                        <p className="banking-paragraph"><span>Highest Fixed Deposite interest rate:</span>{facility.interest_rates ? facility.interest_rates.fd_interest_rate : 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h2 className="banking-title">ATMs Near You</h2>
                        <div className="banking-scrollable-container">
                            <div className="banking-facilities-list">
                                {facilitiesAtm.map((facility, index) => (
                                    <div key={index} className="banking-facility-item">
                                        <h3>{facility.name}</h3>
                                        <p className="banking-paragraph"><span>Type:</span> {facility.type}</p>
                                        <p className="banking-paragraph"><span>Address:</span> {facility.address}</p>
                                        <p className="banking-paragraph"><span>Rating:</span> {facility.rating}</p>
                                        <p className="banking-paragraph"><span>Distance:</span> {atmDistances[facility.place_id || facility.name] || 'Calculating...'} km</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="banking-right">
                    <div className="banking-facilities-container">
                        <h2 className="banking-title">Nearest Bank & ATM</h2>
                        {nearestBank ? (
                            <div className="banking-facility-item nearest">
                                <h3>{nearestBank.name}</h3>
                                <p className="banking-paragraph"><span>Type:</span> {nearestBank.type}</p>
                                <p className="banking-paragraph"><span>Address:</span> {nearestBank.address}</p>
                                <p className="banking-paragraph"><span>Rating:</span> {nearestBank.rating}</p>
                                <p className="banking-paragraph"><span>Distance:</span> {nearestBank.distance} km</p>
                                <p className="banking-paragraph"><span>Is open:</span> {nearestBank.open_now ? 'Yes' : 'No'}</p>
                                <p className="banking-paragraph"><span>Highest Savings account interest rate:</span> {nearestBank.interest_rates ? nearestBank.interest_rates.savings_interest_rate : 'N/A'}%</p>
                                <p className="banking-paragraph"><span>Highest Fixed Deposite interest rate:</span>{nearestBank.interest_rates ? nearestBank.interest_rates.fd_interest_rate : 'N/A'}</p>
                            </div>
                        ) : (
                            <p className="banking-paragraph">Calculating nearest bank...</p>
                        )}

                        {nearestAtm ? (
                            <div className="banking-facility-item nearest">
                                <h3>{nearestAtm.name}</h3>
                                <p className="banking-paragraph"><span>Type:</span> {nearestAtm.type}</p>
                                <p className="banking-paragraph"><span>Address:</span> {nearestAtm.address}</p>
                                <p className="banking-paragraph"><span>Rating:</span> {nearestAtm.rating}</p>
                                <p className="banking-paragraph"><span>Distance:</span> {nearestAtm.distance} km</p>
                                <p className="banking-paragraph"><span>Is open:</span> {nearestAtm.open_now ? 'Yes' : 'No'}</p>
                            </div>
                        ) : (
                            <p className="banking-paragraph">Calculating nearest ATM...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankingFacilities;
