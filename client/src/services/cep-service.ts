import axios from "axios";

export async function buscarEnderecoPorCep(cep: string) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    throw new Error("Nao foi possivel buscar o endereço.");
  }
}
export function calcularFrete(estado: string): number {
  const freteBase = 15;

  const adicionalPorEstado = {
    SP: 5,
    RJ: 10,
    MG: 12,
    RS: 20,
    PR: 20,
  };

  return freteBase + (adicionalPorEstado[estado as keyof typeof adicionalPorEstado] );
}
