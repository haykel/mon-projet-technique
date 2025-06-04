// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import apiDjango from '../apiDjango';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Récupération du token stocké (s’il existe)
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser]   = useState(null);

  // **On ajoute l’interceptor** sur apiDjango (une seule fois)
  // pour injecter l’en-tête Authorization dès que `token` existe.
  useEffect(() => {
    const requestInterceptor = apiDjango.interceptors.request.use(config => {
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      } else {
        // Si pas de token, on s’assure de ne pas envoyer d’ancien header
        delete config.headers.Authorization;
      }
      return config;
    });
    return () => {
      // Au démontage, retirer l’interceptor pour éviter doublons
      apiDjango.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  // Optionnel : récupérer les infos user (ici juste un exemple statique)
  useEffect(() => {
    if (token) {
      // Exemple simple : on stocke un user « factice »
      setUser({ username: 'Utilisateur' });
      // Ou, si vous avez un endpoint profil : 
      // apiDjango.get('auth/profile/').then(res => setUser(res.data));
    }
  }, [token]);

  // 1) LOGIN : **utiliser apiDjango** (qui ne porte pas encore de header Authorization)
  //    Car, dans ce cas, token = null → l’interceptor ne met pas d Authorization.
  const login = async (username, password) => {
    // On appelle /auth/login/ SANS header Authorization (token actuel est null ou invalide)
    const response = await apiDjango.post('auth/login/', { username, password });
    // Si OK, on récupère le token renvoyé
    const newToken = response.data.token;
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    return response.data;
  };

  // 2) REGISTER : équivalent, pas de header Authorization envoyé
  const register = (username, email, password) => {
    return apiDjango.post('auth/register/', { username, email, password });
  };

  // 3) LOGOUT : envoi du token pour invalider côté serveur (si implémenté),
  //    puis suppression du token localement.
  const logout = async () => {
    try {
      await apiDjango.post('auth/logout/');
    } catch {
      // Silencieux si l’API ne valide pas ce call
    }
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, api: apiDjango }}>
      {children}
    </AuthContext.Provider>
  );
}
