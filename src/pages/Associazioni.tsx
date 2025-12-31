import useAssociazioni, { useNewAssociazione } from '../hooks/useAssociazioni';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Input from '../components/Input';
import Modal from '../components/Modal';

export default function Associazioni(): JSX.Element {
  const { data, isLoading } = useAssociazioni();
  const navigate = useNavigate();

  // Filtri
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

      <ul>
        {filteredAssociazioni.map((associazione, i) => (
          <li key={i}>
            <Card title={associazione.name}
              subtitle={associazione.description}
              actions={
                <Button onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  //  TODO: - Edit modal
                }}>
                  Edit
                </Button>
              }
              onClick={() => {
                navigate(`/${associazione.codice_fiscale}`);
              }}>
              <p>{associazione.codice_fiscale}</p>
              <p>N. Codice: {associazione.n_codice}</p>
              <p>Creata il: {associazione.created_at.toLocaleDateString()}</p>
              <p>Ultima modifica il: {associazione.updated_at.toLocaleDateString()}</p>
            </Card>
          </li>
        ))}
      </ul>
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