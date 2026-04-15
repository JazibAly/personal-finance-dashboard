import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { BudgetsPage } from "./pages/BudgetsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { ExpenseAddPage } from "./pages/ExpenseAddPage";
import { IncomePage } from "./pages/IncomePage";
import { BudgetAddPage } from "./pages/BudgetAddPage";
import { CategoryAddPage } from "./pages/CategoryAddPage";
import { IncomeAddPage } from "./pages/IncomeAddPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#f7f9fb]">Loading secure area...</div>;
  }
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/income" element={<ProtectedRoute><IncomePage /></ProtectedRoute>} />
          <Route path="/income/add" element={<ProtectedRoute><IncomeAddPage /></ProtectedRoute>} />
          <Route path="/categories/add" element={<ProtectedRoute><CategoryAddPage /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
          <Route path="/expenses/add" element={<ProtectedRoute><ExpenseAddPage /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
          <Route path="/budgets/add" element={<ProtectedRoute><BudgetAddPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
