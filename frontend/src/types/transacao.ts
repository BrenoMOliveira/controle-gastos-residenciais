export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: number;
  pessoaId: string;
  categoriaId: string;
}

export interface CriarTransacaoRequest {
  descricao: string;
  valor: number;
  tipo: number;
  pessoaId: string;
  categoriaId: string;
}