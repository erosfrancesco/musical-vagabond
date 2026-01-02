import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import useAssociazioni, { AssociazioneParsed } from '../hooks/useAssociazioni';
import useAssociazioneRendiconto, { AssociazioneRendicontoParsed, AvailableRendicontoPaymentsTypes, AvailableRendicontoTypes } from '../hooks/useRendiconto';
import Table, { Column } from '../components/Table';
import * as XLSX from 'xlsx';
import Button from '../components/Button';
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

function downloadExcel(associazione: AssociazioneParsed, data: AssociazioneRendicontoParsed[]) {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Crea una riga per ogni rendiconto, posizionando l'importo nella colonna del relativo metodo di pagamento
  const paymentTypes = AvailableRendicontoPaymentsTypes.map(pt => pt.value);
  const paymentHeaderFor = (paymentValue: string) => {
    if (paymentValue === 'ASSEGNO') return 'BANCA/ASSEGNI';
    if (paymentValue === 'CARTA') return 'CARTA';
    if (paymentValue === 'CONTANTE') return 'CONTANTE';
    return String(paymentValue).toUpperCase();
  };

  const paymentHeaders = paymentTypes.map(p => paymentHeaderFor(p));

  // ordina i record per data (discendente)
  const sortedRecords = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const aoa: any[][] = [];
  aoa.push([`Associazione: ${associazione.name}`]);
  aoa.push([]);
  aoa.push(['Data', ...paymentHeaders, 'Tipo', 'ID']);

  sortedRecords.forEach(r => {
    const date = r.created_at
      ? (r.created_at instanceof Date ? r.created_at.toLocaleDateString() : new Date(r.created_at).toLocaleDateString())
      : '';
    const header = paymentHeaderFor(r.payment_type as string);
    const paymentCells = paymentHeaders.map(h => (h === header ? (typeof r.value === 'number' ? r.value : Number(r.value) || 0) : ''));
    const tipo = AvailableRendicontoTypes.find(t => t.value === r.type)?.label || r.type || '';
    aoa.push([date, ...paymentCells, tipo, r.id]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rendiconto');

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `rendiconto_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


function parseExportRendicontoData(data: AssociazioneRendicontoParsed[]) {
  return data.map((r) => {
    const date = r.created_at
      ? (r.created_at instanceof Date ? r.created_at.toLocaleDateString() : new Date(r.created_at).toLocaleDateString())
      : '';
    const importo = typeof r.value === 'number' ? r.value : r.value;
    const tipo = AvailableRendicontoTypes.find(t => t.value === r.type)?.label || r.type || '';
    const metodo = AvailableRendicontoPaymentsTypes.find(pt => pt.value === r.payment_type)?.label || r.payment_type || '';

    return {
      Data: date,
      Importo: importo,
      Tipo: tipo,
      Metodo: metodo,
    };
  });
}

function parseExportAssociazioneData(data: AssociazioneParsed) {
  return {
    Nome: data.name,
    Descrizione: data.description,
    'Codice Fiscale': data.codice_fiscale,
    'N. Codice': data.n_codice,
  };
}