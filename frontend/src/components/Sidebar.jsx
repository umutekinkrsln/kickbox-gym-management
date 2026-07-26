import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Genel Bakis", end: true },
  { to: "/members", label: "Uyeler" },
  { to: "/classes", label: "Ders Programi" },
  { to: "/attendance", label: "Yoklama" },
  { to: "/payments", label: "Odemeler" },
  { to: "/training-logs", label: "Gelisim Takibi" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 min-h-screen bg-surface border-r border-border flex flex-col shrink-0">
      <div className="px-5 py-6 border-b border-border">
        <h1 className="font-display text-3xl tracking-wide2 text-ink">RING</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-ink"
                  : "text-muted hover:bg-surfaceHover hover:text-ink"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <p className="text-sm text-ink font-medium truncate">{user?.fullName}</p>
        <p className="text-xs text-muted truncate mb-3">{user?.email}</p>
        <button
          onClick={logout}
          className="text-xs text-muted hover:text-accent transition-colors"
        >
          Cikis yap
        </button>
      </div>
    </aside>
  );
}
