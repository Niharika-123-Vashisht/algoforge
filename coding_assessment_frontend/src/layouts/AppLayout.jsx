import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import GlobalError from "../components/GlobalError.jsx";
import ToastContainer from "../components/ToastContainer.jsx";

export default function AppLayout() {
  const location = useLocation();
  const isProblemDetail = /^\/problems\/[^/]+$/.test(location.pathname);
  const isAuthPage = /^\/(login|register|oauth\/callback)$/.test(location.pathname);

  const mainClass = isAuthPage
    ? "flex items-center justify-center px-4 py-8"
    : isProblemDetail
      ? "px-2 md:px-4 py-4"
      : "px-4 md:px-6 py-6";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <GlobalError />
      <ToastContainer />
      <main className={`flex-1 min-w-0 w-full pt-14 ${mainClass}`}>
        <Outlet />
      </main>
      <footer className="py-4 px-4 text-center text-sm text-slate-500 border-t border-slate-800/60">
        AlgoForge © 2026 | Built for coding practice and interview preparation
      </footer>
    </div>
  );
}
