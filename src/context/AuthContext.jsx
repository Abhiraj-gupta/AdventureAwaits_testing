import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Sign up function
  const signup = (email, password, name) => {
    // In a real app, you would call an API here
    const newUser = { email, name, id: Date.now() };
    localStorage.setItem('user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    return Promise.resolve(newUser);
  };

  // Sign in function
  const login = (email, password) => {
    // For demo purposes, we'll simulate authentication with local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (user && user.password === password) {
      // In a real app, never store passwords in localStorage
      const userData = { email: user.email, name: user.name, id: user.id };
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
      return Promise.resolve(userData);
    }
    
    // For demo purposes, let's allow any login
    if (!user) {
      const newUser = { email, name: email.split('@')[0], id: Date.now() };
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({ ...newUser, password });
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('user', JSON.stringify(newUser));
      setCurrentUser(newUser);
      return Promise.resolve(newUser);
    }
    
    return Promise.reject(new Error('Invalid credentials'));
  };

  // Sign out function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    return Promise.resolve();
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
