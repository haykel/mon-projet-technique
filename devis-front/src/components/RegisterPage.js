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

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const [data, setData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(data.username, data.email, data.password);
      navigate('/login');
    } catch {
      setError('Erreur lors de l’inscription');
    }
  };

  return (
    <div style={myStylesSection} className="p-4">
      <div style={myStyles}>
    <Box maxWidth={360} mx="auto" mt={8} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h5" gutterBottom>Inscription</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={data.username}
          onChange={e => setData(d => ({ ...d, username: e.target.value }))}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={data.email}
          onChange={e => setData(d => ({ ...d, email: e.target.value }))}
        />
        <TextField
          label="Mot de passe"
          type="password"
          fullWidth
          margin="normal"
          value={data.password}
          onChange={e => setData(d => ({ ...d, password: e.target.value }))}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>
          S’inscrire
        </Button>
      </form>
      <Typography mt={2}>
        Déjà un compte ? <Link to="/login">Connexion</Link>
      </Typography>
    </Box>
    </div></div>
  );
}