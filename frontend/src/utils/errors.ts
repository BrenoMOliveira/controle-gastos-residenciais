import axios from "axios";

export function MensagemErro(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    let mensagemErro = data?.Mensagem || data?.mensagem;

    if (mensagemErro === "Erro de validação." && data?.Erros && Array.isArray(data.Erros) && data.Erros.length > 0) {
      const valoresDoErro = Object.values(data.Erros[0]);
      if (valoresDoErro.length > 0) mensagemErro = String(valoresDoErro[valoresDoErro.length - 1]);
    } else if (!mensagemErro && data?.errors && typeof data.errors === "object") {
      const chavesErro = Object.keys(data.errors);
      if (chavesErro.length > 0) {
        const erroNativo = data.errors[chavesErro[0]];
        mensagemErro = Array.isArray(erroNativo) ? erroNativo[0] : erroNativo;
      }
    }
    return mensagemErro || "Erro ao comunicar com o servidor.";
  }
  return error instanceof Error ? error.message : fallback;
}