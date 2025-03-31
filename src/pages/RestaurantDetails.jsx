import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getStateData } from '../data';
import '../styles/RestaurantDetails.css';

const RestaurantDetails = () => {
  const { stateId, restaurantId } = useParams();
  const navigate = useNavigate();
  
  // Get state data
  const stateData = getStateData(stateId);
  
  // Find the restaurant
  const restaurant = stateData?.restaurants?.find(restaurant => restaurant.id === parseInt(restaurantId));
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If restaurant not found, navigate back to home
    if (!restaurant) {
      navigate('/');
    }
  }, [restaurant, navigate]);
  
  if (!restaurant) {
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

      <div className="restaurant-details-page">
        <div className="restaurant-details-container">
          <button 
            className="back-button" 
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left"></i> Back
          </button>
          
          <div className="restaurant-header">
            <h1>{restaurant.name}</h1>
            <div className="restaurant-location">
              <i className="fas fa-map-marker-alt"></i> {restaurant.location}
            </div>
            <div className="restaurant-rating">
              <span className="stars">{'★'.repeat(Math.floor(restaurant.rating))}{'☆'.repeat(5 - Math.floor(restaurant.rating))}</span>
              <span className="rating-value">{restaurant.rating}</span>
            </div>
            <div className="restaurant-cuisine">Cuisine: {restaurant.cuisine}</div>
          </div>
          
          <div className="restaurant-image-gallery">
            <img src={restaurant.image} alt={restaurant.name} className="main-image" />
          </div>
          
          <div className="restaurant-description">
            <h2>About the Restaurant</h2>
            <p>{restaurant.description}</p>
          </div>
          
          <div className="restaurant-specialties">
            <h2>Signature Dishes</h2>
            {restaurant.specialDishes ? (
              <ul className="specialty-list">
                {restaurant.specialDishes.map((dish, index) => (
                  <li key={index} className="specialty-item">
                    <i className="fas fa-utensils"></i>
                    <span>{dish}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Information about signature dishes not available for this restaurant.</p>
            )}
          </div>
          
          <div className="restaurant-features">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature">
                <i className="fas fa-wifi"></i>
                <span>Free Wi-Fi</span>
              </div>
              <div className="feature">
                <i className="fas fa-parking"></i>
                <span>Parking Available</span>
              </div>
              <div className="feature">
                <i className="fas fa-glass-cheers"></i>
                <span>Full Bar</span>
              </div>
              <div className="feature">
                <i className="fas fa-music"></i>
                <span>Live Music</span>
              </div>
              <div className="feature">
                <i className="fas fa-wheelchair"></i>
                <span>Wheelchair Accessible</span>
              </div>
              <div className="feature">
                <i className="fas fa-credit-card"></i>
                <span>Cards Accepted</span>
              </div>
            </div>
          </div>
          
          <div className="hours-section">
            <h2>Hours</h2>
            <div className="hours-grid">
              <div className="day">Monday - Thursday</div>
              <div className="time">11:00 AM - 10:00 PM</div>
              <div className="day">Friday - Saturday</div>
              <div className="time">11:00 AM - 11:00 PM</div>
              <div className="day">Sunday</div>
              <div className="time">12:00 PM - 9:00 PM</div>
            </div>
          </div>
          
          <div className="reservation-section">
            <h2>Make a Reservation</h2>
            <button className="reserve-now-btn">
              <i className="fas fa-calendar-check"></i> Reserve a Table
            </button>
            <p className="reservation-info">
              Secure your table for an unforgettable dining experience at {restaurant.name}.
              Special arrangements available for private events.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantDetails; 