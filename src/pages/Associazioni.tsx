import useAssociazioni, { useNewAssociazione, useUpdateAssociazione } from '../hooks/useAssociazioni';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Table, { Column } from '../components/Table';
import { EditAssociazioneModal, NewAssociazioneModal } from './AssociazioniModals';

export default function Associazioni(): JSX.Element {
  const { data, isLoading } = useAssociazioni();
  const navigate = useNavigate();

  // Filtri
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<any | null>(null);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || data.length === 0) {
    return <></>;
  }

  const filteredAssociazioni = searchTerm !== '' ? data.filter((associazione) =>
    associazione.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    associazione.codice_fiscale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    associazione.n_codice?.toString().includes(searchTerm) ||
    associazione.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : data;

  const columns: Column<any>[] = [
    { key: 'name', header: 'Nome', render: (row) => row.name },
    { key: 'codice_fiscale', header: 'Codice Fiscale', render: (row) => row.codice_fiscale },
    { key: 'n_codice', header: 'N. Codice', render: (row) => row.n_codice },
    { key: 'created_at', header: 'Creata il', render: (row) => (row.created_at ? row.created_at.toLocaleDateString() : '') },
    { key: 'updated_at', header: 'Ultima modifica', render: (row) => (row.updated_at ? row.updated_at.toLocaleDateString() : '') },
    { key: 'description', header: 'Descrizione', render: (row) => row.description },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg text-primary font-bold mb-2">Associazioni</h2>

      <div className='my-4 flex'>
        <Input type="text" placeholder="Cerca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => {
          setIsModalOpen(true);
        }}>
          + Nuova Associazione
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredAssociazioni}
        onRowClick={(row) => navigate(`/${row.codice_fiscale}`)}
        actions={(row) => (
          <Button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setEditing(row); setIsEditOpen(true); }}>
            Edit
          </Button>
        )}
      />

      <NewAssociazioneModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <EditAssociazioneModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} associazione={editing} />
    </div>
  );
}
