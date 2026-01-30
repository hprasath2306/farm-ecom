import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🌾 Farm E-Commerce Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.firstName} {user?.lastName}! 👋</h2>
          <p>Email: {user?.email}</p>
          <p className="success-message">You have successfully logged in!</p>
        </div>

        <div className="dashboard-info">
          <p>This is your dashboard. More features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
