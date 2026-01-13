import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * AuthGuard: Handles token persistence and redirects unauthenticated users
 */
export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Allow auth pages to always be accessible
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    
    if (isAuthPage) {
      setIsInitialized(true);
      return;
    }

    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      // No token — redirect to login
      navigate('/login', { replace: true });
    }
    
    setIsInitialized(true);
  }, [location.pathname, navigate]);

  // Don't render protected content until auth check is complete
  if (!isInitialized) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return <>{children}</>;
}
