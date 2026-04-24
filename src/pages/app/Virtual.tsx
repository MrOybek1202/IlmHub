import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Atom, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Virtual() {
  const { t } = useI18n();
  return (
    <div className="container py-8">
      <PageHeader title={t("vr.title")} desc={t("vr.desc")} />

      <div className="relative overflow-hidden rounded-3xl bg-gradient-card border border-border p-12 md:p-20 text-center">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/4 left-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl animate-float [animation-delay:1.5s]" />

        <div className="relative">
          <Atom className="h-20 w-20 text-primary mx-auto mb-6 animate-glow" />
          <Badge variant="outline" className="border-accent/40 text-accent mb-4">
            <Sparkles className="h-3 w-3 mr-1" /> {t("vr.soon")}
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">3D / VR</span> {t("vr.title")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("vr.desc")}</p>
        </div>
      </div>
    </div>
  );
}
