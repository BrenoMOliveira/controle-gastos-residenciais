import { useEffect, useState } from "react";
import { pessoasService } from "../services/pessoas.service";
import type { Pessoa } from "../types/pessoa";
import { ModalConfirmacao } from "../components/ModalConfirmacao";
import { MensagemErro } from "../utils/errors";

type FormState = {
  nome: string;
  idade: string;
};

const initialForm: FormState = {
  nome: "",
  idade: "",
};

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [excluirPessoa, setExcluirPessoa] = useState<Pessoa | null>(null);
  const [excluir, setExcluir] = useState(false);

  async function carregarPessoas() {
    try {
      setCarregando(true);
      setErro("");

      const data = await pessoasService.listar();
      setPessoas(data);
    } catch {
      setErro("Não foi possível carregar as pessoas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPessoas();
  }, []);

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => {
        setMensagem("");
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    let valorTratado = value;

    if (name === "nome") {
      valorTratado = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    }
    setForm((prev) => ({ ...prev, [name]: valorTratado }));
  }

  function limparFormulario() {
    setForm(initialForm);
    setEditandoId(null);
    setErro("");
  }

  // As validações básicas são feitas no front para melhorar a experiência do usuário
  // Mesmo assim, o back-end continua sendo a fonte final de validação
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nome = form.nome.trim();
    
    if (!nome) {
      setErro("O nome é obrigatório.");
      return;
    }

    // Number("") retorna 0 em JavaScript
    // Por isso a idade vazia é validada antes da conversão para número
    if (form.idade === "") {
      setErro("A idade é obrigatória.");
      return;
    }
    
    const idade = Number(form.idade);

    if (isNaN(idade) || idade < 0) {
      setErro("A idade deve ser um número inteiro maior ou igual a zero.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setMensagem("");

      const payload = {
        nome,
        idade
      };

      if (editandoId) {
        await pessoasService.atualizar(editandoId, payload);
        setMensagem(`${payload.nome} atualizado(a) com sucesso.`);
      } else {
        await pessoasService.criar(payload);
        setMensagem(`${payload.nome} cadastrado(a) com sucesso.`);
      }

      limparFormulario();
      await carregarPessoas();
    } catch (error: unknown) {
      setErro(MensagemErro(error, "Não foi possível salvar a pessoa."));
    } finally {
      setSalvando(false);
    }
  }

  function handleEditar(pessoa: Pessoa) {
    setEditandoId(pessoa.id);
    setForm({
      nome: pessoa.nome,
      idade: String(pessoa.idade),
    });
    setMensagem("");
    setErro("");
  }

  // Essa função apenas abre o modal
  function abrirModalExclusao(pessoa: Pessoa) {
    setExcluirPessoa(pessoa);
  }


  // Essa função faz o trabalho pesado de ir na API
  async function confirmarExclusao() {
    if (!excluirPessoa) return;

    try {
      setExcluir(true);
      setErro("");
      setMensagem("");

      await pessoasService.excluir(excluirPessoa.id);
      setMensagem(`${excluirPessoa.nome} excluído(a) com sucesso.`);
      await carregarPessoas();

      if (editandoId === excluirPessoa.id) {
        limparFormulario();
      }
    } catch (error: unknown) {
      setErro(MensagemErro(error, "Não foi possível excluir a pessoa."));
    } finally {
      setExcluir(false);
      setExcluirPessoa(null);
    }
  }

return (
    <section className="flex h-full flex-col gap-6">
      
      <div className="shrink-0">
        <h2 className="text-3xl font-bold text-[#00396A]">Pessoas</h2>
        <p className="mt-1 text-gray-500">
          Cadastro, edição, listagem e exclusão de pessoas.
        </p>
      </div>

      <div className="shrink-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[#00396A]">
          {editandoId ? "Editar pessoa" : "Nova pessoa"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-62.5">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              maxLength={200}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-[#0872C9] focus:ring-1 focus:ring-[#0872C9]"
              placeholder="Digite o nome"
            />
          </div>

          <div className="w-32">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Idade</label>
            <input
              name="idade"
              type="number"
              min={0}
              value={form.idade}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-[#0872C9] focus:ring-1 focus:ring-[#0872C9]"
              placeholder="Ex: 30"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={salvando}
              className="h-11.5 rounded-xl bg-[#0872C9] px-6 font-medium text-white transition hover:bg-[#00396A] disabled:opacity-60"
            >
              {salvando ? "Salvando..." : editandoId ? "Salvar" : "Cadastrar"}
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
        <div className="mb-4 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-[#00396A]">Lista de pessoas</h3>
          <button
            onClick={carregarPessoas}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Atualizar
          </button>
        </div>

        {carregando ? (
          <p className="text-gray-500">Carregando pessoas...</p>
        ) : pessoas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Nenhuma pessoa cadastrada até o momento.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Idade</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pessoas.map((pessoa) => (
                  <tr key={pessoa.id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-800">{pessoa.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{pessoa.idade}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditar(pessoa)}
                          className="rounded-lg bg-[#F7A025] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#D39711]"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => abrirModalExclusao(pessoa)}
                          className="rounded-lg bg-[#BB0002] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-800"
                        >
                          Excluir
                        </button>
                      </div>
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

      <ModalConfirmacao
        // A confirmação deixa explícito para o usuário que excluir uma pessoa
        // também remove suas transações vinculadas
        isOpen={excluirPessoa !== null}
        titulo="Excluir pessoa"
        mensagem={`Tem certeza que deseja excluir ${excluirPessoa?.nome}? 
                   As transações vinculadas a esta pessoa também serão apagadas permanentemente.`}
        onConfirm={confirmarExclusao}
        onCancel={() => setExcluirPessoa(null)}
        carregando={excluir}
      />
    </section>
  );
}