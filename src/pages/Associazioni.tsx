import useAssociazioni, { useNewAssociazione, useUpdateAssociazione } from '../hooks/useAssociazioni';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Table, { Column } from '../components/Table';

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

      <NewAssociazioneModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

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

      <EditAssociazioneModal isOpen={isEditOpen} setIsOpen={setIsEditOpen} associazione={editing} />
    </div>
  );
}


function NewAssociazioneModal({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void }) {
  const { mutate: createNewAssociazione } = useNewAssociazione();

  const [newName, setNewName] = useState<string>('');
  const [newCodice, setNewCodice] = useState<string>('');
  const [newNcode, setNewNcode] = useState<number | undefined>(undefined);
  const [newDescription, setNewDescription] = useState<string>('');

  useEffect(() => {
    if (!isModalOpen) {
      setNewName('');
      setNewCodice('');
      setNewNcode(undefined);
      setNewDescription('');
    }
  }, [isModalOpen]);

  return <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuova Associazione">
    <form onSubmit={(e) => {
      e.preventDefault();
      const payload = {
        name: newName,
        codice_fiscale: newCodice,
        n_codice: newNcode,
        description: newDescription
      };
      createNewAssociazione(payload, {
        onSettled: () => {
          setIsModalOpen(false);
        }
      });
    }}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <Input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome associazione" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Codice Fiscale</label>
          <Input type="text" value={newCodice} onChange={(e) => setNewCodice(e.target.value)} placeholder="Codice fiscale" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">N. Codice</label>
          <Input type="number" placeholder="N. Codice"
            value={newNcode !== undefined ? newNcode : ''}
            onChange={(e) => setNewNcode(e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descrizione</label>
          <textarea className="w-full border rounded p-2" rows={4} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={() => setIsModalOpen(false)}>Annulla</Button>
          <Button type="submit">Crea</Button>
        </div>
      </div>
    </form>
  </Modal>
}


function EditAssociazioneModal({ isOpen, setIsOpen, associazione }: { isOpen: boolean; setIsOpen: (v: boolean) => void; associazione: any | null }) {
  const { mutate: updateAssociazione, isPending } = useUpdateAssociazione();

  const [name, setName] = useState<string>('');
  const [ncode, setNcode] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (associazione) {
      setName(associazione.name ?? '');
      setNcode(associazione.n_codice ?? undefined);
      setDescription(associazione.description ?? '');
    } else {
      setName('');
      setNcode(undefined);
      setDescription('');
    }
  }, [associazione]);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setNcode(undefined);
      setDescription('');
    }
  }, [isOpen]);

  if (!associazione) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Modifica: ${associazione.name}`}>
      <form onSubmit={(e) => {
        e.preventDefault();
        const payload = {
          name,
          n_codice: ncode,
          description
        };
        updateAssociazione({ codice_fiscale: associazione.codice_fiscale, ...payload }, {
          onSettled: () => setIsOpen(false)
        });
      }}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome associazione" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">N. Codice</label>
            <Input type="number" placeholder="N. Codice"
              value={ncode !== undefined ? ncode : ''}
              onChange={(e) => setNcode(e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descrizione</label>
            <textarea className="w-full border rounded p-2" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" onClick={() => setIsOpen(false)}>Annulla</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Salvando...' : 'Salva'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}