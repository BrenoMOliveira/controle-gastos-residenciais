import { api } from "./api";
import type { Categoria, CriarCategoriaRequest } from "../types/categoria";

/**
 * Serviço responsável pelas operações de categorias consumidas pela interface
 */
export const categoriasService = {
  /**
   * Busca todas as categorias cadastradas para exibição em formulários e listagens
   * @returns Coleção de categorias retornadas pela API
   */
  async listar(): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>("/api/categorias");
    return response.data;
  },

  /**
   * Envia uma nova categoria para cadastro na API
   * @param payload Dados necessários para criar a categoria
   * @returns Categoria criada pela API
   */
  async criar(payload: CriarCategoriaRequest): Promise<Categoria> {
    const response = await api.post<Categoria>("/api/categorias", payload);
    return response.data;
  },
};