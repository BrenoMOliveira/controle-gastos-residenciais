import { api } from "./api";
import type { CriarTransacaoRequest, Transacao } from "../types/transacao";

export const transacoesService = {
  async listar(): Promise<Transacao[]> {
    const response = await api.get<Transacao[]>("/api/transacoes");
    return response.data;
  },

  async criar(payload: CriarTransacaoRequest): Promise<Transacao> {
    const response = await api.post<Transacao>("/api/transacoes", payload);
    return response.data;
  },
};
