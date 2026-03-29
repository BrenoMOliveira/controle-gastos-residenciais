import { api } from "./api";
import type {
  RelatorioTotaisPorCategoria,
  RelatorioTotaisPorPessoa,
} from "../types/relatorio";

export const relatoriosService = {
  async consultarTotaisPorPessoa(): Promise<RelatorioTotaisPorPessoa> {
    const response = await api.get<RelatorioTotaisPorPessoa>("/api/relatorios/totais-por-pessoa");
    return response.data;
  },

  async consultarTotaisPorCategoria(): Promise<RelatorioTotaisPorCategoria> {
    const response = await api.get<RelatorioTotaisPorCategoria>("/api/relatorios/totais-por-categoria");
    return response.data;
  },
};
