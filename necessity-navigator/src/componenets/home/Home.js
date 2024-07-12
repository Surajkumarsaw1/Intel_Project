import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Hero from "./hero/Hero";
import Services from "./services/Services";
import './Home.css';
import Testimonials from "./testimonial/Testimonials";
import Footer from "./footer/Footer";


function Home() {
    const navigate = useNavigate();
    const { loginWithRedirect, logout } = useAuth0();
    return (
        <div className="page">
            <Hero />
            <Services />
            <Testimonials />
            <Footer />
        </div>
    );
}
export default Home