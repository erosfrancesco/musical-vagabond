import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import useAssociazioni from '../hooks/useAssociazioni';
import useAssociazioneRendiconto from '../hooks/useRendiconto';
import Table, { Column } from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Select from '../components/Select';
import { useState } from 'react';
import { EditRendicontoModal, NewRendicontoModal } from './RendicontoAssociazioneModals';

export default function RendicontoAssociazione(): JSX.Element {
  const { associazioneCodiceFiscale: codice } = useParams();
  const { data } = useAssociazioneRendiconto(codice || '');
  const { data: associazioni } = useAssociazioni();
  const associazione = associazioni?.find(a => a.codice_fiscale === codice);

  // Modal
  const [isRendEditOpen, setIsRendEditOpen] = useState<boolean>(false);
  const [editingRend, setEditingRend] = useState<any | null>(null);

  if (!associazione) {
    return <p>Associazione non trovata.</p>;
  }

  // TODO: - Form to create edit rendiconto
  // TODO: - Export

  console.log(data);

  const columns: Column<any>[] = [
    { key: 'id', header: 'ID', render: (r) => r.id },
    { key: 'created_at', header: 'Data', render: (r) => (r.created_at ? r.created_at.toLocaleDateString() : '') },
    { key: 'value', header: 'Importo', render: (r) => `€${r.value.toFixed(2)}` },
    { key: 'type', header: 'Tipo', render: (r) => r.type },
    { key: 'payment_type', header: 'Metodo', render: (r) => r.payment_type },
  ];

  return (
    <div className="min-h-screen bg-marble flex flex-col items-center justify-center text-gray-900 p-4">
      <Card title={associazione.name} subtitle={associazione.description}>
        <p>{associazione.codice_fiscale}</p>
        <p>N. Codice: {associazione.n_codice}</p>
      </Card>

      <div className="mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Rendiconto</h2>
        <Button className="mb-4" onClick={() => {
          setIsRendEditOpen(true);
        }}>
          + Nuovo Rendiconto
        </Button>

        {data && data.length > 0 ? (
          <Table
            columns={columns}
            data={data}
            actions={(row) => (
              <Button onClick={() => {
                setEditingRend(row);
                setIsRendEditOpen(true);
              }}>
                Edit
              </Button>
            )}
          />
        ) : (
          <p>Nessun rendiconto disponibile.</p>
        )}
      </div>

      <NewRendicontoModal isOpen={isRendEditOpen} setIsOpen={setIsRendEditOpen} codice_fiscale={codice!} />
      <EditRendicontoModal isOpen={isRendEditOpen} setIsOpen={setIsRendEditOpen} rendiconto={editingRend} />
    </div>
  );
}

