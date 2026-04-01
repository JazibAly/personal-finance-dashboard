import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiscalAppShell } from "../components/fiscal/FiscalAppShell";
import { createCategory, createIncomeSource } from "../services/api";

const DEFAULT_USER_ID = 1;

export function CategoryAddPage() {
  const navigate = useNavigate();
  const [formCategoryName, setFormCategoryName] = useState("");
  const [formCategoryType, setFormCategoryType] = useState("expense"); // typical choice
  const [formBusy, setFormBusy] = useState(false);
  const [formMsg, setFormMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmitCategory(e) {
    e.preventDefault();
    setFormBusy(true);
    setFormMsg("");
    setErrorMsg("");

    const name = formCategoryName.trim();
    if (!name) {
      setErrorMsg("Please enter a category name.");
      setFormBusy(false);
      return;
    }

    try {
      if (formCategoryType === "income") {
        await createIncomeSource({ user_id: DEFAULT_USER_ID, name });
      } else {
        await createCategory({
          user_id: DEFAULT_USER_ID,
          name,
          type: formCategoryType, 
        });
      }
      
      setFormMsg("Category created successfully!");
      setFormCategoryName("");
      
      // Navigate back to the previous screen (like IncomeAdd or ExpenseAdd)
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not create category.");
    } finally {
      setFormBusy(false);
    }
  }

  return (
    <FiscalAppShell headerMode="date" headerTone="default" dateLabel="Today">
      <div className="mx-auto flex max-w-[600px] flex-col gap-10 px-8 py-12">
        <div>
          <h1 className="font-['Manrope',system-ui,sans-serif] text-4xl font-extrabold tracking-[-2px] text-[#003526]">
            Add New Category
          </h1>
          <p className="mt-2 text-sm text-[#404944]">
            Organize and classify your financial transactions.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)] lg:p-12">
          <form className="flex flex-col gap-8" onSubmit={onSubmitCategory}>
            <div className="flex flex-col gap-2">
              <label htmlFor="categoryName" className="text-sm font-bold uppercase tracking-wide text-[#404944]">
                Category Name
              </label>
              <input
                id="categoryName"
                className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#003526]"
                placeholder="e.g. Groceries, Entertainment..."
                value={formCategoryName}
                onChange={(e) => setFormCategoryName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wide text-[#404944]">
                Classification
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormCategoryType("expense")}
                  className={`rounded-xl px-5 py-4 text-sm font-bold transition ${
                    formCategoryType === "expense"
                      ? "bg-[#003526] text-white"
                      : "bg-[#f2f4f6] text-[#404944] hover:bg-[#e6e8ea]"
                  }`}
                >
                  Expense Category
                </button>
                <button
                  type="button"
                  onClick={() => setFormCategoryType("income")}
                  className={`rounded-xl px-5 py-4 text-sm font-bold transition ${
                    formCategoryType === "income"
                      ? "bg-[#003526] text-white"
                      : "bg-[#f2f4f6] text-[#404944] hover:bg-[#e6e8ea]"
                  }`}
                >
                  Income Source
                </button>
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
                Create Category
              </button>
            </div>
            
            <button
               type="button"
               onClick={() => navigate(-1)}
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
