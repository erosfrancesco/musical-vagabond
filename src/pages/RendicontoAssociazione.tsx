import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import useAssociazioni from '../hooks/useAssociazioni';

export default function RendicontoAssociazione(): JSX.Element {
  const params = useParams();
  const codice = params.associazioneCodiceFiscale;

  const { data } = useAssociazioni();
  const associazione = data?.find(a => a.codice_fiscale === codice);

  if (!associazione) {
    return <p>Associazione non trovata.</p>;
  }

  // TODO: - Supabase Hook to fetch association data
  // TODO: - Form to create new rendiconto
  // TODO: - Export

  return (
    <div className="min-h-screen bg-marble flex flex-col items-center justify-center text-gray-900 p-4">
      <Card title={associazione.name} subtitle={associazione.description}>
        <p>{associazione.codice_fiscale}</p>
        <p>N. Codice: {associazione.n_codice}</p>
      </Card>
    </div>
  );
}
