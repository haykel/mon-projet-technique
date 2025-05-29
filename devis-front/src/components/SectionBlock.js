import React, { useState } from 'react';
import Listdevis from './Listdevis';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Stack from '@mui/material/Stack';
import DevisForm from './DevisForm';
import bgImage from '../Header-les-aidants.jpg';

const containerStyles = {
  width: "90%",
  margin: "auto",
  minHeight: "100vh",
  paddingTop: "24px",
};

const sectionStyles = {
  backgroundImage: `url(${bgImage})`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top",
};

export default function SectionBlock() {
  const [openForm, setOpenForm] = useState(false);

  const handleAddClick = () => setOpenForm(true);
  const handleClose    = () => setOpenForm(false);
  const handleSuccess  = () => {
    setOpenForm(false);
    // rafraîchir la liste de devis
    window.location.reload();
  };

  return (
    <section style={sectionStyles}>
      <div style={containerStyles}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            endIcon={<AddCircleOutlineIcon />}
            onClick={handleAddClick}
          >
            Générer un devis
          </Button>
        </Stack>

        {/* Liste des devis */}
        <Listdevis />

        {/* Formulaire en modal */}
        <DevisForm
          open={openForm}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </div>
    </section>
  );
}