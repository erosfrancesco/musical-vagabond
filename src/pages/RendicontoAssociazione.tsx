import { useParams } from 'react-router-dom';

export default function RendicontoAssociazione(): JSX.Element {
  const params = useParams();
  const codice = params.associazioneCodiceFiscale;

  return (
    <div className="min-h-screen bg-marble flex flex-col items-center justify-center text-gray-900 p-4">
      <h1 className="text-2xl font-semibold">Associazione</h1>
      <p className="mt-4">Codice fiscale: {codice ?? '—'}</p>
      <p className="mt-2 text-sm text-gray-600">Pagina vuota (placeholder).</p>
    </div>
  );
}
