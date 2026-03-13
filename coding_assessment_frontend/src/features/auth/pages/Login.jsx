import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { getErrorMessage } from "../../../utils/error.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate("/problems");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid credentials."));
    } finally {
      setLoading(false);
    }
  };

  const backendBase = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
  const googleLoginUrl = `${backendBase}/accounts/google/login/?process=login&next=/api/auth/google/callback/`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {error && (
          <div className="mb-3 rounded-md bg-red-600/15 border border-red-600/30 text-red-300 text-sm px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4">
          <div className="text-xs text-slate-400 mb-2 text-center">Or sign in with</div>
          <a
            href={googleLoginUrl}
            className="w-full inline-flex items-center justify-center gap-2 py-2 rounded bg-slate-800 hover:bg-slate-700 text-sm"
          >
            Continue with Google
          </a>
        </div>
        <p className="text-sm text-slate-400 mt-4">
          No account? <Link to="/register" className="text-indigo-400">Register</Link>
        </p>
      </div>
    </div>
  );
}
