/**
 * Representa uma pessoa retornada pela API
 */
export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

/**
 * Representa os dados enviados para criar uma nova pessoa
 */
export interface CriarPessoaRequest {
  nome: string;
  idade: number;
}

/**
 * Representa os dados enviados para atualizar uma pessoa existente
 */
export interface AtualizarPessoaRequest {
  nome: string;
  idade: number;
}