// src/components/DevisForm.js
import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Box
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const typeBienOptions = [
  { value: 'H',  label: 'Habitation' },
  { value: 'NH', label: 'Hors habitation' },
];
const typeGarantieOptions = [
  { value: 'TRC', label: 'TRC seule' },
  { value: 'DO',  label: 'DO seule' },
  { value: 'DUO', label: 'Duo' },
];
const destinationOptions = typeBienOptions;
const travauxOptions = [
  { value: 'NEUF', label: 'Neuf' },
  { value: 'RL',   label: 'Rénovation légère' },
  { value: 'RUR',  label: 'Rénovation lourde' },
];

export default function DevisForm({ open, onClose, onSuccess }) {
  const { api } = useContext(AuthContext);
  const [form, setForm] = useState({
    numero_opportunite: '',
    type_de_bien: 'H',
    type_de_garantie: 'TRC',
    destination_ouvrage: 'H',
    types_travaux: 'NEUF',
    cout_ouvrage: '',
    presence_existant: false,
    client_vip: false,
    souhaite_rcmo: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // On n'envoie PAS de champ user : le backend se charge de l'affecter
      await api.post('devis/', form);
      onSuccess();
      // réinitialiser le formulaire pour la prochaine ouverture
      setForm({
        numero_opportunite: '',
        type_de_bien: 'H',
        type_de_garantie: 'TRC',
        destination_ouvrage: 'H',
        types_travaux: 'NEUF',
        cout_ouvrage: '',
        presence_existant: false,
        client_vip: false,
        souhaite_rcmo: false,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Créer un nouveau devis</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'grid', gap: 2, mt: 1 }}
        >
          <TextField
            label="Opportunité"
            name="numero_opportunite"
            value={form.numero_opportunite}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Type de bien"
            name="type_de_bien"
            value={form.type_de_bien}
            onChange={handleChange}
          >
            {typeBienOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Garantie"
            name="type_de_garantie"
            value={form.type_de_garantie}
            onChange={handleChange}
          >
            {typeGarantieOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Destination"
            name="destination_ouvrage"
            value={form.destination_ouvrage}
            onChange={handleChange}
          >
            {destinationOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Travaux"
            name="types_travaux"
            value={form.types_travaux}
            onChange={handleChange}
          >
            {travauxOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Coût ouvrage"
            name="cout_ouvrage"
            type="number"
            inputProps={{ step: '0.01' }}
            value={form.cout_ouvrage}
            onChange={handleChange}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                name="presence_existant"
                checked={form.presence_existant}
                onChange={handleChange}
              />
            }
            label="Présence existant"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="client_vip"
                checked={form.client_vip}
                onChange={handleChange}
              />
            }
            label="Client VIP"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="souhaite_rcmo"
                checked={form.souhaite_rcmo}
                onChange={handleChange}
              />
            }
            label="Souhaite RCMO"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={submitting}>Annuler</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? 'Envoi...' : 'Valider'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}