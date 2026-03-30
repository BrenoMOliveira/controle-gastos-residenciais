import { api } from "./api";
import type {
  RelatorioTotaisPorCategoria,
  RelatorioTotaisPorPessoa,
} from "../types/relatorio";

/**
 * Serviço responsável pelas consultas de relatórios exibidas na interface
 */
export const relatoriosService = {
  /**
   * Busca o relatório consolidado de totais por pessoa
   * @returns Estrutura completa do relatório por pessoa
   */
  async consultarTotaisPorPessoa(): Promise<RelatorioTotaisPorPessoa> {
    const response = await api.get<RelatorioTotaisPorPessoa>("/api/relatorios/totais-por-pessoa");
    return response.data;
  },

  /**
   * Busca o relatório consolidado de totais por categoria
   * @returns Estrutura completa do relatório por categoria
   */
  async consultarTotaisPorCategoria(): Promise<RelatorioTotaisPorCategoria> {
    const response = await api.get<RelatorioTotaisPorCategoria>("/api/relatorios/totais-por-categoria");
    return response.data;
  },
};