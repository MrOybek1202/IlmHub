import { ReactNode } from "react";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Logo } from "@/components/Logo";

export function AuthShell({ title, subtitle, children, footer }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container flex h-16 items-center justify-between">
        <Logo />
        <LangSwitcher />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="paper-card rounded-2xl p-8 shadow-md">
            <h1 className="font-serif text-3xl font-semibold mb-2 tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>}
            {children}
          </div>
          {footer && <div className="text-center mt-6 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
