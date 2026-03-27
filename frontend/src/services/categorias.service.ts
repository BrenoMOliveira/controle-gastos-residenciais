import { api } from "./api";
import type { Categoria, CriarCategoriaRequest } from "../types/categoria";

export const categoriasService = {
  async listar(): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>("/api/categorias");
    return response.data;
  },

  async criar(payload: CriarCategoriaRequest): Promise<Categoria> {
    const response = await api.post<Categoria>("/api/categorias", payload);
    return response.data;
  },
};
