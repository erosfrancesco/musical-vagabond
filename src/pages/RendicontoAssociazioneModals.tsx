import { useState, useEffect } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { useNewAssociazione, useUpdateAssociazione } from "../hooks/useAssociazioni";
import { AssociazioneRendiconto, AssociazioneRendicontoParsed, AvailableRendicontoPaymentsTypes, AvailableRendicontoTypes } from "../hooks/useAssociazioneRendiconto";
import Select from "../components/Select";

type ModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}


export function NewRendicontoModal({ isOpen, setIsOpen }: ModalProps) {
    const { mutate: createNewAssociazione } = useNewAssociazione();
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
            /*
            const payload = {
                name,
                codice_fiscale: codiceFiscale,
                n_codice: ncode,
                description
            };

            createNewAssociazione(payload, {
                onSettled: () => {
                    setIsOpen(false);
                }
            });
            /** */
        }}>
            <ModifyRendicontoContent type={type} setType={setType} paymentType={paymentType} setPaymentType={setPaymentType} value={value} setValue={setValue}>
                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={() => setIsOpen(false)}>Annulla</Button>
                    <Button type="submit">Crea</Button>
                </div>
            </ModifyRendicontoContent>
        </form>
    </Modal>
}

export function EditRendicontoModal({ isOpen, setIsOpen, rendiconto }: ModalProps & { rendiconto: AssociazioneRendicontoParsed | null }) {
    const { mutate: updateAssociazione, isPending } = useUpdateAssociazione();

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
                /*
                const payload = {
                    name,
                    n_codice: ncode,
                    description
                };
                updateAssociazione({
                    codice_fiscale: associazione.codice_fiscale,
                    ...payload
                }, {
                    onSettled: () => setIsOpen(false)
                });
                /** */
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
    type: AssociazioneRendiconto["type"] | undefined;
    setType: (type: string) => void;
    paymentType: AssociazioneRendiconto["payment_type"] | undefined;
    setPaymentType: (paymentType: string) => void;
    value: AssociazioneRendiconto["value"] | undefined;
    setValue: (value: number) => void;
    children?: React.ReactNode;
}) {



    return <div className="space-y-3">
        <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <Select
                options={AvailableRendicontoTypes}
                value={type}
                onChange={(e) => setType(e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Pagamento</label>
            <Select
                options={AvailableRendicontoPaymentsTypes}
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Valore (€)</label>
            <Input type="number" placeholder="Value"
                value={value}
                onChange={(e) => setValue(e.target.value ? parseFloat(e.target.value) : 0)}
            />
        </div>

        {children}
    </div>
}

function useEditRendiconto() {
    const [codiceFiscale, setCodiceFiscale] = useState<AssociazioneRendiconto["codice_fiscale"] | undefined>(undefined);
    const [type, setType] = useState<AssociazioneRendiconto["type"] | undefined>(undefined);
    const [paymentType, setPaymentType] = useState<AssociazioneRendiconto["payment_type"] | undefined>(undefined);
    const [value, setValue] = useState<AssociazioneRendiconto["value"] | undefined>(undefined);

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