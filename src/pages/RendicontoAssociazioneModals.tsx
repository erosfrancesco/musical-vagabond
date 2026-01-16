import { useState, useEffect } from "react";
import {
    AssociazioneRendiconto, AssociazioneRendicontoParsed, AvailableRendicontoPaymentsTypes, AvailableRendicontoTypes,
    useNewRendiconto, useUpdateRendiconto
} from "../hooks/useRendiconto";
import { Associazione } from "../hooks/useAssociazioni";
import { Button, Input, Modal, Select } from "../components/index";

type ModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}


export function NewRendicontoModal({ isOpen, setIsOpen, codice_fiscale }: ModalProps & { codice_fiscale: Associazione["codice_fiscale"] }) {
    const { mutate: createNewRendiconto } = useNewRendiconto();
    const {
        reset, type, setType, paymentType, setPaymentType, value, setValue
    } = useEditRendiconto();

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    return <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Nuova spesa">
        <form onSubmit={(e) => {
            e.preventDefault();

            const payloadType = type || AvailableRendicontoTypes[0].value;
            const payloadPaymentType = paymentType || AvailableRendicontoPaymentsTypes[0].value;
            const payloadValue = value!;

            const payload: Omit<AssociazioneRendiconto, "id"> = {
                type: payloadType,
                payment_type: payloadPaymentType,
                value: payloadValue,
                codice_fiscale
            };

            createNewRendiconto(payload, {
                onSettled: () => {
                    setIsOpen(false);
                }
            });
        }}>
            <ModifyRendicontoContent type={type} setType={setType} paymentType={paymentType} setPaymentType={setPaymentType} value={value} setValue={setValue}>
                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={() => setIsOpen(false)}>Annulla</Button>
                    <Button type="submit">Crea</Button>
                </div>
            </ModifyRendicontoContent>
        </form>
    </Modal >
}

export function EditRendicontoModal({ isOpen, setIsOpen, rendiconto }: ModalProps & { rendiconto: AssociazioneRendicontoParsed | null }) {
    const { mutate: updateRendiconto, isPending } = useUpdateRendiconto();

    const {
        type, setType, paymentType, setPaymentType, value, setValue,
        reset
    } = useEditRendiconto();

    useEffect(() => {
        if (!isOpen || !rendiconto) {
            reset();
        } else {
            setType(rendiconto.type);
            setPaymentType(rendiconto.payment_type);
            setValue(rendiconto.value);
        }
    }, [isOpen]);

    if (!rendiconto) return null;

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Modifica: ${rendiconto.id}`}>
            <form onSubmit={(e) => {
                e.preventDefault();

                const payload = {
                    ...rendiconto,
                    type: type!,
                    payment_type: paymentType!,
                    value: value!
                };

                updateRendiconto(payload, {
                    onSettled: () => setIsOpen(false)
                });
            }}>
                <ModifyRendicontoContent type={type} setType={setType} paymentType={paymentType} setPaymentType={setPaymentType} value={value} setValue={setValue}>
                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={() => setIsOpen(false)}>Annulla</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? 'Salvando...' : 'Salva'}</Button>
                    </div>
                </ModifyRendicontoContent>
            </form>
        </Modal >
    );
}

//
function ModifyRendicontoContent({
    type, setType, paymentType, setPaymentType, value, setValue,
    children
}: {
    type: AssociazioneRendicontoParsed["type"] | undefined;
    setType: (type: AssociazioneRendicontoParsed["type"]) => void;
    paymentType: AssociazioneRendicontoParsed["payment_type"] | undefined;
    setPaymentType: (paymentType: AssociazioneRendicontoParsed["payment_type"]) => void;
    value: AssociazioneRendicontoParsed["value"] | undefined;
    setValue: (value: number) => void;
    children?: React.ReactNode;
}) {



    return <div className="space-y-3">
        <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <Select
                options={AvailableRendicontoTypes}
                value={type}
                onChange={(e) => setType(e.target.value as AssociazioneRendicontoParsed["type"])}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Pagamento</label>
            <Select
                options={AvailableRendicontoPaymentsTypes}
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as AssociazioneRendicontoParsed["payment_type"])}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Valore (€)</label>
            <Input type="number" placeholder="Value"
                required step={0.01}
                value={value}
                onChange={(e) => setValue(e.target.value ? parseFloat(e.target.value) : 0)}
            />
        </div>

        {children}
    </div>
}

function useEditRendiconto() {
    const [codiceFiscale, setCodiceFiscale] = useState<AssociazioneRendicontoParsed["codice_fiscale"] | undefined>(undefined);
    const [type, setType] = useState<AssociazioneRendicontoParsed["type"] | undefined>(undefined);
    const [paymentType, setPaymentType] = useState<AssociazioneRendicontoParsed["payment_type"] | undefined>(undefined);
    const [value, setValue] = useState<AssociazioneRendicontoParsed["value"] | undefined>(undefined);

    const reset = () => {
        setCodiceFiscale(undefined);
        setType(undefined);
        setPaymentType(undefined);
        setValue(undefined);
    }

    return {
        codiceFiscale, setCodiceFiscale, type, setType, paymentType, setPaymentType, value, setValue,
        reset
    };
}
//