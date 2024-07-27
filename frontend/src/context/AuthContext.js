import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUsername = localStorage.getItem('username');
    if (token) {
      setAuthToken(token);
    }
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const login = (token, username) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
    setAuthToken(token);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setAuthToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };