// src/auth/AuthCard.jsx
import React from 'react';
import './AuthForms.css';

function AuthCard({ title, subtitle, error, children }) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        
        {error && <div className="error-message">{error}</div>}

        {children}
      </div>
    </div>
  );
}

export default AuthCard;
