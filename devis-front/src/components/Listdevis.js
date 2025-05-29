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

export default function Listdevis() {
  const { api } = useContext(AuthContext);
  const [devis, setDevis]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [editing, setEditing]     = useState(null);

  // fetch
  useEffect(() => {
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
  }, [api]);

  const refreshList = async () => {
    const { data } = await api.get('devis/');
    setDevis(data.results||data);
  };

  const handleDelete = async id => {
    await api.delete(`devis/${id}/`);
    setDevis(d => d.filter(x => x.id !== id));
  };

  // succès édition
  const onEditSuccess = updated => {
    setEditing(null);
    setDevis(d => d.map(x => x.id===updated.id? updated: x));
  };

  const columns = useMemo(() => [
    { accessorKey: 'numero_opportunite', header: 'Opportunité' },
    { accessorKey: 'tarif', header: 'Tarif' },
    { accessorKey: 'prime_totale', header: 'Prime' },
    {
      accessorKey: 'created_at', header: 'Date',
      Cell: ({ cell }) => cell.getValue().split('T')[0],
    },
    {
      id: 'actions', header: 'Actions',
      Cell: ({ row }) => (
        <>
          <IconButton onClick={() => handleDelete(row.original.id)}><DeleteForeverIcon color="error"/></IconButton>
          <IconButton onClick={() => setEditing(row.original)}><EditIcon color="primary"/></IconButton>
        </>
      ),
    },
    {
      id: 'export', header: 'Export',
      Cell: ({ row }) => (
        <>
          <GenerateDevisPDF devis={row.original} filename={`devis_${row.original.numero_opportunite}.pdf`} />
          <GenerateDevisDOCX devis={row.original} filename={`devis_${row.original.numero_opportunite}.docx`} />
        </>
      ),
    },
  ], [devis]);

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p>Erreur : {error.message}</p>;
  if (!devis.length) return <p>Aucun devis</p>;

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={devis}
        localization={MRT_Localization_FR}
      />

      {/* Popup création */}
      

      {/* Popup édition */}
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