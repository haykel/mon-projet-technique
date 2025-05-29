import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SectionBlock from './components/SectionBlock';
import Button from '@mui/material/Button';
import bgImage from './Header-les-aidants.jpg';

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" replace />;
}

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

const titleStyle = {
  borderBottom: 'red 5px solid',
    width: 'fit-content',
    color: 'white',
    borderWidth: 'thick',
    position: 'relative',
    left:' 36%',
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="pt-16 pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/app"      element={
              <PrivateRoute>
                <SectionBlock />
              </PrivateRoute>
            } />
            {/* Toute autre route protégée redirige vers /app */}
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

// Écran d'accueil : choix connexion ou inscription
function Home() {
  return (
    <div style={myStylesSection} className="p-4">
      <div style={myStyles}>
      <h1 style={titleStyle}>Créer Votre devis en ligne</h1>
      <p style={{color:"white"}}> Accédez à votre espace client</p>
      <Button variant="contained" onClick={() => window.location.href = '/login'}>Connexion</Button>
      <Button variant="contained" onClick={() => window.location.href = '/register'} style={{ marginLeft: 8 }}>
        Créer un compte
      </Button>
      </div>
    </div>
  );
}