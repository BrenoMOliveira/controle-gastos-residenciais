import { api } from "./api";
import type { RelatorioTotaisPorPessoa } from "../types/relatorio";

export const relatoriosService = {
  async consultarTotaisPorPessoa(): Promise<RelatorioTotaisPorPessoa> {
    const response = await api.get<RelatorioTotaisPorPessoa>("/api/relatorios/totais-por-pessoa");
    return response.data;
  },
};
