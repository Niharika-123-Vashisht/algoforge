import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { getErrorMessage } from "../../../utils/error.js";

export default function RegisterPage() {
  const { register, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/problems", { replace: true });
    }
  }, [user, isLoading, navigate]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: ""
  });
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
      await register(form);
      navigate("/problems");
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 py-12">
      <Link to="/" className="text-xl font-semibold text-indigo-200 mb-6 hover:text-indigo-100">
        AlgoForge
      </Link>
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-1">
          Create your AlgoForge account and start solving coding challenges
        </h1>
        <p className="text-sm text-slate-400 mb-4">
          Join AlgoForge to practice coding problems and prepare for interviews
        </p>
        {error && (
          <div className="mb-3 rounded-md bg-red-600/15 border border-red-600/30 text-red-300 text-sm px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs text-slate-400 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="johndoe"
              value={form.username}
              onChange={onChange}
              className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs text-slate-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs text-slate-400 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
              required
            />
          </div>
          <div>
            <label htmlFor="password_confirm" className="block text-xs text-slate-400 mb-1">
              Confirm Password
            </label>
            <input
              id="password_confirm"
              type="password"
              name="password_confirm"
              placeholder="••••••••"
              value={form.password_confirm}
              onChange={onChange}
              className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 font-medium transition-colors"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="text-sm text-slate-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
