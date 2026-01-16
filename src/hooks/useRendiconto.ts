import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

//
export enum RendicontoTypesEnum {
    A = 'Attrezzature sociali',
    B = 'Beni materiali sociali',
    C = 'Canoni e utenze',
    D = 'Donazioni a terzi',
    E = 'Erogazioni compensi collaborazione a soci',
    G = 'Giochi e didattica',
    I = 'Imposte',
    L = 'Liberalità da terzi',
    M = 'Manutenzione',
    P = 'Pulizia e igiene',
    Q = 'Quote sociali',
    R = 'Rimborsi spese terzi',
    S = 'Sottoscrizioni ed anticipazioni da soci',
    T = 'Transporti',
    V = 'Varie',
}

export enum PaymentTypesEnum {
    ASSEGNO = 'Assegno/Banca',
    CARTA = 'Carta di credito',
    CONTANTE = 'Contante',
}


export enum RendicontoCategoriesEnum {
    Entrata = 'Entrata',
    Uscita = 'Uscita',
    Varie = 'Varie',
}
//


//
export const AvailableRendicontoPaymentsTypes: { value: keyof typeof PaymentTypesEnum; label: PaymentTypesEnum }[] = [
    { value: 'ASSEGNO', label: PaymentTypesEnum.ASSEGNO },
    { value: 'CARTA', label: PaymentTypesEnum.CARTA },
    { value: 'CONTANTE', label: PaymentTypesEnum.CONTANTE },
];

export const AvailableRendicontoTypes: {
    value: keyof typeof RendicontoTypesEnum;
    label: RendicontoTypesEnum;
    type: string;
}[] = [
        { value: 'A', label: RendicontoTypesEnum.A, type: RendicontoCategoriesEnum.Uscita },
        { value: 'B', label: RendicontoTypesEnum.B, type: RendicontoCategoriesEnum.Uscita },
        { value: 'C', label: RendicontoTypesEnum.C, type: RendicontoCategoriesEnum.Uscita },
        { value: 'D', label: RendicontoTypesEnum.D, type: RendicontoCategoriesEnum.Uscita },
        { value: 'E', label: RendicontoTypesEnum.E, type: RendicontoCategoriesEnum.Uscita },
        { value: 'G', label: RendicontoTypesEnum.G, type: RendicontoCategoriesEnum.Uscita },
        { value: 'I', label: RendicontoTypesEnum.I, type: RendicontoCategoriesEnum.Uscita },
        { value: 'L', label: RendicontoTypesEnum.L, type: RendicontoCategoriesEnum.Entrata },
        { value: 'M', label: RendicontoTypesEnum.M, type: RendicontoCategoriesEnum.Uscita },
        { value: 'P', label: RendicontoTypesEnum.P, type: RendicontoCategoriesEnum.Uscita },
        { value: 'Q', label: RendicontoTypesEnum.Q, type: RendicontoCategoriesEnum.Entrata },
        { value: 'R', label: RendicontoTypesEnum.R, type: RendicontoCategoriesEnum.Uscita },
        { value: 'S', label: RendicontoTypesEnum.S, type: RendicontoCategoriesEnum.Entrata },
        { value: 'T', label: RendicontoTypesEnum.T, type: RendicontoCategoriesEnum.Uscita },
        { value: 'V', label: RendicontoTypesEnum.V, type: RendicontoCategoriesEnum.Varie },
    ];


// Define the structure of an AssociazioneRendiconto record
export type AssociazioneRendiconto = {
    id: number;
    codice_fiscale: string;
    type: keyof typeof RendicontoTypesEnum;
    payment_type: keyof typeof PaymentTypesEnum;
    value: number;

    created_at?: string | null;
    updated_at?: string | null;
};

export type AssociazioneRendicontoParsed = Pick<AssociazioneRendiconto, "id" | "codice_fiscale" | "value"> & {
    payment_type: keyof typeof PaymentTypesEnum;
    type: keyof typeof RendicontoTypesEnum;

    created_at: Date;
    updated_at: Date;
};

/** */
export default function useAssociazioneRendiconto(codice_fiscale: string): UseQueryResult<AssociazioneRendicontoParsed[], Error> {
    return useQuery<AssociazioneRendicontoParsed[], Error>({
        queryKey: ['associazione_resoconti', codice_fiscale],
        queryFn: async () => {
            const { data, error } = await supabase.from('associazione_resoconti')
                .select('*')
                .eq('codice_fiscale', codice_fiscale)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const parsed = (data as AssociazioneRendiconto[]).map(item => {
                const { payment_type, type } = item;

                const paymentType = AvailableRendicontoPaymentsTypes.find(pt => payment_type === pt.value);
                const parsedType = AvailableRendicontoTypes.find(t => t.value === type);

                return {
                    ...item,

                    payment_type: paymentType?.value,
                    type: parsedType?.value,

                    created_at: item.created_at ? new Date(item.created_at) : new Date(),
                    updated_at: item.updated_at ? new Date(item.updated_at) : new Date()
                }
            }) as AssociazioneRendicontoParsed[];

            return parsed;
        }
    });
}


export function useNewRendiconto() {
    const queryClient = useQueryClient();

    const createAssociazioneRendiconto = async (rendiconto: Omit<AssociazioneRendiconto, 'created_at' | 'updated_at' | 'id'>) => {
        const { data, error } = await supabase.from('associazione_resoconti').insert([rendiconto]);

        if (error) {
            throw error;
        }

        return data;
    };

    return useMutation({
        mutationFn: createAssociazioneRendiconto,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['associazione_resoconti'] })
        },
    });
}


export function useUpdateRendiconto() {
    const queryClient = useQueryClient();

    const updateRendiconto = async (payload: { id: AssociazioneRendiconto["id"] } & Omit<AssociazioneRendiconto, 'codice_fiscale' | 'created_at' | 'updated_at' | 'id'>) => {
        const { id, ...patch } = payload;
        const { data, error } = await supabase.from('associazione_resoconti').update(patch).eq('id', id);

        if (error) throw error;

        return data;
    };

    return useMutation({
        mutationFn: updateRendiconto,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['associazione_resoconti'] });
        }
    });
}