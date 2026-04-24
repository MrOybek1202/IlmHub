import { Link } from "react-router-dom";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
        <span className="font-serif text-primary-foreground text-base font-semibold tracking-tight">i</span>
      </div>
      <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
        ILM <span className="text-muted-foreground font-normal">Hub</span>
      </span>
    </Link>
  );
}
