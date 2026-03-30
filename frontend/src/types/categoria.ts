/**
 * Representa os valores permitidos para a finalidade de uma categoria
 */
export type FinalidadeCategoria = 1 | 2 | 3;

/**
 * Representa uma categoria retornada pela API
 */
export interface Categoria {
  id: string;
  descricao: string;
  finalidade: FinalidadeCategoria;
}

/**
 * Representa os dados enviados para criar uma nova categoria
 */
export interface CriarCategoriaRequest {
  descricao: string;
  finalidade: FinalidadeCategoria;
}