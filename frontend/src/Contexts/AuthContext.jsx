
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired.');
          localStorage.removeItem('token');
          setUser(null);
        } else {

          setUser({
            id: decoded.id,
            username: decoded.username, 
            email: decoded.email,       
            role: decoded.role,
            isActive: true, 
            token: token 
          });
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false); 
  }, []);

  

  const login = (loginResponseData) => {
    if (loginResponseData && loginResponseData.user && loginResponseData.user.token) {
        localStorage.setItem('token', loginResponseData.user.token);
        setUser(loginResponseData.user);
    } else {
        console.error("Login data missing user or token:", loginResponseData);
        localStorage.removeItem('token');
        setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); 
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
