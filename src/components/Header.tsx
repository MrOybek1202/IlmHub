import { NavLink, useNavigate } from "react-router-dom";
import { Atom, Bell, BookOpen, FlaskConical, Gamepad2, Home, LayoutGrid, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useAuth } from "@/contexts/AuthContext";
import { LangSwitcher } from "./LangSwitcher";
import { Logo } from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { t } = useI18n();
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const nav = [
    { to: "/app", label: t("nav.home"), icon: Home, end: true },
    { to: "/app/subjects", label: t("nav.subjects"), icon: LayoutGrid },
    { to: "/app/lab", label: t("nav.lab"), icon: FlaskConical },
    { to: "/app/books", label: t("nav.books"), icon: BookOpen },
    { to: "/app/games", label: t("nav.games"), icon: Gamepad2 },
    { to: "/app/virtual", label: t("nav.virtual"), icon: Atom },
  ];

  const displayName = user?.name || user?.email || "User";
  const initials = displayName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "U";
  const goalLabel = user?.goal ? t(`goal.${user.goal}`) : "";

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="container flex h-16 items-center gap-4">
        <Logo to="/app" />

        <nav className="hidden lg:flex items-center gap-0.5 ml-6 p-1 rounded-full bg-surface-2/70">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        <LangSwitcher />

        <button type="button" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-2">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex items-center gap-2 group">
              <Avatar className="h-9 w-9 ring-1 ring-border group-hover:ring-primary/40 transition-all">
                {user?.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={displayName} /> : null}
                <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-lg">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{displayName}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 flex flex-wrap gap-2">
              <span className="pill">{t("common.levelShort")} {user?.level ?? 1}</span>
              <span className="pill">{user?.streak ?? 0} {t("dash.streak")}</span>
              {goalLabel ? <span className="pill">{goalLabel}</span> : null}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/app/profile")}>
              <UserIcon className="h-4 w-4 mr-2" /> {t("common.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/settings")}>
              <Settings className="h-4 w-4 mr-2" /> {t("common.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { signout(); navigate("/"); }} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" /> {t("cta.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="lg:hidden border-t border-border overflow-x-auto">
        <div className="container flex items-center gap-1 py-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`
              }
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
