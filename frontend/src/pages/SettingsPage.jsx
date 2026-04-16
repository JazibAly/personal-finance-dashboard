import { useState, useEffect } from "react";
import { FiscalAppShell } from "../components/fiscal/FiscalAppShell";
import { figmaAssets } from "../figma/figmaAssets";
import { updateUserProfile, changePassword } from "../services/api";
import { useAuth } from "../context/AuthContext";

export function SettingsPage() {
  const { user, updateUserLocal } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: "", type: "success" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currency: "USD",
    language: "English",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone_number || "",
        currency: "USD", // Defaults for now
        language: "English",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));
  };

  const showFeedback = (text, type = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg({ text: "", type: "success" }), 4000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone,
      };
      const updatedUser = await updateUserProfile(payload);
      updateUserLocal(updatedUser);
      showFeedback("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      showFeedback("Failed to update profile. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      showFeedback("New passwords do not match.", "error");
      return;
    }
    if (!securityData.currentPassword || !securityData.newPassword) {
      showFeedback("Please fill in all password fields.", "error");
      return;
    }

    setIsSaving(true);
    try {
      await changePassword({
        current_password: securityData.currentPassword,
        new_password: securityData.newPassword
      });
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showFeedback("Password updated successfully!");
    } catch (err) {
      const msg = err.message.includes("Incorrect") 
        ? "Incorrect current password." 
        : "Failed to update password.";
      showFeedback(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ""}` 
    : user?.email.split("@")[0];

  return (
    <FiscalAppShell headerMode="date" headerTone="default" dateLabel="Settings">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 sm:px-8 py-12 lg:flex-row">
        
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
            <h2 className="font-['Manrope',system-ui,sans-serif] text-2xl font-extrabold tracking-[-0.6px] text-[#003526] text-center">
              {displayName}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#404944] truncate max-w-full">
              {user?.email}
            </p>
            <div className="mt-6 w-full flex flex-col gap-2">
              <button
                type="button"
                className="w-full rounded-full bg-[#003526] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#004e39]"
              >
                Change Photo
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-1 rounded-3xl bg-white p-4 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)]">
            {[
              { id: "general", label: "General Information" },
              { id: "preferences", label: "Preferences" },
              { id: "security", label: "Security" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                  activeTab === tab.id
                    ? "bg-[#ecfdf5] text-[#003526]"
                    : "text-[#64748b] hover:bg-[#f7f9fb] hover:text-[#191c1e]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Column: Main Content */}
        <div className="flex-1 rounded-3xl bg-white p-6 sm:p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)] lg:p-12">
          {activeTab === "general" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-['Manrope',system-ui,sans-serif] text-2xl font-extrabold tracking-[-1px] text-[#003526]">
                General Information
              </h3>
              <p className="mt-2 text-sm text-[#64748b]">
                Update your personal details and contact information.
              </p>

              <form onSubmit={handleSaveProfile} className="mt-8 flex flex-col gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
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
                      placeholder="Enter last name"
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
                    readOnly
                    value={formData.email}
                    className="rounded-xl border-0 bg-slate-100 px-5 py-4 text-base font-medium text-slate-500 cursor-not-allowed outline-none"
                  />
                  <p className="text-[10px] text-slate-400">Email cannot be changed currently.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                  />
                </div>

                {feedbackMsg.text && (
                  <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    feedbackMsg.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                  }`}>
                    {feedbackMsg.text}
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
              <div className="mt-12 py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                <p className="text-slate-400 font-medium">Preference settings are coming soon.</p>
              </div>
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

              <form onSubmit={handleUpdatePassword} className="mt-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                    Current Password
                  </label>
                  <input
                    name="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    value={securityData.currentPassword}
                    onChange={handleSecurityChange}
                    className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                      New Password
                    </label>
                    <input
                      name="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={securityData.newPassword}
                      onChange={handleSecurityChange}
                      className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
                      Confirm New Password
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-type new password"
                      value={securityData.confirmPassword}
                      onChange={handleSecurityChange}
                      className="rounded-xl border-0 bg-[#f7f9fb] px-5 py-4 text-base font-medium text-[#191c1e] outline-none ring-1 ring-inset ring-transparent transition focus:ring-2 focus:ring-[#003526]"
                    />
                  </div>
                </div>

                {feedbackMsg.text && (
                  <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    feedbackMsg.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                  }`}>
                    {feedbackMsg.text}
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
