import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiscalAppShell } from "../components/fiscal/FiscalAppShell";
import { getCategories, updateCategory } from "../services/api";

const DEFAULT_USER_ID = 1;

export function BudgetAddPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState(() => {
    return new URLSearchParams(location.search).get("categoryId") || "";
  });
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [formBusy, setFormBusy] = useState(false);
  const [formMsg, setFormMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getCategories(DEFAULT_USER_ID)
      .then(setCategories)
      .catch((e) => console.error("Failed to load categories", e));
  }, []);

  async function postBudget(e) {
    e.preventDefault();
    setFormBusy(true);
    setFormMsg("");
    setErrorMsg("");

    const budgetVal = Number(monthlyBudget);
    if (!categoryId || !Number.isFinite(budgetVal) || budgetVal < 0) {
      setErrorMsg("Please choose a category and enter a valid budget limit (0 or higher).");
      setFormBusy(false);
      return;
    }

    try {
      await updateCategory(categoryId, {
        monthly_budget: budgetVal,
      });
      setFormMsg("Budget allocated successfully!");
      setCategoryId("");
      setMonthlyBudget("");

      setTimeout(() => {
        navigate("/budgets");
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not post budget.");
    } finally {
      setFormBusy(false);
    }
  }

  // Pre-fill existing budget if category is selected
  useEffect(() => {
    if (categoryId) {
      const cat = categories.find((c) => String(c.id) === String(categoryId));
      if (cat && cat.monthly_budget) {
        setMonthlyBudget(String(cat.monthly_budget));
      } else {
        setMonthlyBudget("");
      }
    }
  }, [categoryId, categories]);

  return (
    <FiscalAppShell headerMode="date" headerTone="default" dateLabel="Today">
      <div className="mx-auto flex max-w-[800px] flex-col gap-10 px-8 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Manrope',system-ui,sans-serif] text-4xl font-extrabold tracking-[-2px] text-[#003526]">
              Add Budget
            </h1>
            <p className="mt-2 text-sm text-[#404944]">
              Assign monthly spending boundaries to your categories.
            </p>
          </div>
          <Link
            to="/categories/add"
            className="rounded-full bg-[#f2f4f6] px-5 py-2.5 text-sm font-semibold text-[#003526] transition hover:bg-[#e6e8ea]"
          >
            + New Category
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)] lg:p-12">
          <form className="flex flex-col gap-8" onSubmit={postBudget}>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-sm font-bold uppercase tracking-wide text-[#404944]">
                Expense Category
              </label>
              <select
                id="category"
                className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="budgetLimit" className="text-sm font-bold uppercase tracking-wide text-[#404944]">
                Monthly Limit
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#64748b]">$</span>
                <input
                  id="budgetLimit"
                  type="number"
                  step="0.01"
                  className="w-full rounded-xl border-0 bg-[#f7f9fb] pl-10 pr-5 py-4 text-base font-medium outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                  placeholder="0.00"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {errorMsg}
              </div>
            )}
            {formMsg && (
              <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                {formMsg}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={formBusy}
                className="w-full rounded-xl bg-[#003526] py-4 text-base font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-[#004e39] focus:ring-4 focus:ring-[#a6f2d1] disabled:opacity-60"
              >
                Set Tracking Limit
              </button>
            </div>
            
            <button
               type="button"
               onClick={() => navigate("/budgets")}
               className="w-full text-sm font-bold text-[#64748b] transition hover:text-[#003526]"
            >
               Cancel & Go Back
            </button>
          </form>
        </div>
      </div>
    </FiscalAppShell>
  );
}
