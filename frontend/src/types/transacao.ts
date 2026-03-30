/**
 * Representa os valores permitidos para o tipo de transação
 */
export type TipoTransacao = 1 | 2;

/**
 * Representa uma transação retornada pela API
 */
export interface Transacao {
  id: string;
  descricao: string;
  valor: number;

  /**
   * Tipo numérico da transação, indicando despesa ou receita
   */
  tipo: TipoTransacao;

  /**
   * Identificador da pessoa vinculada à transação
   */
  pessoaId: string;

  /**
   * Identificador da categoria vinculada à transação
   */
  categoriaId: string;
}

/**
 * Representa os dados enviados para criar uma nova transação
 */
export interface CriarTransacaoRequest {
  descricao: string;
  valor: number;

  /**
   * Tipo numérico da transação
   */
  tipo: TipoTransacao;

  /**
   * Identificador da pessoa responsável pela transação
   */
  pessoaId: string;

  /**
   * Identificador da categoria utilizada na transação
   */
  categoriaId: string;
}