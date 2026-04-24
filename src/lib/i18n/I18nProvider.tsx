import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { dict, Lang } from "./dictionaries";

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nCtx | null>(null);

const STORAGE_KEY = "ilm.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "uz";
    return (localStorage.getItem(STORAGE_KEY) as Lang) || "uz";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<I18nCtx>(
    () => ({
      lang,
      setLang: (l) => setLangState(l),
      t: (key) => dict[lang][key] ?? dict.uz[key] ?? key,
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
