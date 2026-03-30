import { api } from "./api";
import type { CriarTransacaoRequest, Transacao } from "../types/transacao";

/**
 * Serviço responsável pelas operações de transações consumidas pela interface
 */
export const transacoesService = {
  /**
   * Busca todas as transações cadastradas para listagem
   * @returns Coleção de transações retornadas pela API
   */
  async listar(): Promise<Transacao[]> {
    const response = await api.get<Transacao[]>("/api/transacoes");
    return response.data;
  },

  /**
   * Envia uma nova transação para cadastro na API
   * @param payload Dados necessários para criar a transação
   * @returns Transação criada pela API
   */
  async criar(payload: CriarTransacaoRequest): Promise<Transacao> {
    const response = await api.post<Transacao>("/api/transacoes", payload);
    return response.data;
  },
};