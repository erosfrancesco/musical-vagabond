import Button from "./Button";
import Card from "./Card";
import useAssociazioni from "../hooks/useAssociazioni";

export function SupabaseTest() {
  const { data, isLoading } = useAssociazioni();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mt-4">Associazioni</h2>
      <ul>
        {data.map((associazione, i) => (
          <li key={i}>
            <Card title={associazione.name} subtitle={associazione.description} actions={
              <Button>Edit</Button>
            }>
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

export default SupabaseTest;