import { useEffect, useState } from "react";
import { categoriasService } from "../services/categorias.service";
import { pessoasService } from "../services/pessoas.service";
import { transacoesService } from "../services/transacoes.service";
import type { Categoria, FinalidadeCategoria } from "../types/categoria";
import type { Pessoa } from "../types/pessoa";
import type { TipoTransacao, Transacao } from "../types/transacao";
import { MensagemErro } from "../utils/errors";
import { formatCurrency } from "../utils/formatters";
import { finalidadeCategoriaLabel, tipoTransacaoLabel } from "../utils/enums";

type FormState = {
  descricao: string;
  valor: string;
  tipo: string;
  pessoaId: string;
  categoriaId: string;
};

const initialForm: FormState = {
  descricao: "",
  valor: "",
  tipo: "",
  pessoaId: "",
  categoriaId: "",
};

const tiposTransacao: Array<{ value: TipoTransacao; label: string }> = [
  { value: 1, label: "Despesa" },
  { value: 2, label: "Receita" },
];

function categoriaCompativel(finalidade: FinalidadeCategoria, tipo: TipoTransacao) {
  return (
    finalidade === 3 ||
    (tipo === 1 && finalidade === 1) ||
    (tipo === 2 && finalidade === 2)
  );
}

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const pessoaSelecionada = pessoas.find((pessoa) => pessoa.id === form.pessoaId);
  const pessoaMenorDeIdade = Boolean(pessoaSelecionada && pessoaSelecionada.idade < 18);

  // Filtra em memória apenas as categorias compatíveis com o tipo selecionado para evitar combinações inválidas
  const categoriasDisponiveis = categorias.filter((categoria) => {
    if (form.tipo === "") return true;
    return categoriaCompativel(categoria.finalidade, Number(form.tipo) as TipoTransacao);
  });

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const [transacoesData, pessoasData, categoriasData] = await Promise.all([
        transacoesService.listar(),
        pessoasService.listar(),
        categoriasService.listar(),
      ]);

      setTransacoes(transacoesData);
      setPessoas(pessoasData);
      setCategorias(categoriasData);
    } catch {
      setErro("Não foi possível carregar os dados de transações.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    // Carrega transações, pessoas e categorias em paralelo para montar toda a tela de uma só vez
    carregarDados();
  }, []);

  useEffect(() => {
    // Oculta a confirmação de sucesso após um intervalo curto para manter a interface mais limpa
    if (!mensagem) return;

    const timer = setTimeout(() => setMensagem(""), 3000);
    return () => clearTimeout(timer);
  }, [mensagem]);

  useEffect(() => {
    // Ajusta automaticamente o tipo para despesa quando a pessoa selecionada é menor de idade
    if (pessoaMenorDeIdade && form.tipo === "2") {
      setForm((prev) => ({ ...prev, tipo: "1" }));
    }
  }, [pessoaMenorDeIdade, form.tipo]);

  useEffect(() => {
    // Limpa a categoria escolhida quando ela deixa de ser compatível com o tipo atual da transação
    if (!form.categoriaId) return;

    const categoriaSelecionada = categorias.find((categoria) => categoria.id === form.categoriaId);

    if (!categoriaSelecionada) {
      setForm((prev) => ({ ...prev, categoriaId: "" }));
      return;
    }

    if (form.tipo && !categoriaCompativel(categoriaSelecionada.finalidade, Number(form.tipo) as TipoTransacao)) {
      setForm((prev) => ({ ...prev, categoriaId: "" }));
    }
  }, [categorias, form.categoriaId, form.tipo]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function limparFormulario() {
    setForm(initialForm);
    setErro("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const descricao = form.descricao.trim();

    if (!descricao) {
      setErro("A descrição é obrigatória.");
      return;
    }

    if (descricao.length > 400) {
      setErro("A descrição deve ter no máximo 400 caracteres.");
      return;
    }

    if (form.valor === "") {
      setErro("O valor é obrigatório.");
      return;
    }

    const valor = Number(form.valor);

    if (Number.isNaN(valor) || valor <= 0) {
      setErro("O valor deve ser maior que zero.");
      return;
    }

    if (form.tipo === "") {
      setErro("Selecione o tipo da transação.");
      return;
    }

    if (!form.pessoaId) {
      setErro("Selecione a pessoa.");
      return;
    }

    if (!form.categoriaId) {
      setErro("Selecione a categoria.");
      return;
    }

    const tipo = Number(form.tipo) as TipoTransacao;
    const pessoa = pessoas.find((item) => item.id === form.pessoaId);
    const categoria = categorias.find((item) => item.id === form.categoriaId);

    if (!pessoa) {
      setErro("A pessoa selecionada não foi encontrada.");
      return;
    }

    if (!categoria) {
      setErro("A categoria selecionada não foi encontrada.");
      return;
    }

    if (pessoa.idade < 18 && tipo === 2) {
      setErro("Para menores de idade, apenas despesas são permitidas.");
      return;
    }

    if (!categoriaCompativel(categoria.finalidade, tipo)) {
      setErro("A categoria selecionada não é compatível com o tipo da transação.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setMensagem("");

      await transacoesService.criar({
        descricao,
        valor,
        tipo,
        pessoaId: form.pessoaId,
        categoriaId: form.categoriaId,
      });

      setMensagem("Transação cadastrada com sucesso.");
      limparFormulario();
      await carregarDados();
    } catch (error: unknown) {
      setErro(MensagemErro(error, "Não foi possível salvar a transação."));
    } finally {
      setSalvando(false);
    }
  }

  function obterPessoaNome(pessoaId: string) {
    return pessoas.find((pessoa) => pessoa.id === pessoaId)?.nome ?? "Pessoa não encontrada";
  }

  function obterCategoriaDescricao(categoriaId: string) {
    return categorias.find((categoria) => categoria.id === categoriaId)?.descricao ?? "Categoria não encontrada";
  }

  function obterClasseTipo(tipo: TipoTransacao) {
    if (tipo === 1) {
      return "bg-[#BB0002]/10 text-[#BB0002] border-[#BB0002]/20";
    }

    return "bg-[#297C07]/10 text-[#297C07] border-[#297C07]/20";
  }

  const semCadastrosBase = pessoas.length === 0 || categorias.length === 0;

  return (
    <section className="flex h-full flex-col gap-6">
      <div className="shrink-0">
        <h2 className="text-3xl font-bold text-[#00396A]">Transações</h2>
        <p className="mt-1 text-gray-500">
          Cadastro e listagem de transações de despesas e receitas.
        </p>
      </div>

      <div className="shrink-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[#00396A]">Nova transação</h3>

        {semCadastrosBase && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Cadastre ao menos uma pessoa e uma categoria antes de criar transações.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="min-w-62.5 flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Descrição</label>
            <input
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              maxLength={400}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-[#0872C9] focus:ring-1 focus:ring-[#0872C9]"
              placeholder="Digite a descrição"
            />
          </div>

          <div className="w-40">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Valor</label>
            <input
              name="valor"
              type="number"
              min="0.01"
              step="0.01"
              value={form.valor}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-[#0872C9] focus:ring-1 focus:ring-[#0872C9]"
              placeholder="Ex: 150,50"
            />
          </div>

          <div className="min-w-62.5 flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Pessoa</label>
            <select
              name="pessoaId"
              value={form.pessoaId}
              onChange={handleChange}
              disabled={pessoas.length === 0}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-[#0872C9] focus:ring-1 focus:ring-[#0872C9] disabled:bg-gray-100"
            >
              <option value="">Selecione uma pessoa</option>
              {pessoas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="w-48">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Tipo</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              disabled={semCadastrosBase}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-[#0872C9] focus:ring-1 focus:ring-[#0872C9] disabled:bg-gray-100"
            >
              <option value="">Selecione o tipo</option>
              {/* Para menores de idade, a interface já restringe a seleção ao único tipo permitido (despesa) pela regra de negócio */}
              {tiposTransacao
                .filter((tipo) => !pessoaMenorDeIdade || tipo.value === 1)
                .map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
            </select>
          </div>

          <div className="min-w-62.5 flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Categorias</label>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              disabled={categorias.length === 0}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-[#0872C9] focus:ring-1 focus:ring-[#0872C9] disabled:bg-gray-100"
            >
              <option value="">Selecione uma categoria</option>
              {/* Exibe somente categorias compatíveis com o tipo para reduzir erros de preenchimento antes do envio */}
              {categoriasDisponiveis.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.descricao} ({finalidadeCategoriaLabel[categoria.finalidade]})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={salvando || semCadastrosBase}
              className="h-11.5 rounded-xl bg-[#0872C9] px-6 font-medium text-white transition hover:bg-[#00396A] disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Cadastrar"}
            </button>
            <button
              type="button"
              onClick={limparFormulario}
              className="h-11.5 rounded-xl border border-gray-300 bg-white px-6 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Limpar
            </button>
          </div>
        </form>

        {pessoaMenorDeIdade && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            A pessoa selecionada é menor de idade. Apenas transações do tipo despesa estão liberadas.
          </div>
        )}

        {erro && (
          <div className="mt-4 rounded-xl border border-[#BB0002]/20 bg-[#BB0002]/5 px-4 py-3 text-sm text-[#BB0002]">
            {erro}
          </div>
        )}
      </div>

      <div className="flex min-h-75 flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h3 className="text-lg font-semibold text-[#00396A]">Lista de transações</h3>
          <button
            onClick={carregarDados}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Atualizar
          </button>
        </div>

        {carregando ? (
          <p className="text-gray-500">Carregando transações...</p>
        ) : transacoes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Nenhuma transações cadastrada até o momento.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pessoa</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoria</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="bg-white transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{transacao.descricao}</td>
                    <td className="px-4 py-3 text-gray-600">{obterPessoaNome(transacao.pessoaId)}</td>
                    <td className="px-4 py-3 text-gray-600">{obterCategoriaDescricao(transacao.categoriaId)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${obterClasseTipo(transacao.tipo)}`}>
                        {tipoTransacaoLabel[transacao.tipo]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {formatCurrency(transacao.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mensagem && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800 shadow-xl transition-all">
          <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {mensagem}
        </div>
      )}
    </section>
  );
}