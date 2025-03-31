import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getStateData } from '../data';
import '../styles/HotelDetails.css';

const HotelDetails = () => {
  const { stateId, hotelId } = useParams();
  const navigate = useNavigate();
  
  // Get state data
  const stateData = getStateData(stateId);
  
  // Find the hotel
  const hotel = stateData?.hotels?.find(hotel => hotel.id === parseInt(hotelId));
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If hotel not found, navigate back to home
    if (!hotel) {
      navigate('/');
    }
  }, [hotel, navigate]);
  
  if (!hotel) {
    return <div className="loading">Loading...</div>;
  }

  // Create stars for background
  useEffect(() => {
    const createStars = () => {
      const starContainer = document.getElementById('star-background');
      if (!starContainer) return;
      
      // Clear existing stars
      starContainer.innerHTML = '';
      
      // Create new stars
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star-bg';
        
        // Random position
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        // Random size (0.5px to 2px)
        const size = 0.5 + Math.random() * 1.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starContainer.appendChild(star);
      }
    };
    
    createStars();
  }, []);
  
  return (
    <div className="app-container">
      <div id="star-background" className="star-background"></div>
      <Header />

      <div className="hotel-details-page">
        <div className="hotel-details-container">
          <button 
            className="back-button" 
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left"></i> Back
          </button>
          
          <div className="hotel-header">
            <h1>{hotel.name}</h1>
            <div className="hotel-location">
              <i className="fas fa-map-marker-alt"></i> {hotel.location}
            </div>
            <div className="hotel-rating">
              <span className="stars">{'★'.repeat(Math.floor(hotel.rating))}{'☆'.repeat(5 - Math.floor(hotel.rating))}</span>
              <span className="rating-value">{hotel.rating}</span>
            </div>
            <div className="price-range">Price: {hotel.priceRange}</div>
          </div>
          
          <div className="hotel-image-gallery">
            <img src={hotel.image} alt={hotel.name} className="main-image" />
          </div>
          
          <div className="hotel-description">
            <h2>About the Hotel</h2>
            <p>{hotel.description}</p>
          </div>
          
          <div className="hotel-specialties">
            <h2>What Makes Us Special</h2>
            {hotel.specialFeatures ? (
              <ul className="specialty-list">
                {hotel.specialFeatures.map((feature, index) => (
                  <li key={index} className="specialty-item">
                    <i className="fas fa-gem"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Information about specialties not available for this hotel.</p>
            )}
          </div>
          
          <div className="hotel-amenities">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              <div className="amenity">
                <i className="fas fa-wifi"></i>
                <span>Free Wi-Fi</span>
              </div>
              <div className="amenity">
                <i className="fas fa-swimming-pool"></i>
                <span>Swimming Pool</span>
              </div>
              <div className="amenity">
                <i className="fas fa-concierge-bell"></i>
                <span>Room Service</span>
              </div>
              <div className="amenity">
                <i className="fas fa-spa"></i>
                <span>Spa</span>
              </div>
              <div className="amenity">
                <i className="fas fa-dumbbell"></i>
                <span>Fitness Center</span>
              </div>
              <div className="amenity">
                <i className="fas fa-utensils"></i>
                <span>Restaurant</span>
              </div>
            </div>
          </div>
          
          <div className="booking-section">
            <h2>Book Your Stay</h2>
            <button className="book-now-btn">
              <i className="fas fa-calendar-check"></i> Book Now
            </button>
            <p className="booking-info">
              Secure your reservation for an unforgettable experience at {hotel.name}.
              Special rates available for extended stays.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HotelDetails; 