// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import apiDjango from '../apiDjango';
import usePersistedState from './usePersistedState';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1) Lire le token dans localStorage (ou null si inexistant)
  const [token, setToken] = usePersistedState('authToken', null);
  const [user, setUser]   = useState(null);

  // 2) Installer l’intercepteur Axios pour ajouter le header Authorization
  useEffect(() => {
    const id = apiDjango.interceptors.request.use(config => {
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      } else {
        delete config.headers.Authorization;
      }
      return config;
    });
    return () => apiDjango.interceptors.request.eject(id);
  }, [token]);

  // 3) Dès qu’on a un token, on stocke un état user minimal (sans appeler /profile/)
  useEffect(() => {
    if (token) {
      // Vous pouvez stocker ici d’autres informations si vous souhaitez
      setUser({ username: 'Utilisateur connecté' });
    } else {
      setUser(null);
    }
  }, [token]);

  // 4) Fonction de login : appelle /auth/login/, stocke le token via usePersistedState
  const login = async (username, password) => {
    const response = await apiDjango.post('auth/login/', { username, password });
    const newToken = response.data.token;
    setToken(newToken);
    return response.data;
  };

  // 5) Fonction d’enregistrement (inscription)
  const register = (username, email, password) => {
    return apiDjango.post('auth/register/', { username, email, password });
  };

  // 6) Fonction logout : appelle /auth/logout/ (optionnel), puis supprime token
  const logout = async () => {
    try {
      await apiDjango.post('auth/logout/');
    } catch {
      // ignorer si l’API ne propose pas de logout
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, api: apiDjango }}>
      {children}
    </AuthContext.Provider>
  );
}