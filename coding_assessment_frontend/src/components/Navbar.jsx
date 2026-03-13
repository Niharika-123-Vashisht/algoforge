import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const linkBase =
  "px-3 py-2 rounded-md text-sm font-medium transition-colors";
const linkActive = "bg-slate-800 text-white";
const linkInactive = "text-slate-300 hover:text-white hover:bg-slate-900";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-indigo-200">
          AlgoForge
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex md:hidden items-center gap-2">
            <NavLink
              to="/problems"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Problems
            </NavLink>
            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Leaderboard
            </NavLink>
          </div>
          {user ? (
            <>
              <span className="text-sm text-slate-300">
                {user.username || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
