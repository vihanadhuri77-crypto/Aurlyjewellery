import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@cently.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cently_admin_token");
    if (token) {
      api.get("/auth/me").then(() => navigate("/admin")).catch(() => localStorage.removeItem("cently_admin_token"));
    }
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("cently_admin_token", data.access_token);
      localStorage.setItem("cently_admin_user", JSON.stringify(data.user));
      toast.success("Welcome back, " + data.user.name);
      navigate("/admin");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Invalid email or password";
      toast.error(typeof msg === "string" ? msg : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="page-admin-login" className="min-h-screen bg-[#1A1918] text-[#FAF9F5] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-serif-display text-3xl tracking-[0.42em] mb-12">CENTLY</Link>
        <div className="border border-[#FAF9F5]/15 p-8 md:p-10">
          <p className="overline text-[#D4B882] mb-3">Admin</p>
          <h1 className="font-serif-display text-3xl md:text-4xl font-light leading-tight">Sign in to the dashboard.</h1>
          <form onSubmit={submit} className="mt-8 space-y-5" data-testid="admin-login-form">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#FAF9F5]/60">Email</span>
              <input
                data-testid="admin-email"
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full bg-transparent border-0 border-b border-[#FAF9F5]/30 focus:border-[#D4B882] outline-none py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#FAF9F5]/60">Password</span>
              <input
                data-testid="admin-password"
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full bg-transparent border-0 border-b border-[#FAF9F5]/30 focus:border-[#D4B882] outline-none py-2.5 text-sm"
              />
            </label>
            <button data-testid="admin-login-submit" disabled={loading} className="w-full bg-[#D4B882] text-[#1A1918] py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#FAF9F5] transition-colors disabled:opacity-60">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        {process.env.NODE_ENV !== "production" && (
          <p className="mt-6 text-xs text-center text-[#FAF9F5]/50 leading-relaxed">
            Default credentials are seeded from <code className="text-[#D4B882]">backend/.env</code>.<br />
            Stored in <code className="text-[#D4B882]">/app/memory/test_credentials.md</code>.
          </p>
        )}
      </div>
    </div>
  );
}
