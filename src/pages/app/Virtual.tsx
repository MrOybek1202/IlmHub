import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Atom, Sparkles } from "lucide-react";

export default function Virtual() {
  const { t } = useI18n();

  return (
    <div className="container py-8">
      <PageHeader title={t("vr.title")} desc={t("vr.desc")} />

      <div className="ink-card p-12 md:p-20 text-center">
        <Atom className="h-16 w-16 mx-auto mb-6 text-accent" />
        <span className="pill pill-accent mb-4">
          <Sparkles className="h-3 w-3" /> {t("vr.soon")}
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-4 tracking-tight">
          3D / VR <span className="italic">{t("vr.title")}</span>
        </h2>
        <p className="opacity-75 max-w-xl mx-auto">{t("vr.desc")}</p>
      </div>
    </div>
  );
}
