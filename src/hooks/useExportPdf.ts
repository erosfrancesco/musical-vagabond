import { AssociazioneParsed } from "./useAssociazioni";
import { AssociazioneRendicontoParsed, AvailableRendicontoPaymentsTypes, AvailableRendicontoTypes } from "./useRendiconto";
import * as XLSX from 'xlsx';

// Not properly a hook, but who cares...

export function downloadExcel(associazione: AssociazioneParsed, data: AssociazioneRendicontoParsed[]) {
    if (!data) {
        console.warn('No data to export');
        return;
    }


    const paymentTypeColumns = parsePaymentType();

    const aoa: any[][] = [];
    aoa.push([`Associazione: ${associazione.name}`]);
    aoa.push([]);
    aoa.push(parseColumnNames(paymentTypeColumns));
    const rows = parseRows(data, paymentTypeColumns);
    aoa.push(...rows);
    aoa.push(parseFooter(rows, paymentTypeColumns));


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


// Sections

// Column Names
function parseColumnNames(paymentTypes: string[]): string[] {
    return ['Data', ...paymentTypes, 'Tipo'];
}

// Rows
function parseRows(data: AssociazioneRendicontoParsed[], paymentTypes: string[]): (string | number)[][] {
    // ordina i record per data (discendente)
    const sortedRecords = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const rows = sortedRecords.map(r => {
        const date = r.created_at
            ? (r.created_at instanceof Date ? r.created_at.toLocaleDateString() : new Date(r.created_at).toLocaleDateString())
            : '';

        const formattedValue = (typeof r.value === 'number' ? r.value : Number(r.value) || 0);
        const paymentTypeCol = getPaymentTypeColumn(r.payment_type as string);
        const paymentCells = paymentTypes.map(h => (h === paymentTypeCol ? formattedValue : ''));

        const tipo = AvailableRendicontoTypes.find(t => t.value === r.type)?.label || r.type || '';
        return [date, ...paymentCells, tipo];
    });

    return rows;
}

// Footer
function parseFooter(rows: (string | number)[][], paymentTypes: string[]): (string | number)[] {
    // Totali per metodo di pagamento con formule Excel
    const footer: (string | number)[] = ['Totale'];
    
    // I dati iniziano alla riga 4 (riga 1: intestazione associazione, riga 2: vuota, riga 3: intestazioni colonne)
    const dataStartRow = 4;
    const dataEndRow = dataStartRow + rows.length - 1;
    
    // Crea una formula per ogni colonna di pagamento
    for (let colIndex = 1; colIndex <= paymentTypes.length; colIndex++) {
        const colLetter = String.fromCharCode(64 + colIndex + 1); // A=65, B=66, etc.
        const formula = `=sum(${colLetter}${dataStartRow}:${colLetter}${dataEndRow})`;
        footer.push(formula);
    }
    
    footer.push(''); // Empty cell for Tipo column
    
    return footer;
}

// Utils

// Crea l'intestazione del file Excel con i metodi di pagamento come colonne
function parsePaymentType(): string[] {
    const paymentTypes = AvailableRendicontoPaymentsTypes.map(pt => pt.value);
    return paymentTypes.map((paymentValue) => getPaymentTypeColumn(paymentValue));
}

// Crea una riga per ogni rendiconto, posizionando l'importo nella colonna del relativo metodo di pagamento
function getPaymentTypeColumn(paymentValue: string) {
    if (paymentValue === 'ASSEGNO') return 'BANCA/ASSEGNI';
    if (paymentValue === 'CARTA') return 'CARTA';
    if (paymentValue === 'CONTANTE') return 'CONTANTE';

    return String(paymentValue).toUpperCase();
};