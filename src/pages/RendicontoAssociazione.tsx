import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAssociazioni from '../hooks/useAssociazioni';
import { downloadExcel } from '../hooks/useExportPdf';
import useAssociazioneRendiconto, { AvailableRendicontoPaymentsTypes, AvailableRendicontoTypes } from '../hooks/useRendiconto';

import { Card, Table, Column, Button } from '../components/index';
import { EditRendicontoModal, NewRendicontoModal } from './RendicontoAssociazioneModals';


export default function RendicontoAssociazione(): JSX.Element {
  const { associazioneCodiceFiscale: codice } = useParams();
  const { data } = useAssociazioneRendiconto(codice || '');
  const { data: associazioni } = useAssociazioni();
  const associazione = associazioni?.find(a => a.codice_fiscale === codice);

  // Modal
  const [isRendEditOpen, setIsRendEditOpen] = useState<boolean>(false);
  const [editingRend, setEditingRend] = useState<any | null>(null);

  if (!associazione || !data) {
    return <p>Associazione non trovata.</p>;
  }

  const columns: Column<any>[] = [
    { key: 'id', header: 'ID', render: (r) => r.id },
    { key: 'created_at', header: 'Data', render: (r) => (r.created_at ? r.created_at.toLocaleDateString() : '') },
    { key: 'value', header: 'Importo', render: (r) => `€${r.value.toFixed(2)}` },
    { key: 'type', header: 'Tipo', render: (r) => AvailableRendicontoTypes.find(t => t.value === r.type)?.label || '' },
    { key: 'payment_type', header: 'Metodo', render: (r) => AvailableRendicontoPaymentsTypes.find(pt => pt.value === r.payment_type)?.label || '' },
  ];

  return (
    <div className="min-h-screen bg-marble flex flex-col text-gray-900 p-4">
      <Card title={associazione.name} subtitle={associazione.description}>
        <p>{associazione.codice_fiscale}</p>
        <p>N. Codice: {associazione.n_codice}</p>
      </Card>

      <div className="flex justify-start mt-4 gap-4">
        <Button onClick={() => {
          setIsRendEditOpen(true);
        }}>
          + Nuovo Rendiconto
        </Button>

        <Button variant="secondary" onClick={() => downloadExcel(associazione, data || [])}>
          Esporta in Excel
        </Button>
      </div>


      <div className="mt-6 w-full">
        <h2 className="text-xl font-semibold mb-4">Rendiconti</h2>
        <Table
          columns={columns}
          data={data || []}
          actions={(row) => (
            <Button onClick={() => {
              setEditingRend(row);
              setIsRendEditOpen(true);
            }}>
              Edit
            </Button>
          )}
        />
      </div>

      <NewRendicontoModal isOpen={isRendEditOpen} setIsOpen={setIsRendEditOpen} codice_fiscale={codice!} />
      <EditRendicontoModal isOpen={isRendEditOpen} setIsOpen={setIsRendEditOpen} rendiconto={editingRend} />
    </div>
  );
}
