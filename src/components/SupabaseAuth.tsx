import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Button from "./Button";
import Card from "./Card";
import useSupabaseUser from "./useSupabaseUser";


export function SupabaseAuth() {
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    user, setUser, email, setEmail, password, setPassword,
    getSession, isLogged
  } = useSupabaseUser();

  useEffect(() => {
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);


  async function signIn() {
    setLoadingAuth(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else setMessage("Signed in");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoadingAuth(false);
    }
  }

  async function signOut() {
    setLoadingAuth(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setMessage(error.message);
      else setMessage("Signed out");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoadingAuth(false);
    }
  }

  function onPasswordEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      signIn();
    }
  }

  return (
    <Card title="Auth"
      actions={
        isLogged ?
          <Button onClick={signOut} disabled={loadingAuth}>Sign out</Button> :
          <Button onClick={signIn} disabled={loadingAuth}>Sign in</Button>
      }>
      {isLogged
        ? <p className="text-green-500">Signed in as: {user.email}</p>
        : <div className="space-y-2">
          <input className="border p-2 w-full" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)}
          />
          <input className="border p-2 w-full" placeholder="Password" type="password"
            value={password} onChange={e => setPassword(e.target.value)} onKeyUp={onPasswordEnter}
          />
        </div>
      }
      {message && <p>{message}</p>}
    </Card>
  );
}

export default SupabaseAuth;