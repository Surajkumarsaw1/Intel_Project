import React from 'react';
import Testimonial from './Testimonial';
import './Testimonials.css';

const Testimonials = () => {
    return (
        <section className="testimonials">
            <h1>Our Reviews</h1>
            <Testimonial
                image="https://www.hotelbooqi.com/wp-content/uploads/2021/12/128-1280406_view-user-icon-png-user-circle-icon-png.png"
                text="Great resource for healthcare info!"
                author="User 1"
            />
            <Testimonial
                image="https://www.hotelbooqi.com/wp-content/uploads/2021/12/128-1280406_view-user-icon-png-user-circle-icon-png.png"
                text="Found the best school for my kids."
                author="User 2"
            />
            <Testimonial
                image="https://www.hotelbooqi.com/wp-content/uploads/2021/12/128-1280406_view-user-icon-png-user-circle-icon-png.png"
                text="Helpful transport schedules."
                author="User 3"
            />
        </section>
    );
};

export default Testimonials;
