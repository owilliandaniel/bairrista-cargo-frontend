// src/auth/AuthCard.tsx - Authentication card wrapper with TypeScript
import React from 'react';
import './AuthForms.css';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  error?: string;
  children: React.ReactNode;
}

function AuthCard({ title, subtitle, error, children }: AuthCardProps) {
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
