import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";


export function useSupabaseUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<any>(null);

    // get initial auth session/user
    const getSession = async () => {
        try {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);
        } catch (err) {
            // ignore
        }
    };

    useEffect(() => {
        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);



    return {
        user, setUser, 
        email, setEmail, password, setPassword,
        getSession, isLogged: !!user,
        logout: async () => {
            await supabase.auth.signOut();
            setUser(null);
        }
    };
}

export default useSupabaseUser;