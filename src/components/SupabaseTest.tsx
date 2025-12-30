import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Button from "./Button";
import Card from "./Card";

type Associazioni = {
  codice_fiscale: string;
  name: string;
  description: string;
  n_codice: number;
  created_at: string;
  updated_at: string;
}

type AssociazioniParsed = Pick<Associazioni, "codice_fiscale" | "name" | "description" | "n_codice"> & {
  created_at: Date;
  updated_at: Date;
};

export function SupabaseTest() {
  const [associazioni, setAssociazioni] = useState<AssociazioniParsed[]>([]);

  useEffect(() => {
    getAssociazioni();
  }, []);

  async function getAssociazioni() {
    const { data } = await supabase.from("associazioni").select();

    const parsedData = (data as Associazioni[]).map(item => ({
      ...item,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at)
    }));

    setAssociazioni(parsedData);
  }

  return (
    <ul>
      {associazioni.map((associazione, i) => (
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
  );
}

export default SupabaseTest;