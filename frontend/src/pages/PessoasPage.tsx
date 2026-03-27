import { useEffect, useState } from "react";
import { pessoasService } from "../services/pessoas.service";
import type { Pessoa } from "../types/pessoa";
import axios from "axios";
import { ModalConfirmacao } from "../components/ModalConfirmacao";

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
      setSalvando(false);
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        let mensagemErro = data?.Mensagem || data?.mensagem;

        if (mensagemErro === "Erro de validação." && data?.Erros && Array.isArray(data.Erros) && data.Erros.length > 0) {
          const primeiroErro = data.Erros[0];
          const valoresDoErro = Object.values(primeiroErro);

          if (valoresDoErro.length > 0) {
            mensagemErro = String(valoresDoErro[valoresDoErro.length - 1]); // Pega a string do erro
          }
        } 
        else if (!mensagemErro && data?.errors && typeof data.errors === 'object') {
          const chavesErro = Object.keys(data.errors);
          if (chavesErro.length > 0) {
            const erroNativo = data.errors[chavesErro[0]];
            mensagemErro = Array.isArray(erroNativo) ? erroNativo[0] : erroNativo;
          }
        }
        setErro(mensagemErro || "Erro ao comunicar com o servidor.");
        return;
      }
      if (error instanceof Error) {
        setErro(error.message);
        return;
      }
      setErro("Não foi possível salvar a pessoa.");
    }
    finally {
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
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        let mensagemErro = data?.Mensagem || data?.mensagem;

        if (mensagemErro === "Erro de validação." && data?.Erros && Array.isArray(data.Erros) && data.Erros.length > 0) {
          const valoresDoErro = Object.values(data.Erros[0]);
          if (valoresDoErro.length > 0) mensagemErro = String(valoresDoErro[valoresDoErro.length - 1]);
        } else if (!mensagemErro && data?.errors && typeof data.errors === 'object') {
          const chavesErro = Object.keys(data.errors);
          if (chavesErro.length > 0) {
            const erroNativo = data.errors[chavesErro[0]];
            mensagemErro = Array.isArray(erroNativo) ? erroNativo[0] : erroNativo;
          }
        }
        
        setErro(mensagemErro || "Erro ao comunicar com o servidor para excluir.");
        return;
      }
      
      if (error instanceof Error) {
        setErro(error.message);
        return;
      }
      setErro("Não foi possível excluir a pessoa.");
    } finally {
      setExcluir(false);
      setExcluirPessoa(null);
    }
  }

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Pessoas</h2>
        <p className="mt-2 text-slate-400">
          Cadastro, edição, listagem e exclusão de pessoas.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <h3 className="mb-6 text-xl font-semibold text-white">
            {editandoId ? "Editar pessoa" : "Nova pessoa"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Nome
              </label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                maxLength={200}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                placeholder="Digite o nome"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Idade
              </label>
              <input
                name="idade"
                type="number"
                min={0}
                value={form.idade}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                placeholder="Digite a idade"
              />
            </div>

            {erro && (
              <div className="rounded-xl border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300">
                {erro}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={salvando}
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {salvando
                  ? "Salvando..."
                  : editandoId
                  ? "Salvar alterações"
                  : "Cadastrar"}
              </button>

              <button
                type="button"
                onClick={limparFormulario}
                className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:bg-slate-800"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Lista de pessoas</h3>
            <button
              onClick={carregarPessoas}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            >
              Atualizar
            </button>
          </div>

          {carregando ? (
            <p className="text-slate-400">Carregando pessoas...</p>
          ) : pessoas.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
              Nenhuma pessoa cadastrada até o momento.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full border-collapse">
                <thead className="bg-slate-950">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                      Idade
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pessoas.map((pessoa) => (
                    <tr
                      key={pessoa.id}
                      className="border-t border-slate-800 bg-slate-900"
                    >
                      <td className="px-4 py-3 text-slate-100">{pessoa.nome}</td>
                      <td className="px-4 py-3 text-slate-300">{pessoa.idade}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditar(pessoa)}
                            className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-400"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => abrirModalExclusao(pessoa)}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500"
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
      </div>
      {mensagem && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-emerald-800 bg-emerald-950 px-5 py-4 text-sm font-medium text-emerald-300 shadow-2xl transition-all">
          <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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