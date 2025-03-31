import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Card.css';

const Card = ({ item, type, stateId }) => {
  const navigate = useNavigate();
  const { user, addToFavorites, isInFavorites, removeFromFavorites } = useAuth();

  const handleNameClick = () => {
    if (type === 'hotels') {
      // Navigate to hotel details page
      navigate(`/state/${stateId}/hotel/${item.id}`);
    } else if (type === 'restaurants') {
      // Navigate to restaurant details page
      navigate(`/state/${stateId}/restaurant/${item.id}`);
    } else if (type === 'attractions') {
      // Navigate to attraction details page
      navigate(`/state/${stateId}/attraction/${item.id}`);
    } else {
      // For other types, show a notification that details aren't available yet
      alert(`Details for ${item.name} will be available soon!`);
    }
  };

  const handleBookingClick = () => {
    if (user) {
      if (type === 'hotels') {
        navigate(`/state/${stateId}/hotel/${item.id}/booking`);
      } else if (type === 'restaurants') {
        navigate(`/state/${stateId}/restaurant/${item.id}/booking`);
      } else if (type === 'attractions') {
        navigate(`/state/${stateId}/attraction/${item.id}/booking`);
      }
    } else {
      // If user is not logged in, redirect to login page
      alert('Please login to book this item');
      navigate('/login');
    }
  };

  const handleFavoriteClick = () => {
    if (!user) {
      alert('Please login to save favorites');
      navigate('/login');
      return;
    }

    const favoriteItem = {
      id: item.id,
      name: item.name,
      image: item.image,
      location: item.location,
      rating: item.rating,
      type: type,
      stateId: stateId
    };

    if (isInFavorites(item.id, type)) {
      removeFromFavorites(item.id, type);
    } else {
      addToFavorites(favoriteItem);
    }
  };

  const isFavorite = user && isInFavorites(item.id, type);

  return (
    <div className="card">
      <div className="card-image">
        <img src={item.image} alt={item.name} />
        {user && (
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
          >
            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
          </button>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title" onClick={handleNameClick}>{item.name}</h3>
        <p className="location"><i className="fas fa-map-marker-alt"></i> {item.location}</p>
        <div className="rating">
          <span className="stars">{'★'.repeat(Math.floor(item.rating))}{'☆'.repeat(5 - Math.floor(item.rating))}</span>
          <span className="rating-value">{item.rating}</span>
        </div>
        {type === 'hotels' && <p className="price-range">Price: {item.priceRange}</p>}
        {type === 'restaurants' && <p className="cuisine">Cuisine: {item.cuisine}</p>}
        {type === 'attractions' && <p className="entry-fee">Entry Fee: {item.entryFee}</p>}
        <p className="description">{item.description.substring(0, 100)}...</p>
        
        <div className="card-actions">
          <button className="details-btn" onClick={handleNameClick}>
            <i className="fas fa-info-circle"></i> View Details
          </button>
          <button className="booking-btn" onClick={handleBookingClick}>
            {type === 'hotels' && <><i className="fas fa-bed"></i> Book Stay</>}
            {type === 'restaurants' && <><i className="fas fa-utensils"></i> Reserve Table</>}
            {type === 'attractions' && <><i className="fas fa-ticket-alt"></i> Book Ticket</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
