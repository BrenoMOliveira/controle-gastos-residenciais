/**
 * Representa uma linha do relatório consolidado por pessoa
 */
export interface RelatorioPessoa {
  /**
   * Identificador da pessoa exibida na linha do relatório
   */
  pessoaId: string;
  nomePessoa: string;

  /**
   * Soma das receitas da pessoa
   */
  totalReceitas: number;

  /**
   * Soma das despesas da pessoa
   */
  totalDespesas: number;

  /**
   * Saldo consolidado da pessoa
   */
  saldo: number;
}

/**
 * Representa uma linha do relatório consolidado por categoria
 */
export interface RelatorioCategoria {
  /**
   * Identificador da categoria exibida na linha do relatório
   */
  categoriaId: string;
  descricaoCategoria: string;

  /**
   * Soma das receitas da categoria
   */
  totalReceitas: number;

  /**
   * Soma das despesas da categoria
   */
  totalDespesas: number;

  /**
   * Saldo consolidado da categoria
   */
  saldo: number;
}

/**
 * Representa os totais gerais exibidos nos cards e no rodapé dos relatórios
 */
export interface TotaisGeraisRelatorio {
  /**
   * Soma total das receitas do relatório ativo
   */
  totalReceitas: number;

  /**
   * Soma total das despesas do relatório ativo
   */
  totalDespesas: number;

  /**
   * Saldo líquido total do relatório ativo
   */
  saldoLiquido: number;
}

/**
 * Representa o retorno completo do relatório por pessoa
 */
export interface RelatorioTotaisPorPessoa {
  /**
   * Coleção de pessoas com seus totais consolidados
   */
  pessoas: RelatorioPessoa[];

  /**
   * Totais gerais do relatório por pessoa
   */
  totaisGerais: TotaisGeraisRelatorio;
}

/**
 * Representa o retorno completo do relatório por categoria
 */
export interface RelatorioTotaisPorCategoria {
  /**
   * Coleção de categorias com seus totais consolidados
   */
  categorias: RelatorioCategoria[];

  /**
   * Totais gerais do relatório por categoria
   */
  totaisGerais: TotaisGeraisRelatorio;
}