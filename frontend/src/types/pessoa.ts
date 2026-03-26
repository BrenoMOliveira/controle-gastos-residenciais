export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface CriarPessoaRequest {
  nome: string;
  idade: number;
}

export interface AtualizarPessoaRequest {
  nome: string;
  idade: number;
}