import { BrowserRouter, Route, Routes } from "react-router-dom";

import { BudgetsPage } from "./pages/BudgetsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { ExpenseAddPage } from "./pages/ExpenseAddPage";
import { IncomePage } from "./pages/IncomePage";
import { CategoryAddPage } from "./pages/CategoryAddPage";
import { IncomeAddPage } from "./pages/IncomeAddPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/income/add" element={<IncomeAddPage />} />
        <Route path="/categories/add" element={<CategoryAddPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/expenses/add" element={<ExpenseAddPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
