import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const menuItems = [
  'VÉHICULES',
  'HABITATION',
  'SANTÉ & PRÉVOYANCE',
  'ÉPARGNE & RETRAITE',
  'VOYAGES & LOISIRS',
];

export default function Navbar() {
  const { token, user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{ bgcolor: '#ffffff', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', fontFamily: 'Source Sans Pro, sans-serif' }}>
        {/* Logo */}
        <Box>
          <a href="#">
            <img
              src="https://www.axa.fr/content/dam/logo/logo-axa.svg"
              alt="AXA Logo"
              width={100}
              height={50}
            />
          </a>
        </Box>

        {/* Menu principal */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {menuItems.map((item) => (
            <Button
              key={item}
              color="inherit"
              sx={{
                color: '#00008f',
                fontWeight: 'bold',
                textTransform: 'none',
                fontFamily: 'Source Sans Pro, sans-serif',
                borderBottom: '3px solid transparent',
                paddingBottom: '8px',
                transition: 'border-color 0.2s ease-in-out',
                '&:hover': {
                  borderBottomColor: 'red',
                },
              }}
            >
              {item}
            </Button>
          ))}
        </Box>

        {/* Actions utilitaires */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
              borderColor: '#c91432',
              bgcolor: '#fff',
              color: '#c91432',
              fontFamily: 'Source Sans Pro, sans-serif',
              borderRadius: '20px',
            }}
          >
            SINISTRE & ASSISTANCE
          </Button>

          {/* Bouton Espace Client / Nom d'utilisateur */}
          {token ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: '#00008f',
                color: '#ffffff',
                fontWeight: 'bold',
                borderRadius: '20px',
                textTransform: 'none',
                fontFamily: 'Source Sans Pro, sans-serif',
              }}
              onClick={() => window.location.href = '/app'}
            >
              {user?.username || 'Espace Client'}
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                bgcolor: '#00008f',
                color: '#ffffff',
                fontWeight: 'bold',
                borderRadius: '20px',
                textTransform: 'none',
                fontFamily: 'Source Sans Pro, sans-serif',
              }}
              onClick={() => window.location.href = '/login'}
            >
              Espace Client
            </Button>
          )}

          {token && (
            <Button
              color="error"
              sx={{
                fontWeight: 'bold',
                textTransform: 'none',
                fontFamily: 'Source Sans Pro, sans-serif',
              }}
              onClick={logout}
            >
              Déconnexion
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}