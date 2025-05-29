// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import apiDjango from '../apiDjango';


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser]   = useState(null);

  // Instance Axios partagée
  const api = apiDjango.create({ baseURL: 'http://localhost:8000/api/' });
  api.interceptors.request.use(cfg => {
    if (token) cfg.headers.Authorization = `Token ${token}`;
    return cfg;
  });

  useEffect(() => {
    if (token) {
      // Optionnel : vérifie le token ou récupère le profil
      setUser({ username: 'Utilisateur' }); // ou appeler /profile/
    }
  }, [token]);

  const login = (username, password) =>
    api.post('auth/login/', { username, password })
       .then(res => {
         localStorage.setItem('authToken', res.data.token);
         setToken(res.data.token);
         return Promise.resolve();
       });

  const register = (username, email, password) =>
    api.post('auth/register/', { username, email, password });

  const logout = () => {
    api.post('auth/logout/').catch(() => {});
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}