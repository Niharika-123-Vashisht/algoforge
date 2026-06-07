import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const navLinks = [
  { to: "/problems", label: "Problems" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/submissions", label: "Submissions" },
  { to: "/profile", label: "Profile" },
];

const navLinkClass = ({ isActive }) =>
  [
    "relative px-4 py-2 text-sm font-medium transition-colors rounded-md",
    isActive
      ? "text-indigo-200 bg-indigo-600/15"
      : "text-slate-300 hover:text-white hover:bg-slate-800/60",
  ].join(" ");

const mobileNavLinkClass = ({ isActive }) =>
  [
    "block px-4 py-3 text-sm font-medium transition-colors rounded-md",
    isActive
      ? "text-indigo-200 bg-indigo-600/15"
      : "text-slate-300 hover:text-white hover:bg-slate-800/60",
  ].join(" ");

function HamburgerIcon({ open }) {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {open ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 backdrop-blur-sm">
      <div className="px-4 md:px-6">
        <div className="flex items-center h-14">
          <div className="flex-1 flex items-center min-w-0">
            <Link
              to="/problems"
              className="text-lg font-semibold text-indigo-200 hover:text-indigo-100 transition-colors"
            >
              AlgoForge
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} className={navLinkClass}>
                  {label}
                </NavLink>
              ))}
            </div>
          )}

          <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-slate-300 truncate max-w-[140px] md:max-w-none">
                  {user.username || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <HamburgerIcon open={mobileMenuOpen} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-indigo-200 bg-indigo-600/15"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-indigo-200 bg-indigo-600/15"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`
                  }
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 py-2 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={mobileNavLinkClass}>
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
