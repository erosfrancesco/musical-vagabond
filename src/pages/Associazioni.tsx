import useAssociazioni from '../hooks/useAssociazioni';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function Associazioni(): JSX.Element {
  const { data, isLoading } = useAssociazioni();
  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || data.length === 0) {
    return <></>;
  }


  // TODO: - Form to create new association page
  // TODO: - Link to association details page

  return (
    <div className="p-4">
      <h2 className="text-lg text-primary font-bold mb-2">Associazioni</h2>
      <ul>
        {data.map((associazione, i) => (
          <li key={i}>
            <Card title={associazione.name}
              subtitle={associazione.description}
              actions={
                <Button onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log('Clicked on edit');
                }}>Edit</Button>
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
