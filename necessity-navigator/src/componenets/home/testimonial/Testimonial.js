import React from 'react';
import './Testimonial.css';

const Testimonial = ({ image, text, author }) => {
    return (
        <div className="testimonial">
            <img src={image} alt={author} />
            <p>"{text}" - {author}</p>
        </div>
    );
};

export default Testimonial;
