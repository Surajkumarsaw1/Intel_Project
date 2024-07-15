import React from "react";
import './ServiceproviderNavbar.css'
import { Link } from "react-router-dom";

const ServiceproviderNavbar = () => {



    return (
        <div className="navbar">

            <h1>SERVICE NAVIGATOR</h1>

            <ul>
                <li><Link to={"/service_provider/dashboard"}>Dashboard</Link></li>
                <li><Link to={"/service_provider/service-selection"}>ServiceSelection </Link></li>


            </ul>
        </div>
    )
}

export default ServiceproviderNavbar