import { api } from "./api";
import type {
  AtualizarPessoaRequest,
  CriarPessoaRequest,
  Pessoa,
} from "../types/pessoa";

export const pessoasService = {
  async listar(): Promise<Pessoa[]> {
    const response = await api.get<Pessoa[]>("/api/pessoas");
    return response.data;
  },

  async obterPorId(id: string): Promise<Pessoa> {
    const response = await api.get<Pessoa>(`/api/pessoas/${id}`);
    return response.data;
  },

  async criar(payload: CriarPessoaRequest): Promise<Pessoa> {
    const response = await api.post<Pessoa>("/api/pessoas", payload);
    return response.data;
  },

  async atualizar(id: string, payload: AtualizarPessoaRequest): Promise<Pessoa> {
    const response = await api.put<Pessoa>(`/api/pessoas/${id}`, payload);
    return response.data;
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/api/pessoas/${id}`);
  },
};