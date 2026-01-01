import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export type Associazione = {
    codice_fiscale: string;
    name?: string;
    description?: string;
    n_codice?: number;
    created_at?: string | null;
    updated_at?: string | null;
};

export type AssociazioneParsed = Pick<Associazione, "codice_fiscale" | "name" | "description" | "n_codice"> & {
    created_at: Date;
    updated_at: Date;
};


export default function useAssociazioni(): UseQueryResult<AssociazioneParsed[], Error> {
    return useQuery<AssociazioneParsed[], Error>({
        queryKey: ['associazioni'],
        queryFn: async () => {
            const { data, error } = await supabase.from('associazioni').select('*');

            if (error) throw error;

            const parsed = (data as Associazione[]).map(item => ({
                ...item,
                created_at: item.created_at ? new Date(item.created_at) : new Date(),
                updated_at: item.updated_at ? new Date(item.updated_at) : new Date()
            })) as AssociazioneParsed[];

            return parsed;
        }
    });
}


export function useNewAssociazione() {
    const queryClient = useQueryClient();

    const createAssociazione = async (associazione: Omit<Associazione, 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase.from('associazioni').insert([associazione]);

        if (error) {
            throw error;
        }

        return data;
    };

    return useMutation({
        mutationFn: createAssociazione,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['associazioni'] })
        },
    });
}

export function useUpdateAssociazione() {
    const queryClient = useQueryClient();

    const updateAssociazione = async (payload: { codice_fiscale: Associazione["codice_fiscale"] } & Partial<Associazione>) => {
        const { codice_fiscale, ...patch } = payload;
        const { data, error } = await supabase.from('associazioni').update(patch).eq('codice_fiscale', codice_fiscale);

        if (error) throw error;
        return data;
    };

    return useMutation({
        mutationFn: updateAssociazione,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['associazioni'] });
        }
    });
}