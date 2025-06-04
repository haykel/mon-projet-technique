// src/components/LoginPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // ← on importe useNavigate
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import bgImage from '../Header-les-aidants.jpg';

const myStylesSection = {
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top',
  paddingTop: '100px',
  textAlign: 'center',
  marginTop: 80,
};

const myStyles = {
  width: '90%',
  maxWidth: 400,
  margin: 'auto',
  padding: 0,
  minHeight: '100vh',
};

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ← on crée la navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(creds.username, creds.password);
      // Si on arrive ici, l'API a renvoyé un 200 + { token: "..." }.
      // On redirige vers /app
      navigate('/app');
    } catch (err) {
      console.error('Login – erreur :', err.response || err);
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('La connexion a échoué.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={myStylesSection}>
      <div style={myStyles}>
        <Box
          maxWidth={360}
          mx="auto"
          mt={8}
          sx={{
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Connexion
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Nom d’utilisateur"
              fullWidth
              margin="normal"
              value={creds.username}
              onChange={(e) => {
                setCreds((c) => ({ ...c, username: e.target.value }));
                setError('');
              }}
            />
            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              margin="normal"
              value={creds.password}
              onChange={(e) => {
                setCreds((c) => ({ ...c, password: e.target.value }));
                setError('');
              }}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading || !creds.username || !creds.password}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
}