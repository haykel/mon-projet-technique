// src/components/EditDevisForm.js
import React, { useState, useContext, useEffect } from 'react';
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

// Définition des options pour chaque select
const typeBienOptions = [
  { value: 'H', label: 'Habitation' },
  { value: 'NH', label: 'Hors habitation' },
];
const typeGarantieOptions = [
  { value: 'TRC', label: 'TRC seule' },
  { value: 'DO',  label: 'DO seule' },
  { value: 'DUO', label: 'Duo' },
];
const destinationOptions = [
  { value: 'H',  label: 'Habitation' },
  { value: 'NH', label: 'Non habitation' },
];
const travauxOptions = [
  { value: 'NEUF', label: 'Neuf' },
  { value: 'RL',   label: 'Rénovation légère' },
  { value: 'RUR',  label: 'Rénovation lourde' },
];

export default function EditDevisForm({ open, onClose, onSuccess, initial }) {
  const { api } = useContext(AuthContext);
  const [form, setForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Pré-remplissage du formulaire dès que l'objet initial est fourni
  useEffect(() => {
    if (initial) {
      setForm({
        type_de_bien:        initial.type_de_bien,
        type_de_garantie:    initial.type_de_garantie,
        destination_ouvrage: initial.destination_ouvrage,
        types_travaux:       initial.types_travaux,
        cout_ouvrage:        initial.cout_ouvrage,
        presence_existant:   initial.presence_existant,
        client_vip:          initial.client_vip,
        souhaite_rcmo:       initial.souhaite_rcmo,
      });
    }
  }, [initial]);

  // N'affiche pas la modal tant que le form n'est pas prêt
  if (!form) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Envoi partiel (PATCH) sans toucher à user ni numero_opportunite
      const { data } = await api.patch(`devis/${initial.id}/`, form);
      onSuccess(data);
    } catch (err) {
      console.error('Erreur update:', err.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier le devis #{initial.numero_opportunite}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="edit-devis-form"
          onSubmit={handleSubmit}
          sx={{ display: 'grid', gap: 2, mt: 1 }}
        >
          {/* Numero d'opportunité non modifiable */}
          <TextField
            label="Opportunité"
            value={initial.numero_opportunite}
            disabled
            fullWidth
          />

          {/* Select Type de bien */}
          <TextField
            select
            label="Type de bien"
            name="type_de_bien"
            value={form.type_de_bien}
            onChange={handleChange}
            fullWidth
          >
            {typeBienOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Select Garantie */}
          <TextField
            select
            label="Garantie"
            name="type_de_garantie"
            value={form.type_de_garantie}
            onChange={handleChange}
            fullWidth
          >
            {typeGarantieOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Select Destination */}
          <TextField
            select
            label="Destination"
            name="destination_ouvrage"
            value={form.destination_ouvrage}
            onChange={handleChange}
            fullWidth
          >
            {destinationOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Select Travaux */}
          <TextField
            select
            label="Travaux"
            name="types_travaux"
            value={form.types_travaux}
            onChange={handleChange}
            fullWidth
          >
            {travauxOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Coût ouvrage */}
          <TextField
            label="Coût ouvrage"
            name="cout_ouvrage"
            type="number"
            inputProps={{ step: '0.01' }}
            value={form.cout_ouvrage}
            onChange={handleChange}
            required
            fullWidth
          />

          {/* Checkboxes */}
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
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Annuler
        </Button>
        <Button
          type="submit"
          form="edit-devis-form"
          variant="contained"
          disabled={submitting}
        >
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}