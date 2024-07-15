
import './App.css';
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Auth from './componenets/Auth/Auth';
import Home from './componenets/home/Home';
import ConsumerNavbar from './componenets/ConsumerNavbar/NavBar';
import ServiceproviderNavbar from './componenets/Serviceprovider/ServiceproviderNavbar/ServiceproviderNavbar';
import LocationPicker from './componenets/LocationPicker';
import HealthCare from './componenets/HealthCare/HealthCare';
import BankingFacilities from './componenets/BankingFacilities/BankingFacilites';
import Flight from './componenets/Transport/flight/Flight';
import Transport from './componenets/Transport/Transport';
import Register from './componenets/Serviceprovider/Register/Register';
import Login from './componenets/Serviceprovider/Login/Login';
import Dashboard from './componenets/Serviceprovider/Dashboard/Dashboard';
import ServiceSelection from './componenets/Serviceprovider/ServiceSelection/ServiceSelection';
import TransportServiceForm from './componenets/Serviceprovider/ServiceSelection/Services/Transport';
import RegisterHealthcareService from './componenets/Serviceprovider/ServiceSelection/Services/Healthcare';
import RegisterEducationalService from './componenets/Serviceprovider/ServiceSelection/Services/Educational';
import ProtectedRoute from './componenets/ProtectedRoute';
import ServiceproviderAuth from './componenets/Serviceprovider/Auth/Auth';
import EducationalServiceSelectionPage from './componenets/Educational/EducationalserviceSelection';
import PicknDrop from './componenets/Transport/PicknDrop/PicknDrop';
import RentalService from './componenets/Transport/Rental/RentalService';
import Footer from './componenets/home/footer/Footer';
function App() {

  const storedLocation = JSON.parse(localStorage.getItem('location'));

  console.log(storedLocation ? 'Location is present in local storage' : 'Location is not present in local storage');

  const location = useLocation();

  const isServiceProviderRoute = location.pathname.startsWith('/service_provider');

  return (
    <div className="App">
      <div className='navigation'>
        {isServiceProviderRoute ? <ServiceproviderNavbar /> : <ConsumerNavbar />}
      </div>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/home/location" element={<ProtectedRoute><LocationPicker /></ProtectedRoute>} />
        <Route path="/home/transport/pickndrop" element={<ProtectedRoute><PicknDrop /></ProtectedRoute>} />
        <Route path="/home/transport" element={<ProtectedRoute><Transport /></ProtectedRoute>} />
        <Route path="/home/transport/rentals" element={<ProtectedRoute><RentalService /></ProtectedRoute>} />
        <Route path="/home/education" element={<ProtectedRoute><EducationalServiceSelectionPage /></ProtectedRoute>} />
        <Route path="/service_provider/register" element={<Register />} />
        <Route path="/service_provider/auth" element={<ServiceproviderAuth />} />
        <Route path="/service_provider/login" element={<Login />} />
        <Route path="/service_provider/service-selection" element={<ServiceSelection />} />
        <Route path="/service_provider/dashboard" element={<Dashboard />} />
        <Route path="/service_provider/register/transport" element={<TransportServiceForm />} />
        <Route path="/service_provider/register/healthcare" element={<RegisterHealthcareService />} />
        <Route path="/service_provider/register/educational" element={<RegisterEducationalService />} />
        <Route path="/home/transport/flight" element={<ProtectedRoute><Flight /></ProtectedRoute>} />

        <Route path="/home/healthcare" element={<ProtectedRoute><HealthCare /></ProtectedRoute>} />

        <Route
          path="/home/banking"
          element={storedLocation ? <ProtectedRoute><BankingFacilities /></ProtectedRoute> : <Navigate to="/home/location" />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
