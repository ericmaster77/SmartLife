import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Corrected: Use named import { jwtDecode }

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);  // Corrected: Use jwtDecode() instead of jwt_decode()
      setCurrentUser(decoded.user);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};