import { useEffect, useState } from "react";
import { relatoriosService } from "../services/relatorios.service";
import type {
  RelatorioTotaisPorCategoria,
  RelatorioTotaisPorPessoa,
  TotaisGeraisRelatorio,
} from "../types/relatorio";
import { MensagemErro } from "../utils/errors";
import { formatCurrency } from "../utils/formatters";

type AbaAtiva = "pessoas" | "categorias";

function obterClasseSaldo(valor: number) {
  if (valor > 0) return "text-[#297C07]";
  if (valor < 0) return "text-[#BB0002]";
  return "text-gray-700";
}

const relatorioPessoasInicial: RelatorioTotaisPorPessoa = {
  pessoas: [],
  totaisGerais: {
    totalReceitas: 0,
    totalDespesas: 0,
    saldoLiquido: 0,
  },
};

const relatorioCategoriasInicial: RelatorioTotaisPorCategoria = {
  categorias: [],
  totaisGerais: {
    totalReceitas: 0,
    totalDespesas: 0,
    saldoLiquido: 0,
  },
};

export default function RelatoriosPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("pessoas");
  const [relatorioPessoas, setRelatorioPessoas] = useState<RelatorioTotaisPorPessoa>(relatorioPessoasInicial);
  const [relatorioCategorias, setRelatorioCategorias] = useState<RelatorioTotaisPorCategoria>(relatorioCategoriasInicial);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarRelatorios() {
    try {
      setCarregando(true);
      setErro("");

      const [dadosPessoas, dadosCategorias] = await Promise.all([
        relatoriosService.consultarTotaisPorPessoa(),
        relatoriosService.consultarTotaisPorCategoria(),
      ]);

      setRelatorioPessoas(dadosPessoas);
      setRelatorioCategorias(dadosCategorias);
    } catch (error: unknown) {
      setErro(MensagemErro(error, "Não foi possível carregar os relatórios."));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const totaisAtivos: TotaisGeraisRelatorio =
    abaAtiva === "pessoas" ? relatorioPessoas.totaisGerais : relatorioCategorias.totaisGerais;

  const tituloTabela =
    abaAtiva === "pessoas" ? "Totais por pessoa" : "Totais por categoria";

  const semDadosAtivos =
    abaAtiva === "pessoas"
      ? relatorioPessoas.pessoas.length === 0
      : relatorioCategorias.categorias.length === 0;

  const mensagemVazia =
    abaAtiva === "pessoas"
      ? "Nenhuma pessoa cadastrada para exibir no relatório."
      : "Nenhuma categoria cadastrada para exibir no relatório.";

  return (
    <section className="flex h-full flex-col gap-6">
      <div className="shrink-0">
        <h2 className="text-3xl font-bold text-[#00396A]">Relatórios</h2>
        <p className="mt-1 text-gray-500">
          Consulta consolidada de receitas, despesas e saldo por pessoas e categorias.
        </p>
      </div>

      <div className="shrink-0">
        <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setAbaAtiva("pessoas")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              abaAtiva === "pessoas"
                ? "bg-[#0872C9] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Totais por Pessoa
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("categorias")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              abaAtiva === "categorias"
                ? "bg-[#0872C9] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Totais por Categoria
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-800">Total de receitas</p>
          <p className="mt-2 text-2xl font-bold text-emerald-900">
            {formatCurrency(totaisAtivos.totalReceitas)}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-red-800">Total de despesas</p>
          <p className="mt-2 text-2xl font-bold text-red-900">
            {formatCurrency(totaisAtivos.totalDespesas)}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-800">Saldo líquido</p>
          <p className={`mt-2 text-2xl font-bold ${obterClasseSaldo(totaisAtivos.saldoLiquido)}`}>
            {formatCurrency(totaisAtivos.saldoLiquido)}
          </p>
        </div>
      </div>

      <div className="flex min-h-75 flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h3 className="text-lg font-semibold text-[#00396A]">{tituloTabela}</h3>
          <button
            onClick={carregarRelatorios}
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
          <p className="text-gray-500">Carregando relatórios...</p>
        ) : semDadosAtivos ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            {mensagemVazia}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200">
            {abaAtiva === "pessoas" ? (
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
                  {relatorioPessoas.pessoas.map((pessoa) => (
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
                      {formatCurrency(relatorioPessoas.totaisGerais.totalReceitas)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      {formatCurrency(relatorioPessoas.totaisGerais.totalDespesas)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      {formatCurrency(relatorioPessoas.totaisGerais.saldoLiquido)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoria</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Receitas</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Despesas</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Saldo</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {relatorioCategorias.categorias.map((categoria) => (
                    <tr key={categoria.categoriaId} className="bg-white transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{categoria.descricaoCategoria}</td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-700">
                        {formatCurrency(categoria.totalReceitas)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-red-700">
                        {formatCurrency(categoria.totalDespesas)}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${obterClasseSaldo(categoria.saldo)}`}>
                        {formatCurrency(categoria.saldo)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="sticky bottom-0 bg-[#00396A] text-white">
                  <tr>
                    <td className="px-4 py-3 text-left text-sm font-semibold">Total geral</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      {formatCurrency(relatorioCategorias.totaisGerais.totalReceitas)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      {formatCurrency(relatorioCategorias.totaisGerais.totalDespesas)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      {formatCurrency(relatorioCategorias.totaisGerais.saldoLiquido)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
