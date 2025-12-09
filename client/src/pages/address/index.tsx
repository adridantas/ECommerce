import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAddresses } from "@/context/hooks/useAddresses";

export const AddressPage = () => {
  const { addresses, addAddress } = useAddresses();

  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleAdd = async () => {
    if (!cep || !street || !number || !city || !state) return;

    await addAddress({
      cep,
      logradouro: street,
      complemento: complement,
      numero: number,
      cidade: city,
      bairro: neighborhood,
      estado: state,
    });

    setCep("");
    setStreet("");
    setNumber("");
    setCity("");
    setState("");
    setComplement("");
    setNeighborhood("");
  };

  return (
    <div className="container mx-auto pt-24 px-6 max-w-xl">
      <h2 className="text-2xl mb-4">Meus Endereços</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InputText placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
        <InputText placeholder="Rua" value={street} onChange={(e) => setStreet(e.target.value)} />
        <InputText placeholder="Número" value={number} onChange={(e) => setNumber(e.target.value)} />
        <InputText placeholder="Complemento" value={complement} onChange={(e) => setComplement(e.target.value)} />
        <InputText placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
        <InputText placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
        <InputText placeholder="Estado" value={state} onChange={(e) => setState(e.target.value)} />
      </div>
      <Button label="Adicionar Endereço" onClick={handleAdd} />

      <ul className="mt-6 space-y-2">
        {addresses.map((addr) => (
          <li key={addr.id}>
            {addr.logradouro}, {addr.numero}
            {addr.complemento ? `, ${addr.complemento}` : ""}
            {addr.bairro ? ` - ${addr.bairro}` : ""} - {addr.cidade}/{addr.estado} (CEP: {addr.cep})
          </li>

        ))}
      </ul>
    </div>
  );
};
