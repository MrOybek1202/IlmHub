import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Flame, Trophy, Zap } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { t } = useI18n();
  const initials = user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "U";

  return (
    <div className="container py-8 max-w-3xl">
      <PageHeader title={t("common.profile")} desc={user?.email || ""} />

      <div className="paper-card rounded-2xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20 ring-1 ring-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-serif text-2xl font-semibold">{user?.name}</h2>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {user?.grade ? <span className="pill">{t("profile.grade")} {user.grade}</span> : null}
              {user?.goal ? <span className="pill">{t(`goal.${user.goal}`)}</span> : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Stat icon={Flame} label={t("dash.streak")} value={user?.streak ?? 0} />
          <Stat icon={Trophy} label={t("dash.level")} value={user?.level ?? 1} />
          <Stat icon={Zap} label={t("dash.xp")} value={user?.xp ?? 0} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-xl bg-surface-2 p-5 text-center">
      <Icon className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
      <div className="font-serif text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
