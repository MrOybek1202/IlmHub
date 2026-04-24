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
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{current?.flag} {lang.toUpperCase()}</span>
          <span className="sm:hidden">{current?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            className={lang === l.code ? "bg-primary/10 text-primary" : ""}
          >
            <span className="mr-2">{l.flag}</span>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
