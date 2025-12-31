import useAssociazioni from '../hooks/useAssociazioni';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Input from '../components/Input';

export default function Associazioni(): JSX.Element {
  const { data, isLoading } = useAssociazioni();
  const navigate = useNavigate();

  // Filtri
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || data.length === 0) {
    return <></>;
  }


  // TODO: - Form to create new association page

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
          // TODO: - Open modal
        }}>
          + Nuova Associazione
        </Button>
      </div>

      <ul>
        {filteredAssociazioni.map((associazione, i) => (
          <li key={i}>
            <Card title={associazione.name}
              subtitle={associazione.description}
              actions={
                <Button onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log('Clicked on edit');
                }}>
                  Edit
                </Button>
              }
              onClick={() => {
                navigate(`/${associazione.codice_fiscale}`);
                console.log(`Clicked on associazione: ${associazione.codice_fiscale}`);
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
