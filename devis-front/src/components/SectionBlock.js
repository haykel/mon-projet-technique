// src/components/SectionBlock.js
import React, { useState } from 'react';
import Listdevis from './Listdevis';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Stack from '@mui/material/Stack';
import DevisForm from './DevisForm';
import bgImage from '../Header-les-aidants.jpg';

const myStylesSection = {
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top',
  paddingTop: '100px',
};

const myStyles = {
  width: '90%',
  position: 'relative',
  margin: 'auto',
  padding: '0',
  minHeight: '100vh',
};

export default function SectionBlock() {
  const [openForm, setOpenForm] = useState(false);
  const [devisList, setDevisList] = useState([]);

  const handleAddClick = () => setOpenForm(true);
  const handleClose = () => setOpenForm(false);

  // onSuccess reçoit l'objet créé depuis l'API
  const handleSuccess = (nouveauDevis) => {
    setDevisList((prev) => [nouveauDevis, ...prev]);
    setOpenForm(false);
  };

  return (
    <section style={myStylesSection} className="p-4">
      <div style={myStyles}>
        <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
          <Button
            variant="contained"
            endIcon={<AddCircleOutlineIcon />}
            onClick={handleAddClick}
          >
            Générer un devis
          </Button>
        </Stack>
        <Listdevis devis={devisList} setDevis={setDevisList} />
        <DevisForm open={openForm} onClose={handleClose} onSuccess={handleSuccess} />
      </div>
    </section>
  );
}