import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiscalAppShell } from "../components/fiscal/FiscalAppShell";
import { createExpense, getCategories } from "../services/api";

const DEFAULT_USER_ID = 1;

export function ExpenseAddPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [formBusy, setFormBusy] = useState(false);
  const [formMsg, setFormMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getCategories(DEFAULT_USER_ID)
      .then(setCategories)
      .catch((e) => console.error("Failed to load categories", e));
  }, []);

  async function postExpense(e) {
    e.preventDefault();
    setFormBusy(true);
    setFormMsg("");
    setErrorMsg("");
    
    const amt = Number(amount);
    const desc = title.trim();
    if (!categoryId || !desc || !Number.isFinite(amt) || amt <= 0) {
      setErrorMsg("Please enter a title, choose a category, and specify a valid amount.");
      setFormBusy(false);
      return;
    }

    try {
      await createExpense({
        user_id: DEFAULT_USER_ID,
        category_id: Number(categoryId),
        amount: amt,
        date,
        description: desc, // Using title as description
        payment_method: paymentMethod.trim() || null,
      });
      setFormMsg("Expense posted successfully!");
      setAmount("");
      setTitle("");
      setPaymentMethod("");
      
      setTimeout(() => {
        navigate("/expenses");
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not post expense.");
    } finally {
      setFormBusy(false);
    }
  }

  return (
    <FiscalAppShell headerMode="date" headerTone="default" dateLabel="Today">
      <div className="mx-auto flex max-w-[800px] flex-col gap-10 px-8 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Manrope',system-ui,sans-serif] text-4xl font-extrabold tracking-[-2px] text-[#003526]">
              Add Expense
            </h1>
            <p className="mt-2 text-sm text-[#404944]">
              Log a new commitment to your ledger.
            </p>
          </div>
          <Link
            to="/categories/add"
            className="rounded-full bg-[#f2f4f6] px-5 py-2.5 text-sm font-semibold text-[#003526] transition hover:bg-[#e6e8ea]"
          >
            + Add Category
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)] lg:p-12">
          <form className="flex flex-col gap-8" onSubmit={postExpense}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-sm font-bold uppercase tracking-wide text-[#404944]">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#64748b]">$</span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    className="w-full rounded-xl border-0 bg-[#f7f9fb] pl-10 pr-5 py-4 text-base font-medium outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-sm font-bold uppercase tracking-wide text-[#404944]">
                  Category
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
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-bold uppercase tracking-wide text-[#404944]">
                Title
              </label>
              <input
                id="title"
                className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#003526]"
                placeholder="e.g. Car Fuel, Team Lunch..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="method" className="text-sm font-bold uppercase tracking-wide text-[#404944]">
                  Payment Method
                </label>
                <input
                  id="method"
                  className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                  placeholder="e.g. Platinum Card, Cash"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-sm font-bold uppercase tracking-wide text-[#404944]">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                Post Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </FiscalAppShell>
  );
}
