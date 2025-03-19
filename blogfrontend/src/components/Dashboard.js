import React from 'react';
import { useNavigate } from 'react-router-dom';
import  Navbar  from './pages/Navbar';
import Home from './pages/Home';

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout function triggered');
    
    const token = localStorage.getItem('token'); // Get the token from local storage

    if (token) {
      // Notify the backend about logout
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log('Logged out successfully');
          } else {
            console.error('Error during logout');
          }
        })
        .catch((error) => {
          console.error('Network error:', error);
        });
    }

    // Clear local storage and navigate to login
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated')
    navigate('/');
  };

  return (
    <div className="d-flex">
     
      <Home />
    </div>
  );
};

export default Dashboard;
