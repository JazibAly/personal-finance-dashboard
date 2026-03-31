import { useMemo, useState } from "react";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const inputClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelClass = "grid gap-1.5 text-sm font-medium text-ink";
const btnPrimary =
  "rounded-xl border border-brand bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60";
const btnSecondary =
  "rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-sm hover:bg-slate-50";
const btnDanger =
  "rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100";

export function FormsPanel({
  userId,
  categories,
  incomeSources,
  onCreateCategory,
  onCreateExpense,
  onCreateIncomeSource,
  onCreateIncome,
  onUpdateIncomeSource,
  onDeleteIncomeSource,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    monthly_budget: 0,
    color: "#2563eb",
  });

  const [expenseForm, setExpenseForm] = useState({
    amount: 0,
    category_id: "",
    date: todayIso(),
    description: "",
    payment_method: "",
  });

  const [incomeSourceForm, setIncomeSourceForm] = useState({ name: "" });

  const [incomeForm, setIncomeForm] = useState({
    amount: 0,
    source_id: "",
    date: todayIso(),
    description: "",
  });

  const categoryOptions = useMemo(() => categories ?? [], [categories]);
  const sourceOptions = useMemo(() => incomeSources ?? [], [incomeSources]);

  async function run(action) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await action();
      setSuccess("Saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card" aria-label="Add entries">
      <div>
        <h2 className="text-base font-semibold text-ink">Add entries</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Create categories, expenses, income sources, and income. Existing API flows are unchanged.
        </p>
      </div>

      {(error || success) && (
        <p
          className={`mt-4 rounded-xl px-3 py-2 text-sm font-medium ${
            error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {error ? error : success}
        </p>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <form
          className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await onCreateCategory({
                user_id: userId,
                name: categoryForm.name.trim(),
                monthly_budget: Number(categoryForm.monthly_budget || 0),
                color: categoryForm.color || "#2563eb",
              });
              setCategoryForm({ name: "", monthly_budget: 0, color: "#2563eb" });
            });
          }}
        >
          <h3 className="text-sm font-semibold text-ink">Add category</h3>
          <label className={labelClass}>
            Name
            <input
              required
              className={inputClass}
              value={categoryForm.name}
              onChange={(e) => setCategoryForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Food"
            />
          </label>
          <label className={labelClass}>
            Monthly budget
            <input
              type="number"
              step="0.01"
              className={inputClass}
              value={categoryForm.monthly_budget}
              onChange={(e) =>
                setCategoryForm((s) => ({ ...s, monthly_budget: e.target.value }))
              }
            />
          </label>
          <label className={labelClass}>
            Color
            <input
              type="color"
              className={`${inputClass} h-11 p-1`}
              value={categoryForm.color}
              onChange={(e) => setCategoryForm((s) => ({ ...s, color: e.target.value }))}
            />
          </label>
          <button type="submit" className={`${btnPrimary} mt-auto w-full`} disabled={busy}>
            Create
          </button>
        </form>

        <form
          className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await onCreateExpense({
                user_id: userId,
                amount: Number(expenseForm.amount || 0),
                category_id: Number(expenseForm.category_id),
                date: expenseForm.date,
                description: expenseForm.description || null,
                payment_method: expenseForm.payment_method || null,
              });
              setExpenseForm((s) => ({
                ...s,
                amount: 0,
                description: "",
                payment_method: "",
              }));
            });
          }}
        >
          <h3 className="text-sm font-semibold text-ink">Add expense</h3>
          <label className={labelClass}>
            Amount
            <input
              required
              type="number"
              step="0.01"
              className={inputClass}
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm((s) => ({ ...s, amount: e.target.value }))}
            />
          </label>
          <label className={labelClass}>
            Category
            <select
              required
              className={inputClass}
              value={expenseForm.category_id}
              onChange={(e) => setExpenseForm((s) => ({ ...s, category_id: e.target.value }))}
            >
              <option value="" disabled>
                Select…
              </option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Date
            <input
              required
              type="date"
              className={inputClass}
              value={expenseForm.date}
              onChange={(e) => setExpenseForm((s) => ({ ...s, date: e.target.value }))}
            />
          </label>
          <label className={labelClass}>
            Description
            <input
              className={inputClass}
              value={expenseForm.description}
              onChange={(e) => setExpenseForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Groceries"
            />
          </label>
          <label className={labelClass}>
            Payment method
            <input
              className={inputClass}
              value={expenseForm.payment_method}
              onChange={(e) =>
                setExpenseForm((s) => ({ ...s, payment_method: e.target.value }))
              }
              placeholder="Card / Cash / UPI"
            />
          </label>
          <button
            type="submit"
            className={`${btnPrimary} mt-auto w-full`}
            disabled={busy || categoryOptions.length === 0}
          >
            {categoryOptions.length === 0 ? "Add a category first" : "Create"}
          </button>
        </form>

        <form
          className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await onCreateIncomeSource({
                user_id: userId,
                name: incomeSourceForm.name.trim(),
              });
              setIncomeSourceForm({ name: "" });
            });
          }}
        >
          <h3 className="text-sm font-semibold text-ink">Add income source</h3>
          <label className={labelClass}>
            Name
            <input
              required
              className={inputClass}
              value={incomeSourceForm.name}
              onChange={(e) => setIncomeSourceForm({ name: e.target.value })}
              placeholder="Salary"
            />
          </label>
          <button type="submit" className={`${btnPrimary} mt-auto w-full`} disabled={busy}>
            Create
          </button>
        </form>

        <form
          className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await onCreateIncome({
                user_id: userId,
                source_id: Number(incomeForm.source_id),
                amount: Number(incomeForm.amount || 0),
                date: incomeForm.date,
                description: incomeForm.description || null,
              });
              setIncomeForm((s) => ({ ...s, amount: 0, description: "" }));
            });
          }}
        >
          <h3 className="text-sm font-semibold text-ink">Add income</h3>
          <label className={labelClass}>
            Amount
            <input
              required
              type="number"
              step="0.01"
              className={inputClass}
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm((s) => ({ ...s, amount: e.target.value }))}
            />
          </label>
          <label className={labelClass}>
            Source
            <select
              required
              className={inputClass}
              value={incomeForm.source_id}
              onChange={(e) => setIncomeForm((s) => ({ ...s, source_id: e.target.value }))}
            >
              <option value="" disabled>
                Select…
              </option>
              {sourceOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Date
            <input
              required
              type="date"
              className={inputClass}
              value={incomeForm.date}
              onChange={(e) => setIncomeForm((s) => ({ ...s, date: e.target.value }))}
            />
          </label>
          <label className={labelClass}>
            Description
            <input
              className={inputClass}
              value={incomeForm.description}
              onChange={(e) => setIncomeForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="March salary"
            />
          </label>
          <button
            type="submit"
            className={`${btnPrimary} mt-auto w-full`}
            disabled={busy || sourceOptions.length === 0}
          >
            {sourceOptions.length === 0 ? "Add an income source first" : "Create"}
          </button>
        </form>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="text-sm font-semibold text-ink">Manage income sources</h3>
        {sourceOptions.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">No income sources added yet.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {sourceOptions.map((source) => (
              <li
                key={source.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2"
              >
                <span className="font-medium text-ink">{source.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={btnSecondary}
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        const nextName = window.prompt("Update income source name", source.name);
                        if (nextName === null || nextName.trim() === "") return;
                        await onUpdateIncomeSource(source.id, { name: nextName.trim() });
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={btnDanger}
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        const ok = window.confirm(`Delete income source "${source.name}"?`);
                        if (!ok) return;
                        await onDeleteIncomeSource(source.id);
                      })
                    }
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
