import { AssociazioneParsed } from "./useAssociazioni";
import { AssociazioneRendicontoParsed, AvailableRendicontoPaymentsTypes, AvailableRendicontoTypes } from "./useRendiconto";
import * as XLSX from 'xlsx';

// Not properly a hook, but who cares...

export function downloadExcel(associazione: AssociazioneParsed, data: AssociazioneRendicontoParsed[]) {
  if (!data) {
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


/** Parsea i dati del rendiconto per l'esportazione in CSV o Excel */
/*
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
/** */