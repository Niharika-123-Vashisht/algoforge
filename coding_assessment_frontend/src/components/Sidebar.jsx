import { NavLink } from "react-router-dom";

const linkBase =
  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
const linkActive = "bg-indigo-600/20 text-indigo-200 border border-indigo-500/30";
const linkInactive = "text-slate-300 hover:text-white hover:bg-slate-900";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 min-h-[calc(100vh-64px)] border-r border-slate-800 bg-slate-950/70 backdrop-blur px-4 py-6">
      <div className="w-full space-y-2">
        <div className="text-xs uppercase tracking-widest text-slate-500 px-2 mb-3">
          Navigation
        </div>
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
        <NavLink
          to="/submissions"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Submissions
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Profile
        </NavLink>
      </div>
    </aside>
  );
}
