export interface RelatorioPessoa {
  pessoaId: string;
  nomePessoa: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface RelatorioCategoria {
  categoriaId: string;
  descricaoCategoria: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}