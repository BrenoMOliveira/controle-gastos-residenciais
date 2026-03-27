interface ModalConfirmacaoProps {
  isOpen: boolean;
  titulo: string;
  mensagem: string;
  onConfirm: () => void;
  onCancel: () => void;
  carregando?: boolean;
}

export function ModalConfirmacao({
  isOpen,
  titulo,
  mensagem,
  onConfirm,
  onCancel,
  carregando = false,
}: ModalConfirmacaoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md transform overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
        <h3 className="text-lg font-medium leading-6 text-white">
          {titulo}
        </h3>
        <div className="mt-2">
          <p className="text-sm text-slate-400 whitespace-pre-line">{mensagem}</p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            onClick={onCancel}
            disabled={carregando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
            onClick={onConfirm}
            disabled={carregando}
          >
            {carregando ? "Excluindo..." : "Sim, excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}