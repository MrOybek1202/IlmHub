import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { LangSwitcher } from "@/components/LangSwitcher";

export default function Settings() {
  const { t } = useI18n();
  return (
    <div className="container py-8 max-w-2xl">
      <PageHeader title={t("common.settings")} desc="" />
      <div className="rounded-2xl bg-gradient-card border border-border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Language</p>
            <p className="text-sm text-muted-foreground">UI tilini tanlang</p>
          </div>
          <LangSwitcher />
        </div>
      </div>
    </div>
  );
}
