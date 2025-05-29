// src/api.js
import axios from 'axios';

const apiDjango = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  // tu peux ajouter ici les interceptors, headers, etc.
});

export default apiDjango;