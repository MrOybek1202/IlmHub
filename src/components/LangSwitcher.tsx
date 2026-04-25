import { useI18n } from "@/lib/i18n/I18nProvider";
import { LANGS, Lang } from "@/lib/i18n/dictionaries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LangSwitcher() {
  const { lang, setLang } = useI18n();
  const current = LANGS.find((l) => l.code === lang);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-surface-2 rounded-full">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{lang.toUpperCase()}</span>
          <span className="sm:hidden">{current?.shortLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border shadow-lg">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            className={lang === l.code ? "bg-surface-2 text-foreground font-medium" : ""}
          >
            <span className="mr-2 text-xs font-semibold">{l.shortLabel}</span>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
