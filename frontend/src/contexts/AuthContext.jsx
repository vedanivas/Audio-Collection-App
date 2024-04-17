import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const isLoggedIn = !!authToken;
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5050/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
  
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.admin ? "admin" : "user");
        setAuthToken(data.token);
        setUserRole(data.admin ? "admin" : "user");
      }
  
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, authToken, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
