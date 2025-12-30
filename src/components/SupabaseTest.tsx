import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Associazioni = {
  codice_fiscale: string;
  name: string;
  description: string;
  n_codice: number;
  created_at: string;
  updated_at: string;
}

export function SupabaseTest() {
  const [associazioni, setAssociazioni] = useState<Associazioni[]>([]);

  useEffect(() => {
    getAssociazioni();
  }, []);

  async function getAssociazioni() {
    const { data } = await supabase.from("associazioni").select();
    const associazioniData = data as Associazioni[];
    setAssociazioni(associazioniData);
  }

  return (
    <ul>
      {associazioni.map((instrument) => (
        <li key={instrument.name}>{instrument.name}</li>
      ))}
    </ul>
  );
}

export default SupabaseTest;