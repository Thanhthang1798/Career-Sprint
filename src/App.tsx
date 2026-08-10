import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Target, TrendingUp, Settings } from "lucide-react";

import { AppProvider, useAppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import WeeklySprint from "./pages/WeeklySprint";
import DailyFocus from "./pages/DailyFocus";
import { ToastContainer } from "./components/Toast";

const GlobalToasts = () => {
  const { toasts, removeToast } = useAppContext();
  return <ToastContainer toasts={toasts} onClose={removeToast} />;
};

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Weekly Sprint", path: "/sprint", icon: Calendar },
    { name: "Daily Focus", path: "/daily", icon: Target },
    { name: "Progress", path: "/progress", icon: TrendingUp },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-900 hidden md:flex flex-col text-slate-300">
      <div className="p-6">
        <h1 className="text-xl font-black tracking-tight text-white">CAREER SPRINT</h1>
        <p className="text-xs font-semibold text-indigo-400 mt-1 uppercase tracking-wider">Sr. Dev Prep</p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-600/10 text-indigo-400 font-semibold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const MobileNav = () => {
  const location = useLocation();
  const links = [
    { name: "Home", path: "/", icon: LayoutDashboard },
    { name: "Sprint", path: "/sprint", icon: Calendar },
    { name: "Daily", path: "/daily", icon: Target },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center p-2 rounded-md ${
              isActive ? "text-indigo-600" : "text-slate-500"
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative pb-16 md:pb-0">
        <header className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-40">
           <h1 className="text-lg font-black tracking-tight text-slate-900">CAREER SPRINT</h1>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-700">{title}</h2>
      <p className="text-slate-500 mt-2">Coming soon in next iteration.</p>
    </div>
  </div>
);


function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sprint" element={<WeeklySprint />} />
            <Route path="/daily" element={<DailyFocus />} />
            <Route path="/progress" element={<Placeholder title="Progress" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
          </Routes>
        </Layout>
        <GlobalToasts />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
