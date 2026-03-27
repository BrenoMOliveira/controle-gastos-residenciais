export type FinalidadeCategoria = 1 | 2 | 3;

export interface Categoria {
  id: string;
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface CriarCategoriaRequest {
  descricao: string;
  finalidade: FinalidadeCategoria;
}