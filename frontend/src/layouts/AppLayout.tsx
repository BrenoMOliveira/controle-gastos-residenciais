import { Link, Outlet, useLocation } from "react-router-dom";

const links = [
  { to: "/pessoas", label: "Pessoas" },
  { to: "/categorias", label: "Categorias" },
  { to: "/transacoes", label: "Transações" },
  { to: "/relatorios", label: "Relatórios" },
];

export default function AppLayout() {
  const location = useLocation();

  return (

    <div className="flex h-screen w-full bg-[#F5F5F5] text-gray-800 font-sans overflow-hidden">
      
      <aside className="w-64 shrink-0 flex flex-col border-r border-gray-200 bg-white p-6 shadow-sm z-10">
        <h1 className="mb-8 text-2xl font-bold text-[#00396A]">
          Controle de Gastos
        </h1>

        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#0872C9] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#0872C9]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}