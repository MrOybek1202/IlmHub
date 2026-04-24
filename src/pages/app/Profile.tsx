import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Zap } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { t } = useI18n();
  const initials = user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "U";

  return (
    <div className="container py-8 max-w-3xl">
      <PageHeader title={t("common.profile")} desc={user?.email || ""} />

      <div className="rounded-2xl bg-gradient-card border border-border p-8">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24 ring-2 ring-primary/30">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-display text-2xl font-bold">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="border-primary/40 text-primary">Grade {user?.grade}</Badge>
              <Badge variant="outline" className="border-secondary/40 text-secondary">{user?.goal}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Stat icon={Flame} label={t("dash.streak")} value={user?.streak ?? 0} color="text-accent" />
          <Stat icon={Trophy} label={t("dash.level")} value={user?.level ?? 1} color="text-warning" />
          <Stat icon={Zap} label={t("dash.xp")} value={user?.xp ?? 0} color="text-primary" />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: any) {
  return (
    <div className="rounded-xl bg-surface-2 p-5 text-center">
      <Icon className={`h-6 w-6 ${color} mx-auto mb-2`} />
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
