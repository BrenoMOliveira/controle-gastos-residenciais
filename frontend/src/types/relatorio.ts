export interface RelatorioPessoa {
  pessoaId: string;
  nomePessoa: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisGeraisRelatorio {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface RelatorioTotaisPorPessoa {
  pessoas: RelatorioPessoa[];
  totaisGerais: TotaisGeraisRelatorio;
}

export interface RelatorioCategoria {
  categoriaId: string;
  descricaoCategoria: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}