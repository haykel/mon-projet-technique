import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import bgImage from '../Header-les-aidants.jpg';

const myStylesSection = {
    
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition:'top',
    paddingTop: '100px',
    textAlign: 'center', 
    marginTop: 80
  };
  
  const myStyles = {
    width: "90%",
    position: "relative",
    margin: "auto",
    padding: "0",
    minHeight: "100vh",
  };

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(creds.username, creds.password);
      navigate('/app');
    } catch {
      setError('Identifiants invalides');
    }
  };

  return (
    <div style={myStylesSection} className="p-4">
      <div style={myStyles}>
    <Box maxWidth={360} mx="auto" mt={8} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h5" gutterBottom>Connexion</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          color="secondary" 
          margin="normal"
          value={creds.username}
          onChange={e => setCreds(c => ({ ...c, username: e.target.value }))}
        />
        <TextField
          label="Mot de passe"
          type="password"
          color="secondary" 
          fullWidth
          margin="normal"
          value={creds.password}
          onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>
          Se connecter
        </Button>
      </form>
      <Typography mt={2}>
        Pas encore de compte ? <Link to="/register">Inscription</Link>
      </Typography>
    </Box>
    </div></div>
  );
}