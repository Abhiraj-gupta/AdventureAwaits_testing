import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CardList from './components/CardList';
import StateSelector from './components/StateSelector';
import HotelDetails from './pages/HotelDetails';
import RestaurantDetails from './pages/RestaurantDetails';
import AttractionDetails from './pages/AttractionDetails';
import StateDetails from './pages/StateDetails';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import ExploreStates from './pages/ExploreStates';
import BudgetResults from './pages/BudgetResults';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { getStateData } from './data';
import './App.css';
import './styles/theme.css';

function HomePage() {
  const [selectedState, setSelectedState] = useState('uttarPradesh');
  const [visibleSections, setVisibleSections] = useState({
    hotels: false,
    restaurants: false,
    attractions: false
  });
  
  const stateData = getStateData(selectedState);
  
  // Refs for scroll animations
  const hotelsRef = useRef(null);
  const restaurantsRef = useRef(null);
  const attractionsRef = useRef(null);
  
  // Create stars on component mount and set up observers
  useEffect(() => {
    createStars();
    
    // Set up intersection observer for animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          if (sectionId === 'home-hotels-section') {
            setVisibleSections(prev => ({ ...prev, hotels: true }));
          } else if (sectionId === 'home-restaurants-section') {
            setVisibleSections(prev => ({ ...prev, restaurants: true }));
          } else if (sectionId === 'home-attractions-section') {
            setVisibleSections(prev => ({ ...prev, attractions: true }));
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (hotelsRef.current) observer.observe(hotelsRef.current);
    if (restaurantsRef.current) observer.observe(restaurantsRef.current);
    if (attractionsRef.current) observer.observe(attractionsRef.current);
    
    return () => {
      if (hotelsRef.current) observer.unobserve(hotelsRef.current);
      if (restaurantsRef.current) observer.unobserve(restaurantsRef.current);
      if (attractionsRef.current) observer.unobserve(attractionsRef.current);
    };
  }, []);
  
  // Function to create stars in the background
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
  
  return (
        <div className="app-container">
      <div id="star-background" className="star-background"></div>
          <Header />
          
          <main className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-title-top">Discover the Wonders of</span>
              <span className="hero-title-main">Incredible India</span>
            </h1>
            <p className="hero-tagline">
              <span className="project-name">Adventure Awaits</span> 
              <span className="tagline-text">in every corner, from Himalayan peaks to Kerala's backwaters</span>
            </p>
            <button className="hero-cta" onClick={() => document.getElementById('state-selector').scrollIntoView({ behavior: 'smooth' })}>
              Explore Now <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        
        {/* State Selector Section */}
        <div id="state-selector" className="state-selector">
          <h2>Select Your Destination</h2>
          <div className="state-grid">
            {stateData.map((state) => (
              <div
                key={state.id}
                className={`state-card ${selectedState === state.id ? 'selected' : ''}`}
                onClick={() => setSelectedState(state.id)}
              >
                <img src={state.image} alt={state.name} />
                <div className="state-info">
                  <h3>{state.name}</h3>
                  <p>{state.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="category-rows">
          {/* Hotels Section */}
          <div 
            ref={hotelsRef} 
            id="home-hotels-section" 
            className={`category-row ${visibleSections.hotels ? 'animate-in' : ''}`}
          >
            <div className="row-header">
              <div className="section-icon hotel-icon">
                <i className="fas fa-hotel"></i>
              </div>
              <div className="section-title">
                <h2>Hotels & Accommodations</h2>
                <p>Find comfortable stays for your journey</p>
              </div>
              <div className="view-all-link">
                <a href={`/state/${selectedState}`} className="view-all-btn">
                  View All <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
            
            <div className="item-row">
              {stateData.hotels.slice(0, 4).map(hotel => (
                <div key={hotel.id} className="card-item">
                  <a href={`/state/${selectedState}/hotel/${hotel.id}`} className="card-link">
                    <div className="card">
                      <div className="card-image" style={{ backgroundImage: `url(${hotel.image})` }}></div>
                      <div className="card-content">
                        <h3 className="card-title">{hotel.name}</h3>
                        <p className="card-description">{hotel.description.substring(0, 80)}...</p>
                        <div className="card-rating">
                          <i className="fas fa-star"></i>
                          <span>{hotel.rating} ({hotel.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          {/* Restaurants Section */}
          <div 
            ref={restaurantsRef} 
            id="home-restaurants-section" 
            className={`category-row ${visibleSections.restaurants ? 'animate-in' : ''}`}
          >
            <div className="row-header">
              <div className="section-icon restaurant-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <div className="section-title">
                <h2>Restaurants & Dining</h2>
                <p>Discover delicious local cuisine and dining options</p>
              </div>
              <div className="view-all-link">
                <a href={`/state/${selectedState}`} className="view-all-btn">
                  View All <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
            
            <div className="item-row">
              {stateData.restaurants.slice(0, 4).map(restaurant => (
                <div key={restaurant.id} className="card-item">
                  <a href={`/state/${selectedState}/restaurant/${restaurant.id}`} className="card-link">
                    <div className="card">
                      <div className="card-image" style={{ backgroundImage: `url(${restaurant.image})` }}></div>
                      <div className="card-content">
                        <h3 className="card-title">{restaurant.name}</h3>
                        <p className="card-description">{restaurant.description.substring(0, 80)}...</p>
                        <div className="card-rating">
                          <i className="fas fa-star"></i>
                          <span>{restaurant.rating} ({restaurant.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          {/* Attractions Section */}
          <div 
            ref={attractionsRef} 
            id="home-attractions-section" 
            className={`category-row ${visibleSections.attractions ? 'animate-in' : ''}`}
          >
            <div className="row-header">
              <div className="section-icon attraction-icon">
                <i className="fas fa-mountain"></i>
              </div>
              <div className="section-title">
                <h2>Tourist Attractions</h2>
                <p>Explore the must-visit sights and experiences</p>
              </div>
              <div className="view-all-link">
                <a href={`/state/${selectedState}`} className="view-all-btn">
                  View All <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
            
            <div className="item-row">
              {stateData.attractions.slice(0, 4).map(attraction => (
                <div key={attraction.id} className="card-item">
                  <a href={`/state/${selectedState}/attraction/${attraction.id}`} className="card-link">
                    <div className="card">
                      <div className="card-image" style={{ backgroundImage: `url(${attraction.image})` }}></div>
                      <div className="card-content">
                        <h3 className="card-title">{attraction.name}</h3>
                        <p className="card-description">{attraction.description.substring(0, 80)}...</p>
                        <div className="card-rating">
                          <i className="fas fa-star"></i>
                          <span>{attraction.rating} ({attraction.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          {/* Budget Tracker Section */}
          <div 
            id="home-budget-section" 
            className={`category-row budget-section ${visibleSections.attractions ? 'animate-in' : ''}`}
          >
            <div className="row-header">
              <div className="section-icon budget-icon">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="section-title">
                <h2>Budget Tracker</h2>
                <p>Plan and manage your travel expenses</p>
              </div>
            </div>
            
            <BudgetCalculator />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

const BudgetCalculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    accommodation: 0,
    food: 0,
    transportation: 0,
    activities: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Budget form submitted:", formData);
    // Convert string values to numbers where needed
    const processedData = {
      ...formData,
      travelers: Number(formData.travelers),
      accommodation: Number(formData.accommodation),
      food: Number(formData.food),
      transportation: Number(formData.transportation),
      activities: Number(formData.activities)
    };
    
    navigate('/budget-results', { 
      state: { budgetData: processedData } 
    });
  };

  return (
    <div className="budget-calculator">
      <h2>Plan Your Trip Budget</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="destination">Destination</label>
          <select
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a destination</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Kerala">Kerala</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Goa">Goa</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="travelers">Number of Travelers</label>
          <input
            type="number"
            id="travelers"
            name="travelers"
            min="1"
            value={formData.travelers}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="budget-categories">
          <div className="form-group">
            <label htmlFor="accommodation">Accommodation Budget (₹)</label>
            <input
              type="number"
              id="accommodation"
              name="accommodation"
              min="0"
              value={formData.accommodation}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="food">Food Budget (₹)</label>
            <input
              type="number"
              id="food"
              name="food"
              min="0"
              value={formData.food}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="transportation">Transportation Budget (₹)</label>
            <input
              type="number"
              id="transportation"
              name="transportation"
              min="0"
              value={formData.transportation}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="activities">Activities Budget (₹)</label>
            <input
              type="number"
              id="activities"
              name="activities"
              min="0"
              value={formData.activities}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="calculate-btn">
          Calculate Budget
        </button>
      </form>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/state/:stateId" element={<StateDetails />} />
            <Route path="/state/:stateId/hotel/:hotelId" element={<HotelDetails />} />
            <Route path="/state/:stateId/restaurant/:restaurantId" element={<RestaurantDetails />} />
            <Route path="/state/:stateId/attraction/:attractionId" element={<AttractionDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/explore-states" element={<ExploreStates />} />
            <Route path="/budget-results" element={<BudgetResults />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;