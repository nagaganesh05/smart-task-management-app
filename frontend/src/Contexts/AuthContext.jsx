// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check for token expiry
        // Token exp is in seconds, Date.now() is in milliseconds
        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired.');
          localStorage.removeItem('token');
          setUser(null);
        } else {
          // Set user from decoded token.
          // Adjust properties based on what your JWT payload contains
          setUser({
            id: decoded.id,
            username: decoded.username, // Assuming username is in token
            email: decoded.email,       // Assuming email is in token
            role: decoded.role,
            isActive: true, // Assuming active if token exists and valid
            token: token // Store the actual token here as well
          });
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false); // Set loading to false once initial token check is done
  }, []); // Empty dependency array means this runs once on mount

  // This function is called from the component after successful login/registration
  // The 'loginResponseData' object contains { message, user: { id, username, email, role, isActive, token } }
  const login = (loginResponseData) => {
    if (loginResponseData && loginResponseData.user && loginResponseData.user.token) {
        // Correctly save the token from the nested user object
        localStorage.setItem('token', loginResponseData.user.token);
        // Set the user state with the user details received from the backend
        setUser(loginResponseData.user);
    } else {
        console.error("Login data missing user or token:", loginResponseData);
        // In case of an unexpected response structure, ensure no bad token is stored
        localStorage.removeItem('token');
        setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setUser(null); // Clear user state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
