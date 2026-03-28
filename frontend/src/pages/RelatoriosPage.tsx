import { useEffect, useState } from "react";
import { relatoriosService } from "../services/relatorios.service";
import type { RelatorioTotaisPorPessoa } from "../types/relatorio";
import { MensagemErro } from "../utils/errors";
import { formatCurrency } from "../utils/formatters";

function obterClasseSaldo(valor: number) {
  if (valor > 0) return "text-[#297C07]";
  if (valor < 0) return "text-[#BB0002]";
  return "text-gray-700";
}

const relatorioInicial: RelatorioTotaisPorPessoa = {
  pessoas: [],
  totaisGerais: {
    totalReceitas: 0,
    totalDespesas: 0,
    saldoLiquido: 0,
  },
};

export default function RelatoriosPage() {
  const [relatorio, setRelatorio] = useState<RelatorioTotaisPorPessoa>(relatorioInicial);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarRelatorio() {
    try {
      setCarregando(true);
      setErro("");

      const data = await relatoriosService.consultarTotaisPorPessoa();
      setRelatorio(data);
    } catch (error: unknown) {
      setErro(MensagemErro(error, "Não foi possível carregar o relatório."));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarRelatorio();
  }, []);

  return (
    <section className="flex h-full flex-col gap-6">
      <div className="shrink-0">
        <h2 className="text-3xl font-bold text-[#00396A]">Relatórios</h2>
        <p className="mt-1 text-gray-500">
          Consulta de totais por pessoa com receitas, despesas e saldo somado.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-800">Total de receitas</p>
          <p className="mt-2 text-2xl font-bold text-emerald-900">
            {formatCurrency(relatorio.totaisGerais.totalReceitas)}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-red-800">Total de despesas</p>
          <p className="mt-2 text-2xl font-bold text-red-900">
            {formatCurrency(relatorio.totaisGerais.totalDespesas)}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-800">Saldo líquido</p>
          <p className={`mt-2 text-2xl font-bold ${obterClasseSaldo(relatorio.totaisGerais.saldoLiquido)}`}>
            {formatCurrency(relatorio.totaisGerais.saldoLiquido)}
          </p>
        </div>
      </div>

      <div className="flex min-h-75 flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h3 className="text-lg font-semibold text-[#00396A]">Totais por pessoa</h3>
          <button
            onClick={carregarRelatorio}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Atualizar
          </button>
        </div>

        {erro && (
          <div className="mb-4 rounded-xl border border-[#BB0002]/20 bg-[#BB0002]/5 px-4 py-3 text-sm text-[#BB0002]">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-gray-500">Carregando relatório...</p>
        ) : relatorio.pessoas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Nenhuma pessoa cadastrada para exibir no relatório.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pessoa</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Receitas</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Despesas</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Saldo</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {relatorio.pessoas.map((pessoa) => (
                  <tr key={pessoa.pessoaId} className="bg-white transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{pessoa.nomePessoa}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-700">
                      {formatCurrency(pessoa.totalReceitas)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-red-700">
                      {formatCurrency(pessoa.totalDespesas)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${obterClasseSaldo(pessoa.saldo)}`}>
                      {formatCurrency(pessoa.saldo)}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="sticky bottom-0 bg-[#00396A] text-white">
                <tr>
                  <td className="px-4 py-3 text-left text-sm font-semibold">Total geral</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    {formatCurrency(relatorio.totaisGerais.totalReceitas)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    {formatCurrency(relatorio.totaisGerais.totalDespesas)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    {formatCurrency(relatorio.totaisGerais.saldoLiquido)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}