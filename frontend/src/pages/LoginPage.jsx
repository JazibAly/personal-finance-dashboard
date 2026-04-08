import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to log in");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9fb] p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)]">
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-bold leading-9 tracking-[-1px] text-[#022c22]">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-[#404944]">Log in to your SpendWise account</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold tracking-[-0.2px] text-[#022c22]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-[rgba(191,201,195,0.4)] bg-white px-4 py-2.5 text-[15px] font-medium text-[#191c1e] outline-none transition focus:border-[#004e39] focus:ring-1 focus:ring-[#004e39]"
              placeholder="name@example.com"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold tracking-[-0.2px] text-[#022c22]">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-[rgba(191,201,195,0.4)] bg-white px-4 py-2.5 text-[15px] font-medium text-[#191c1e] outline-none transition focus:border-[#004e39] focus:ring-1 focus:ring-[#004e39]"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-[#003526] py-3 text-[15px] font-bold text-white transition hover:bg-[#004e39]"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#404944]">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-[#003526] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
