import { Link, NavLink, useNavigate } from "react-router-dom";
import { Atom, Bell, BookOpen, FlaskConical, Gamepad2, Home, LayoutGrid, LogOut, Settings, Sparkles, User as UserIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useAuth } from "@/contexts/AuthContext";
import { LangSwitcher } from "./LangSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

  const initials = user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/60">
      <div className="container flex h-16 items-center gap-4">
        {/* Logo */}
        <Link to="/app" className="flex items-center gap-2 shrink-0 group">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-50 group-hover:opacity-80 transition-opacity -z-10" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            ILM<span className="gradient-text">Hub</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-6">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
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

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent shadow-glow-accent" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 group">
              <Avatar className="h-9 w-9 ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-strong">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 flex gap-2">
              <Badge variant="outline" className="border-primary/40 text-primary">
                Lvl {user?.level ?? 1}
              </Badge>
              <Badge variant="outline" className="border-success/40 text-success">
                🔥 {user?.streak ?? 0}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/app/profile")}>
              <UserIcon className="h-4 w-4 mr-2" /> {t("common.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/settings")}>
              <Settings className="h-4 w-4 mr-2" /> {t("common.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signout();
                navigate("/");
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" /> {t("cta.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile nav */}
      <nav className="lg:hidden border-t border-border/60 overflow-x-auto">
        <div className="container flex items-center gap-1 py-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
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
