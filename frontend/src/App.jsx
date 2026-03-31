import { BrowserRouter, Route, Routes } from "react-router-dom";

import { BudgetsPage } from "./pages/BudgetsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { IncomePage } from "./pages/IncomePage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
