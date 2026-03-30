import { useMemo, useState } from "react";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

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
    color: "#8884d8",
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
    <section className="panel">
      <h2>Add Entries</h2>
      {(error || success) && (
        <p className={error ? "error" : "success"}>{error ? error : success}</p>
      )}

      <div className="forms-grid">
        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await onCreateCategory({
                user_id: userId,
                name: categoryForm.name.trim(),
                monthly_budget: Number(categoryForm.monthly_budget || 0),
                color: categoryForm.color || "#8884d8",
              });
              setCategoryForm({ name: "", monthly_budget: 0, color: "#8884d8" });
            });
          }}
        >
          <h3>Add Category</h3>
          <label>
            Name
            <input
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Food"
            />
          </label>
          <label>
            Monthly budget
            <input
              type="number"
              step="0.01"
              value={categoryForm.monthly_budget}
              onChange={(e) =>
                setCategoryForm((s) => ({ ...s, monthly_budget: e.target.value }))
              }
            />
          </label>
          <label>
            Color
            <input
              type="color"
              value={categoryForm.color}
              onChange={(e) => setCategoryForm((s) => ({ ...s, color: e.target.value }))}
            />
          </label>
          <button disabled={busy}>Create</button>
        </form>

        <form
          className="form-card"
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
          <h3>Add Expense</h3>
          <label>
            Amount
            <input
              required
              type="number"
              step="0.01"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm((s) => ({ ...s, amount: e.target.value }))}
            />
          </label>
          <label>
            Category
            <select
              required
              value={expenseForm.category_id}
              onChange={(e) => setExpenseForm((s) => ({ ...s, category_id: e.target.value }))}
            >
              <option value="" disabled>
                Select...
              </option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              required
              type="date"
              value={expenseForm.date}
              onChange={(e) => setExpenseForm((s) => ({ ...s, date: e.target.value }))}
            />
          </label>
          <label>
            Description
            <input
              value={expenseForm.description}
              onChange={(e) => setExpenseForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Groceries"
            />
          </label>
          <label>
            Payment method
            <input
              value={expenseForm.payment_method}
              onChange={(e) =>
                setExpenseForm((s) => ({ ...s, payment_method: e.target.value }))
              }
              placeholder="Card / Cash / UPI"
            />
          </label>
          <button disabled={busy || categoryOptions.length === 0}>
            {categoryOptions.length === 0 ? "Add a category first" : "Create"}
          </button>
        </form>

        <form
          className="form-card"
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
          <h3>Add Income Source</h3>
          <label>
            Name
            <input
              required
              value={incomeSourceForm.name}
              onChange={(e) => setIncomeSourceForm({ name: e.target.value })}
              placeholder="Salary"
            />
          </label>
          <button disabled={busy}>Create</button>
        </form>

        <form
          className="form-card"
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
          <h3>Add Income</h3>
          <label>
            Amount
            <input
              required
              type="number"
              step="0.01"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm((s) => ({ ...s, amount: e.target.value }))}
            />
          </label>
          <label>
            Source
            <select
              required
              value={incomeForm.source_id}
              onChange={(e) => setIncomeForm((s) => ({ ...s, source_id: e.target.value }))}
            >
              <option value="" disabled>
                Select...
              </option>
              {sourceOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              required
              type="date"
              value={incomeForm.date}
              onChange={(e) => setIncomeForm((s) => ({ ...s, date: e.target.value }))}
            />
          </label>
          <label>
            Description
            <input
              value={incomeForm.description}
              onChange={(e) => setIncomeForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="March salary"
            />
          </label>
          <button disabled={busy || sourceOptions.length === 0}>
            {sourceOptions.length === 0 ? "Add an income source first" : "Create"}
          </button>
        </form>
      </div>

      <div className="panel-list">
        <h3>Manage Income Sources</h3>
        {sourceOptions.length === 0 ? (
          <p>No income sources added yet.</p>
        ) : (
          sourceOptions.map((source) => (
            <div key={source.id} className="list-row">
              <span>{source.name}</span>
              <div className="activity-actions">
                <button
                  type="button"
                  className="button-secondary"
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
                  className="button-danger"
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
            </div>
          ))
        )}
      </div>
    </section>
  );
}

