import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import PessoasPage from "../pages/PessoasPage";
import CategoriasPage from "../pages/CategoriasPage";
import TransacoesPage from "../pages/TransacoesPage";
import RelatoriosPage from "../pages/RelatoriosPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/pessoas" replace />} />
        <Route path="/pessoas" element={<PessoasPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/transacoes" element={<TransacoesPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
      </Route>
    </Routes>
  );
}