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

export const AvailableRendicontoPaymentsTypes: { value: keyof typeof PaymentTypesEnum; label: PaymentTypesEnum }[] = [
    { value: 'ASSEGNO', label: PaymentTypesEnum.ASSEGNO },
    { value: 'CARTA', label: PaymentTypesEnum.CARTA },
    { value: 'CONTANTE', label: PaymentTypesEnum.CONTANTE },
];

export const AvailableRendicontoTypes: { value: keyof typeof RendicontoTypesEnum; label: RendicontoTypesEnum }[] = [
    { value: 'A', label: RendicontoTypesEnum.A },
    { value: 'B', label: RendicontoTypesEnum.B },
    { value: 'C', label: RendicontoTypesEnum.C },
    { value: 'D', label: RendicontoTypesEnum.D },
    { value: 'E', label: RendicontoTypesEnum.E },
    { value: 'G', label: RendicontoTypesEnum.G },
    { value: 'I', label: RendicontoTypesEnum.I },
    { value: 'L', label: RendicontoTypesEnum.L },
    { value: 'M', label: RendicontoTypesEnum.M },
    { value: 'P', label: RendicontoTypesEnum.P },
    { value: 'Q', label: RendicontoTypesEnum.Q },
    { value: 'R', label: RendicontoTypesEnum.R },
    { value: 'S', label: RendicontoTypesEnum.S },
    { value: 'T', label: RendicontoTypesEnum.T },
    { value: 'V', label: RendicontoTypesEnum.V },
];


//

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

    payment_type: PaymentTypesEnum;
    type: RendicontoTypesEnum;

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

            const parsed = (data as AssociazioneRendiconto[]).map(item => {
                const { payment_type, type } = item;

                const paymentType = AvailableRendicontoPaymentsTypes.find(pt => payment_type === pt.value);
                const parsedType = AvailableRendicontoTypes.find(t => t.value === type);

                return {
                    ...item,

                    payment_type: paymentType?.label,
                    type: parsedType?.label,

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

    const updateRendiconto = async (payload: { id: AssociazioneRendiconto["id"] } & Partial<AssociazioneRendiconto>) => {
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