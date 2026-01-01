import { useState, useEffect } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { Associazione, AssociazioneParsed, useNewAssociazione, useUpdateAssociazione } from "../hooks/useAssociazioni";

type ModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

//
export function NewAssociazioneModal({ isOpen, setIsOpen }: ModalProps) {
    const { mutate: createNewAssociazione } = useNewAssociazione();
    const {
        name, setName, ncode, setNcode, description, setDescription, codiceFiscale, setCodiceFiscale,
        reset
    } = useEditAssociazione();

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    return <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Nuova Associazione">
        <form onSubmit={(e) => {
            e.preventDefault();
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
        }}>
            <ModifyAssociazioneContent name={name} setName={setName} ncode={ncode} setNcode={setNcode} description={description} setDescription={setDescription} codiceFiscale={codiceFiscale} setCodiceFiscale={setCodiceFiscale}>
                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={() => setIsOpen(false)}>Annulla</Button>
                    <Button type="submit">Crea</Button>
                </div>
            </ModifyAssociazioneContent>
        </form>
    </Modal>
}

export function EditAssociazioneModal({ isOpen, setIsOpen, associazione }: ModalProps & { associazione: AssociazioneParsed | null }) {
    const { mutate: updateAssociazione, isPending } = useUpdateAssociazione();
    const {
        name, setName, ncode, setNcode, description, setDescription,
        reset
    } = useEditAssociazione();

    useEffect(() => {
        if (!isOpen || !associazione) {
            reset();
        } else {
            setName(associazione.name ?? '');
            setNcode(associazione.n_codice ?? undefined);
            setDescription(associazione.description ?? '');
        }
    }, [isOpen]);

    if (!associazione) return null;

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Modifica: ${associazione.name}`}>
            <form onSubmit={(e) => {
                e.preventDefault();
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
            }}>
                <ModifyAssociazioneContent name={name} setName={setName} ncode={ncode} setNcode={setNcode} description={description} setDescription={setDescription}>
                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={() => setIsOpen(false)}>Annulla</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? 'Salvando...' : 'Salva'}</Button>
                    </div>
                </ModifyAssociazioneContent>
            </form>
        </Modal>
    );
}
//

//
function ModifyAssociazioneContent({
    name, setName, ncode, setNcode, description, setDescription, codiceFiscale, setCodiceFiscale,
    children
}: {
    name: Associazione["name"];
    setName: (name: string) => void;
    ncode: Associazione["n_codice"];
    setNcode: (ncode: number | undefined) => void;
    description: Associazione["description"];
    setDescription: (description: string) => void;
    codiceFiscale?: Associazione["codice_fiscale"];
    setCodiceFiscale?: (codiceFiscale: string) => void;
    children?: React.ReactNode;
}) {
    return <div className="space-y-3">

        {setCodiceFiscale && <div>
            <p>Test</p>
            <label className="block text-sm font-medium text-gray-700">Codice Fiscale</label>
            <Input type="text"
                value={codiceFiscale || ''}
                onChange={(e) => setCodiceFiscale(e.target.value)} placeholder="Codice Fiscale"
            />
        </div>}

        <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <Input type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} placeholder="Nome associazione"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">N. Codice</label>
            <Input type="number" placeholder="N. Codice"
                value={ncode !== undefined ? ncode : ''}
                onChange={(e) => setNcode(e.target.value ? parseInt(e.target.value) : undefined)}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Descrizione</label>
            <textarea className="w-full border rounded p-2" rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </div>

        {children}
    </div>
}

function useEditAssociazione() {
    const [name, setName] = useState<Associazione["name"]>(undefined);
    const [ncode, setNcode] = useState<Associazione["n_codice"]>(undefined);
    const [description, setDescription] = useState<Associazione["description"]>(undefined);
    const [codiceFiscale, setCodiceFiscale] = useState<Associazione["codice_fiscale"]>(undefined);

    const reset = () => {
        setName(undefined);
        setNcode(undefined);
        setDescription(undefined);
        setCodiceFiscale(undefined);
    }

    return {
        name, setName, ncode, setNcode, description, setDescription, codiceFiscale, setCodiceFiscale,
        reset
    };
}
//