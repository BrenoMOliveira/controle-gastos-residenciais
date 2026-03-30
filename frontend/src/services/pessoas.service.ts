import { api } from "./api";
import type {
  AtualizarPessoaRequest,
  CriarPessoaRequest,
  Pessoa,
} from "../types/pessoa";

/**
 * Serviço responsável pelas operações de pessoas consumidas pela interface
 */
export const pessoasService = {
  /**
   * Busca todas as pessoas cadastradas para listagem
   * @returns Coleção de pessoas retornadas pela API
   */
  async listar(): Promise<Pessoa[]> {
    const response = await api.get<Pessoa[]>("/api/pessoas");
    return response.data;
  },

  /**
   * Busca uma pessoa específica pelo identificador
   * @param id Identificador da pessoa
   * @returns Dados completos da pessoa encontrada
   */
  async obterPorId(id: string): Promise<Pessoa> {
    const response = await api.get<Pessoa>(`/api/pessoas/${id}`);
    return response.data;
  },

  /**
   * Envia uma nova pessoa para cadastro na API
   * @param payload Dados necessários para criar a pessoa
   * @returns Pessoa criada pela API
   */
  async criar(payload: CriarPessoaRequest): Promise<Pessoa> {
    const response = await api.post<Pessoa>("/api/pessoas", payload);
    return response.data;
  },

  /**
   * Atualiza uma pessoa já cadastrada na API
   * @param id Identificador da pessoa que será atualizada
   * @param payload Novos dados da pessoa
   * @returns Pessoa atualizada pela API
   */
  async atualizar(id: string, payload: AtualizarPessoaRequest): Promise<Pessoa> {
    const response = await api.put<Pessoa>(`/api/pessoas/${id}`, payload);
    return response.data;
  },

  /**
   * Solicita a exclusão de uma pessoa cadastrada
   * @param id Identificador da pessoa que será removida
   * @returns Promessa concluída após a exclusão na API
   */
  async excluir(id: string): Promise<void> {
    await api.delete(`/api/pessoas/${id}`);
  },
};