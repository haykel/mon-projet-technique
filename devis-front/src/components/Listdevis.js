// src/components/Listdevis.js
import React, { useMemo, useState, useEffect, useContext } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import { AuthContext } from '../context/AuthContext';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GenerateDevisPDF from './GenerateDevisPDF';
import GenerateDevisDOCX from './GenerateDevisDOCX';
import EditDevisForm from './EditDevisForm';

export default function Listdevis({ devis, setDevis }) {
  const { api, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  // Charger la liste au montage si elle est vide
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (devis.length > 0) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data } = await api.get('devis/');
        setDevis(data.results || data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [api, token, setDevis, devis.length]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`devis/${id}/`);
      setDevis((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const onEditSuccess = (updated) => {
    setEditing(null);
    setDevis((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'numero_opportunite', header: 'Opportunité' },
      { accessorKey: 'tarif', header: 'Tarif' },
      { accessorKey: 'prime_totale', header: 'Prime' },
      {
        accessorKey: 'created_at',
        header: 'Date',
        Cell: ({ cell }) => cell.getValue().split('T')[0],
      },
      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <>
            <IconButton onClick={() => handleDelete(row.original.id)}>
              <DeleteForeverIcon color="error" />
            </IconButton>
            <IconButton onClick={() => setEditing(row.original)}>
              <EditIcon color="primary" />
            </IconButton>
          </>
        ),
      },
      {
        id: 'export',
        header: 'Export',
        Cell: ({ row }) => (
          <>
            <GenerateDevisPDF
              devis={row.original}
              filename={`devis_${row.original.numero_opportunite}.pdf`}
            />
            <GenerateDevisDOCX
              devis={row.original}
              filename={`devis_${row.original.numero_opportunite}.docx`}
            />
          </>
        ),
      },
    ],
    []
  );

  if (!token) return <p>Vous devez vous connecter.</p>;
  if (loading) return <p>Chargement des devis…</p>;
  if (error) return <p>Erreur : {error.response?.data?.detail || error.message}</p>;
  if (!devis.length) return <p>Aucun devis disponible.</p>;

  return (
    <>
      <MaterialReactTable columns={columns} data={devis} localization={MRT_Localization_FR} />

      {editing && (
        <EditDevisForm
          open={!!editing}
          onClose={() => setEditing(null)}
          onSuccess={onEditSuccess}
          initial={editing}
        />
      )}
    </>
  );
}