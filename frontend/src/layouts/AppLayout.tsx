import { Link, Outlet, useLocation } from "react-router-dom";

const links = [
  { to: "/pessoas", label: "Pessoas" },
  { to: "/categorias", label: "Categorias" },
  { to: "/transacoes", label: "Transações" },
  { to: "/relatorios", label: "Relatórios" },
];

// Layout principal da aplicação
// Mantém a navegação fixa à esquerda e a área de conteúdo à direita
export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
          <h1 className="mb-8 text-2xl font-bold">Controle de Gastos</h1>

          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}