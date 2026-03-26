export interface Categoria {
  id: string;
  descricao: string;
  finalidade: number;
}

export interface CriarCategoriaRequest {
  descricao: string;
  finalidade: number;
}