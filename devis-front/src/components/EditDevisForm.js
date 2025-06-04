// src/components/EditDevisForm.js
import React, { useState, useEffect, useContext } from 'react';
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
  Box,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const typeBienOptions = [
  { value: 'H', label: 'Habitation' },
  { value: 'NH', label: 'Hors habitation' },
];
const typeGarantieOptions = [
  { value: 'TRC', label: 'TRC seule' },
  { value: 'DO', label: 'DO seule' },
  { value: 'DUO', label: 'Duo' },
];
const destinationOptions = [
  { value: 'H', label: 'Habitation' },
  { value: 'NH', label: 'Non habitation' },
];
const travauxOptions = [
  { value: 'NEUF', label: 'Neuf' },
  { value: 'RL', label: 'Rénovation légère' },
  { value: 'RUR', label: 'Rénovation lourde' },
];

export default function EditDevisForm({ open, onClose, onSuccess, initial }) {
  const { api } = useContext(AuthContext);
  const [form, setForm] = useState({
    id: '',
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.id,
        numero_opportunite: initial.numero_opportunite,
        type_de_bien: initial.type_de_bien,
        type_de_garantie: initial.type_de_garantie,
        destination_ouvrage: initial.destination_ouvrage,
        types_travaux: initial.types_travaux,
        cout_ouvrage: initial.cout_ouvrage,
        presence_existant: initial.presence_existant,
        client_vip: initial.client_vip,
        souhaite_rcmo: initial.souhaite_rcmo,
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // On envoie l'objet COMPLÈT (y compris numero_opportunite)
      const payload = {
        numero_opportunite: form.numero_opportunite,
        type_de_bien: form.type_de_bien,
        type_de_garantie: form.type_de_garantie,
        destination_ouvrage: form.destination_ouvrage,
        types_travaux: form.types_travaux,
        cout_ouvrage: form.cout_ouvrage,
        presence_existant: form.presence_existant,
        client_vip: form.client_vip,
        souhaite_rcmo: form.souhaite_rcmo,
      };
      const { data: updatedDevis } = await api.put(
        `devis/${form.id}/`,
        payload
      );
      onSuccess(updatedDevis);
      onClose();
    } catch (err) {
      console.error('Erreur modification du devis :', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  if (!initial) return null;

  return (
    <Dialog open={open} onClose={() => (loading ? null : onClose())} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier le devis</DialogTitle>
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
            disabled
          />
          <TextField
            select
            label="Type de bien"
            name="type_de_bien"
            value={form.type_de_bien}
            onChange={handleChange}
          >
            {typeBienOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Garantie"
            name="type_de_garantie"
            value={form.type_de_garantie}
            onChange={handleChange}
          >
            {typeGarantieOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Destination"
            name="destination_ouvrage"
            value={form.destination_ouvrage}
            onChange={handleChange}
          >
            {destinationOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Travaux"
            name="types_travaux"
            value={form.types_travaux}
            onChange={handleChange}
          >
            {travauxOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Coût ouvrage"
            name="cout_ouvrage"
            type="number"
            inputProps={{ step: '0.01' }}
            value={form.cout_ouvrage}
            onChange={handleChange}
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
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Enregistrement…' : 'Modifier'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}