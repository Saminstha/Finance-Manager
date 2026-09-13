import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Wallet,
  Target,
  LogOut,
  Wallet2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/auth/authSlice";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/budgets", label: "Budgets", icon: PiggyBank },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/savings", label: "Savings", icon: Target },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-card">
      {/* Brand */}
      <div className="flex items-center gap-2 p-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet2 className="size-4" />
        </div>

        <span className="font-semibold">Finance Manager</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="flex items-center gap-2 border-t p-4">
        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {user?.name ?? "User"}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Logout"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </aside>
  );
}
