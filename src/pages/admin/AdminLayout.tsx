import React from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Settings,
  LogOut,
  TourControl,
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/companies", label: "Tour Companies", icon: Building2 },
    // Mock links for future expansion
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/reports", label: "Reports", icon: FileText },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="text-primary font-black text-xl">D</span>
          </div>
          <div>
            <h2 className="font-black tracking-tight text-gray-900 leading-none">
              DanaTour
            </h2>
            <span className="text-xs font-bold text-gray-400">
              Admin Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-white" : "text-gray-400"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-full overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 shrink-0 flex items-center justify-between">
          <div className="font-black text-lg">DanaTour Admin</div>
          <button className="p-2 border border-gray-200 rounded-lg">
            <LayoutDashboard size={20} />
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
