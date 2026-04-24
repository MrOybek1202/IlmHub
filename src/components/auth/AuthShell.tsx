import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { LangSwitcher } from "@/components/LangSwitcher";
import { ReactNode } from "react";

export function AuthShell({ title, subtitle, children, footer }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <header className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">
            ILM<span className="gradient-text">Hub</span>
          </span>
        </Link>
        <LangSwitcher />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="glass-strong rounded-2xl p-8 shadow-elevated">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>}
            {children}
          </div>
          {footer && <div className="text-center mt-6 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
