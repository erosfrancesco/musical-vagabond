import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export type AssociazioneRendiconto = {
    id: number;
    codice_fiscale: string;
    type: string;
    payment_type: string;
    value: number;

    created_at?: string | null;
    updated_at?: string | null;
};

export type AssociazioneRendicontoParsed = Pick<AssociazioneRendiconto, "id" | "codice_fiscale" | "type" | "payment_type" | "value"> & {
    created_at: Date;
    updated_at: Date;
};


/** */
export default function useAssociazioneRendiconto(codice_fiscale: string): UseQueryResult<AssociazioneRendicontoParsed[], Error> {
    return useQuery<AssociazioneRendicontoParsed[], Error>({
        queryKey: ['associazione_resoconti', codice_fiscale],
        queryFn: async () => {
            const { data, error } = await supabase.from('associazione_resoconti').select('*').eq('codice_fiscale', codice_fiscale);

            if (error) throw error;

            const parsed = (data as AssociazioneRendiconto[]).map(item => ({
                ...item,
                created_at: item.created_at ? new Date(item.created_at) : new Date(),
                updated_at: item.updated_at ? new Date(item.updated_at) : new Date()
            })) as AssociazioneRendicontoParsed[];
            return parsed;
        }
    });
}


/*
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

    const updateAssociazione = async (payload: { codice_fiscale: string } & Partial<Associazione>) => {
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
/** */