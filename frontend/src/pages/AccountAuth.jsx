import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function AccountAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register } = useAuth();
  const initialMode = location.pathname === "/register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.id) navigate("/account");
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("Welcome back.");
      } else {
        await register(form);
        toast.success("Welcome to Cently.", { description: "Your account has been created." });
      }
      navigate(location.state?.next || "/account");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Something went wrong";
      toast.error(typeof msg === "string" ? msg : "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="page-auth" className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="overline mb-3 text-center">My Account</p>
        <h1 className="font-serif-display text-4xl md:text-5xl font-light leading-tight text-center">
          {mode === "login" ? "Sign in to Cently." : "Create your account."}
        </h1>
        <p className="mt-3 text-sm text-center text-[#5E5950]">
          {mode === "login"
            ? "View your orders, points, and saved pieces — all in one place."
            : "Track orders, earn Cently Circle points, and save the pieces you love."}
        </p>

        <div className="flex justify-center gap-2 mt-10 border border-[#EAE5DC] p-1 max-w-xs mx-auto" data-testid="auth-tabs">
          {["login", "register"].map((m) => (
            <button
              key={m}
              data-testid={`tab-${m}`}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 text-[11px] uppercase tracking-[0.22em] transition-colors ${mode === m ? "bg-[#1A1918] text-[#FAF9F5]" : "text-[#1A1918]"}`}
            >{m === "login" ? "Sign in" : "Register"}</button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-10 space-y-6" data-testid="auth-form">
          {mode === "register" && (
            <Field label="Full name" testid="auth-name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
          )}
          <Field label="Email" type="email" testid="auth-email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
          <Field label="Password" type="password" testid="auth-password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} required />
          {mode === "register" && (
            <Field label="Phone (optional)" testid="auth-phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
          )}
          <button data-testid="auth-submit" disabled={loading} className="w-full bg-[#1A1918] text-[#FAF9F5] py-4 text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#363432] transition-colors disabled:opacity-60">
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#5E5950] leading-relaxed">
          By continuing, you agree to our <Link to="/legal/terms" className="underline">Terms</Link> and <Link to="/legal/privacy" className="underline">Privacy Policy</Link>.
          <br />New here?{" "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="underline">
            {mode === "login" ? "Create an account" : "Sign in instead"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({ label, testid, value, onChange, ...rest }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[#5E5950]">{label}</span>
      <input
        data-testid={testid} value={value} onChange={(e) => onChange(e.target.value)} {...rest}
        className="mt-2 w-full bg-transparent border-0 border-b border-[#1A1918]/30 focus:border-[#1A1918] outline-none py-2.5 text-sm placeholder:text-[#5E5950]/50"
      />
    </label>
  );
}
