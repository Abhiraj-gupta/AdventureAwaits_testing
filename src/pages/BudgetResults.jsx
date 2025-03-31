import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/BudgetResults.css';

const BudgetResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [additionalExpenses, setAdditionalExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ 
    title: '', 
    amount: '' 
  });
  
  // Get budget data from location state
  useEffect(() => {
    console.log("Location state:", location.state);
    if (location.state && location.state.budgetData) {
      console.log("Budget data received:", location.state.budgetData);
      setBudgetData(location.state.budgetData);
    } else {
      console.log("No budget data in location state");
      // If no data, redirect to home after a short delay
      setTimeout(() => navigate('/'), 1000);
    }
    setIsLoading(false);
  }, [location, navigate]);
  
  // If still loading or no budget data, show loading
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="budget-results-container">
          <div className="loading-state">
            <h2>Loading budget information...</h2>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // If no budget data after loading, show error
  if (!budgetData) {
    return (
      <>
        <Header />
        <div className="budget-results-container">
          <div className="error-state">
            <h2>Budget information not found</h2>
            <p>Redirecting to home page...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // Calculate number of days
  const startDate = new Date(budgetData.startDate);
  const endDate = new Date(budgetData.endDate);
  const numberOfDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
  
  // Calculate total budget
  const calculateTotal = () => {
    const categoriesTotal = 
      parseInt(budgetData.accommodation || 0) +
      parseInt(budgetData.food || 0) +
      parseInt(budgetData.transportation || 0) +
      parseInt(budgetData.activities || 0);
      
    const additionalTotal = additionalExpenses
      .reduce((sum, expense) => sum + (parseInt(expense.amount) || 0), 0);
    
    return categoriesTotal + additionalTotal;
  };
  
  // Calculate per person cost
  const calculatePerPersonCost = () => {
    return Math.round(calculateTotal() / budgetData.travelers);
  };
  
  // Calculate per day cost
  const calculatePerDayCost = () => {
    return Math.round(calculateTotal() / numberOfDays);
  };
  
  // Handle adding new expense
  const handleAddExpense = () => {
    if (newExpense.title && newExpense.amount) {
      const newExpenseItem = { 
        ...newExpense, 
        id: Date.now(),
        amount: parseInt(newExpense.amount) 
      };
      console.log("Adding expense:", newExpenseItem);
      setAdditionalExpenses([...additionalExpenses, newExpenseItem]);
      setNewExpense({ title: '', amount: '' });
    }
  };
  
  // Handle removing expense
  const handleRemoveExpense = (id) => {
    console.log("Removing expense with id:", id);
    setAdditionalExpenses(additionalExpenses.filter(expense => expense.id !== id));
  };
  
  // Handle input change for new expense
  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  
  // Get state name from ID
  const getStateName = (stateId) => {
    const stateMap = {
      'uttarPradesh': 'Uttar Pradesh',
      'kerala': 'Kerala',
      'gujarat': 'Gujarat',
      'himachalPradesh': 'Himachal Pradesh',
      'odisha': 'Odisha',
      'jammuKashmir': 'Jammu & Kashmir'
    };
    
    return stateMap[stateId] || stateId;
  };
  
  return (
    <>
      <Header />
      <div className="budget-results-container">
        <div className="results-header">
          <h1>Your Travel Budget</h1>
          <div className="budget-amount">
            ₹{calculateTotal().toLocaleString()}
          </div>
          <div className="budget-breakdown">
            <div className="breakdown-item">
              <span>Per Person:</span>
              <strong>₹{calculatePerPersonCost().toLocaleString()}</strong>
            </div>
            <div className="breakdown-item">
              <span>Per Day:</span>
              <strong>₹{calculatePerDayCost().toLocaleString()}</strong>
            </div>
          </div>
        </div>
        
        <div className="trip-details">
          <h2>Trip Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div className="detail-content">
                <span className="detail-label">Destination</span>
                <span className="detail-value">{budgetData.destination}</span>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><i className="fas fa-calendar"></i></div>
              <div className="detail-content">
                <span className="detail-label">Start Date</span>
                <span className="detail-value">{formatDate(budgetData.startDate)}</span>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><i className="fas fa-calendar-check"></i></div>
              <div className="detail-content">
                <span className="detail-label">End Date</span>
                <span className="detail-value">{formatDate(budgetData.endDate)}</span>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><i className="fas fa-users"></i></div>
              <div className="detail-content">
                <span className="detail-label">Travelers</span>
                <span className="detail-value">{budgetData.travelers}</span>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon"><i className="fas fa-hourglass-half"></i></div>
              <div className="detail-content">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="budget-categories-results">
          <h2>Budget Categories</h2>
          <div className="category-cards">
            {[
              {key: 'accommodation', label: 'Accommodation', icon: 'fa-hotel'},
              {key: 'food', label: 'Food & Dining', icon: 'fa-utensils'},
              {key: 'transportation', label: 'Transportation', icon: 'fa-route'},
              {key: 'activities', label: 'Activities', icon: 'fa-ticket-alt'}
            ].map(category => {
              const amount = budgetData[category.key];
              if (!amount) return null;
              
              return (
                <div className="category-card" key={category.key}>
                  <div className="category-icon">
                    <i className={`fas ${category.icon}`}></i>
                  </div>
                  <div className="category-details">
                    <h3>{category.label}</h3>
                    <div className="category-amount">₹{parseInt(amount).toLocaleString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="additional-expenses">
          <h2>Additional Expenses</h2>
          
          {additionalExpenses.length > 0 ? (
            <div className="expense-list">
              {additionalExpenses.map(expense => (
                <div className="expense-item" key={expense.id}>
                  <div className="expense-info">
                    <div className="expense-title">{expense.title}</div>
                    <div className="expense-amount">₹{parseInt(expense.amount).toLocaleString()}</div>
                  </div>
                  <button 
                    className="remove-expense" 
                    onClick={() => handleRemoveExpense(expense.id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-expenses">
              <p>No additional expenses added yet. Add some below!</p>
            </div>
          )}
          
          <div className="add-expense">
            <input 
              type="text" 
              name="title"
              placeholder="Expense name" 
              value={newExpense.title}
              onChange={handleExpenseChange}
            />
            <input 
              type="number" 
              name="amount"
              placeholder="Amount (₹)" 
              value={newExpense.amount}
              onChange={handleExpenseChange}
            />
            <button onClick={handleAddExpense}>Add</button>
          </div>
        </div>
        
        <div className="budget-actions">
          <button 
            className="action-button secondary" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
          <button 
            className="action-button primary" 
            onClick={() => {
              // Save budget logic would go here
              alert('Budget saved successfully!');
            }}
          >
            Save Budget
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BudgetResults; 