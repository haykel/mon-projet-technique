// src/context/usePersistedState.js
import { useState, useEffect } from 'react';

/**
 * Hook personnalisé qui stocke un state dans localStorage.
 * @param {string} key       La clé sous laquelle sera stockée la valeur en localStorage.
 * @param {*} defaultValue   Valeur par défaut si rien n’existe encore dans localStorage.
 * @returns {[any, Function]} Le state et sa fonction setState habituelle.
 */
export default function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      if (state === null || state === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {
      // ignore
    }
  }, [key, state]);

  return [state, setState];
}