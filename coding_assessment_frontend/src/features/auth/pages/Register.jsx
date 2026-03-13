import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { getErrorMessage } from "../../../utils/error.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        {error && (
          <div className="mb-3 rounded-md bg-red-600/15 border border-red-600/30 text-red-300 text-sm px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onChange}
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
            required
          />
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
          <input
            type="password"
            name="password_confirm"
            placeholder="Confirm Password"
            value={form.password_confirm}
            onChange={onChange}
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="mt-4">
          <div className="text-xs text-slate-400 mb-2 text-center">Or sign up with</div>
          <a
            href="http://127.0.0.1:8000/api/auth/google/"
            className="w-full inline-flex items-center justify-center gap-2 py-2 rounded bg-slate-800 hover:bg-slate-700 text-sm"
          >
            Google
          </a>
        </div>
        <p className="text-sm text-slate-400 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-400">Login</Link>
        </p>
      </div>
    </div>
  );
}
