import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import GlobalError from "../components/GlobalError.jsx";
import ToastContainer from "../components/ToastContainer.jsx";

export default function AppLayout({ children }) {
  const location = useLocation();
  const isProblemDetail = /^\/problems\/[^/]+$/.test(location.pathname);
  const containerClass = isProblemDetail ? "max-w-full w-full" : "max-w-6xl mx-auto";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <GlobalError />
      <ToastContainer />
      <div className="flex flex-1">
        <Sidebar />
        <main className={`flex-1 min-w-0 py-6 ${isProblemDetail ? "px-2 md:px-4" : "px-4 md:px-6"}`}>
          <div className={containerClass}>{children}</div>
        </main>
      </div>
      <footer className="py-4 px-4 text-center text-sm text-slate-500 border-t border-slate-800/60">
        AlgoForge © 2026 | Built for coding practice and interview preparation
      </footer>
    </div>
  );
}
