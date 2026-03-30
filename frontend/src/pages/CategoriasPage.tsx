import { useEffect, useState } from "react";
import { categoriasService } from "../services/categorias.service";
import type { Categoria, FinalidadeCategoria } from "../types/categoria";
import { finalidadeCategoriaLabel } from "../utils/enums";
import { MensagemErro } from "../utils/errors";

type FormState = {
  descricao: string;
  finalidade: string;
};

const initialForm: FormState = {
  descricao: "",
  finalidade: "",
};

const finalidades: Array<{ value: FinalidadeCategoria; label: string }> = [
  { value: 1, label: "Despesa" },
  { value: 2, label: "Receita" },
  { value: 3, label: "Ambas" },
];

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [filtroFinalidade, setFiltroFinalidade] = useState<number | null>(null);

  async function carregarCategorias() {
    try {
      setCarregando(true);
      setErro("");

      const data = await categoriasService.listar();
      setCategorias(data);
    } catch {
      setErro("Não foi possível carregar as categorias.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    // Busca as categorias ao abrir a página para sincronizar a listagem com o estado atual do back-end
    carregarCategorias();
  }, []);

  useEffect(() => {
    // Limpa a mensagem transitória após a confirmação visual do cadastro realizado com sucesso
    if (!mensagem) return;
    const timer = setTimeout(() => setMensagem(""), 3000);
    return () => clearTimeout(timer);
  }, [mensagem]);

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

    if (form.finalidade === "") {
      setErro("Por favor, selecione uma finalidade.");
      return;
    }

    const finalidade = Number(form.finalidade) as FinalidadeCategoria;

    if (![1, 2, 3].includes(finalidade)) {
      setErro("Selecione uma finalidade válida.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setMensagem("");

      await categoriasService.criar({ descricao, finalidade });

      setMensagem(`Categoria cadastrada com sucesso.`);
      limparFormulario();
      await carregarCategorias();
    } catch (error: unknown) {
      setErro(MensagemErro(error, "Não foi possível salvar a categoria."));
    } finally {
      setSalvando(false);
    }
  }

  // Mantém a filtragem em memória para alternar rapidamente entre finalidades sem nova chamada à API
  const categoriasFiltradas = categorias.filter((cat) => {
    if (filtroFinalidade === null) return true;
    return cat.finalidade === filtroFinalidade;
  });

  function obterCoresTag(finalidade: number) {
    switch (finalidade) {
      case 1: 
        return "bg-[#BB0002]/10 text-[#BB0002] border-[#BB0002]/20";
      case 2:
        return "bg-[#297C07]/10 text-[#297C07] border-[#297C07]/20";
      case 3: 
        return "bg-[#0872C9]/10 text-[#0872C9] border-[#0872C9]/20";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }

  return (
    <section className="flex h-full flex-col gap-6">
      <div className="shrink-0">
        <h2 className="text-3xl font-bold text-[#00396A]">Categorias</h2>
        <p className="mt-1 text-gray-500">
          Cadastro e listagem de categorias para despesas e receitas.
        </p>
      </div>

      <div className="shrink-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[#00396A]">Nova categoria</h3>

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

          <div className="w-60">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Finalidade</label>
            <select
              name="finalidade"
              value={form.finalidade}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-[#0872C9] focus:ring-1 focus:ring-[#0872C9]"
            >
              <option value="">Selecione uma finalidade</option>
              {finalidades.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={salvando}
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

        {erro && (
          <div className="mt-4 rounded-xl border border-[#BB0002]/20 bg-[#BB0002]/5 px-4 py-3 text-sm text-[#BB0002]">
            {erro}
          </div>
        )}
      </div>

      <div className="flex min-h-75 flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        
        <div className="mb-4 flex flex-col items-start justify-between gap-4 shrink-0 sm:flex-row sm:items-center">
          <h3 className="text-lg font-semibold text-[#00396A]">Lista de categorias</h3>

          {/* Os botões funcionam como abas de filtro para destacar apenas a finalidade desejada na tabela */}
          <div className="flex items-center rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setFiltroFinalidade(null)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${filtroFinalidade === null ? "bg-white text-[#00396A] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroFinalidade(2)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${filtroFinalidade === 2 ? "bg-white text-[#297C07] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFiltroFinalidade(1)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${filtroFinalidade === 1 ? "bg-white text-[#BB0002] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Despesas
            </button>
            <button
              onClick={() => setFiltroFinalidade(3)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${filtroFinalidade === 3 ? "bg-white text-[#0872C9] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Ambas
            </button>
          </div>

          <button
            onClick={carregarCategorias}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Atualizar
          </button>
        </div>

        {carregando ? (
          <p className="text-gray-500">Carregando categorias...</p>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Nenhuma categoria encontrada para este filtro.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-48">Finalidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categoriasFiltradas.map((categoria) => (
                  <tr key={categoria.id} className="bg-white transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{categoria.descricao}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${obterCoresTag(categoria.finalidade)}`}>
                        {finalidadeCategoriaLabel[categoria.finalidade]}
                      </span>
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