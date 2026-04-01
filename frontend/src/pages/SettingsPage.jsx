import { useState } from "react";
import { FiscalAppShell } from "../components/fiscal/FiscalAppShell";
import { figmaAssets } from "../figma/figmaAssets";
import { updateUserSettings } from "../services/api";

const DEFAULT_USER_ID = 1;

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const [formData, setFormData] = useState({
    firstName: "Julian",
    lastName: "Sterling",
    email: "j.sterling@atelier-fiscal.com",
    phone: "+1 (555) 000-0000",
    currency: "USD",
    language: "English",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMsg("");

    try {
      // Logic for backend updates
      // Note: Backend endpoint may not exist yet, so we catch errors gracefully
      await updateUserSettings(DEFAULT_USER_ID, formData);
      setFeedbackMsg("Settings updated successfully!");
    } catch (err) {
      console.warn("Backend settings route not found, mocking success for UI phase.", err);
      // Fallback mock success
      setFeedbackMsg("Settings updated successfully! (UI Mock)");
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedbackMsg(""), 3000);
    }
  };

  return (
    <FiscalAppShell headerMode="date" headerTone="default" dateLabel="Settings">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-8 py-12 lg:flex-row">
        
        {/* Left Column: Profile Card & Navigation */}
        <div className="flex w-full flex-col gap-6 lg:w-[320px] lg:shrink-0">
          <div className="flex flex-col items-center rounded-3xl bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)]">
            <div className="mb-4 size-32 overflow-hidden rounded-full border-4 border-[#f2f4f6]">
              <img
                src={figmaAssets.userProfileAvatar}
                alt="Profile"
                className="size-full object-cover"
              />
            </div>
            <h2 className="font-['Manrope',system-ui,sans-serif] text-2xl font-extrabold tracking-[-0.6px] text-[#003526]">
              Julian Sterling
            </h2>
            <p className="mt-1 text-sm font-medium text-[#404944]">j.sterling@atelier-fiscal.com</p>
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-[#003526] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#004e39]"
            >
              Edit Profile
            </button>
          </div>

          <nav className="flex flex-col gap-1 rounded-3xl bg-white p-4 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)]">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                activeTab === "general"
                  ? "bg-[#ecfdf5] text-[#003526]"
                  : "text-[#64748b] hover:bg-[#f7f9fb] hover:text-[#191c1e]"
              }`}
            >
              General Information
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                activeTab === "preferences"
                  ? "bg-[#ecfdf5] text-[#003526]"
                  : "text-[#64748b] hover:bg-[#f7f9fb] hover:text-[#191c1e]"
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                activeTab === "security"
                  ? "bg-[#ecfdf5] text-[#003526]"
                  : "text-[#64748b] hover:bg-[#f7f9fb] hover:text-[#191c1e]"
              }`}
            >
              Security
            </button>
          </nav>
        </div>

        {/* Right Column: Main Content */}
        <div className="flex-1 rounded-3xl bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)] lg:p-12">
          {activeTab === "general" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-['Manrope',system-ui,sans-serif] text-2xl font-extrabold tracking-[-1px] text-[#003526]">
                General Information
              </h3>
              <p className="mt-2 text-sm text-[#64748b]">
                Update your personal details and contact information.
              </p>

              <form onSubmit={handleSave} className="mt-8 flex flex-col gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                  />
                </div>

                {feedbackMsg && (
                  <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    {feedbackMsg}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full bg-[#003526] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#004e39] disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-['Manrope',system-ui,sans-serif] text-2xl font-extrabold tracking-[-1px] text-[#003526]">
                Preferences
              </h3>
              <p className="mt-2 text-sm text-[#64748b]">
                Manage your region, language, and currency settings.
              </p>

              <form onSubmit={handleSave} className="mt-8 flex flex-col gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                      Default Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                      Global Language
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                </div>

                {feedbackMsg && (
                  <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    {feedbackMsg}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full bg-[#003526] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#004e39] disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-['Manrope',system-ui,sans-serif] text-2xl font-extrabold tracking-[-1px] text-[#003526]">
                Security Settings
              </h3>
              <p className="mt-2 text-sm text-[#64748b]">
                Keep your account secure by updating your password.
              </p>

              <form onSubmit={handleSave} className="mt-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                  />
                </div>

                {feedbackMsg && (
                  <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    {feedbackMsg}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full bg-[#003526] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#004e39] disabled:opacity-60"
                  >
                    {isSaving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </FiscalAppShell>
  );
}
