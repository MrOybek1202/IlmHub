import { ReactNode, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { PageHeader } from "./Subjects";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailReminders, setEmailReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [youtubeSync, setYoutubeSync] = useState(true);
  const [driveSync, setDriveSync] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  async function onSendCode() {
    if (!user?.email) return;
    setSendingCode(true);
    try {
      await api.sendCode(user.email, 'reset');
      toast({ title: t("toast.success"), description: t("settings.resetCodeSent") });
    } catch (err: any) {
      toast({ title: t("toast.error"), description: err.message, variant: "destructive" });
    } finally {
      setSendingCode(false);
    }
  }

  async function onResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.email) return;
    setResettingPassword(true);
    try {
      await api.resetPassword(user.email, code, newPassword);
      setCode("");
      setNewPassword("");
      toast({ title: t("toast.success"), description: t("auth.reset.success") });
    } catch (err: any) {
      toast({ title: t("toast.error"), description: err.message, variant: "destructive" });
    } finally {
      setResettingPassword(false);
    }
  }

  return (
    <div className="container py-8 space-y-6">
      <PageHeader title={t("settings.title")} desc={t("settings.desc")} />

      <section className="paper-card rounded-[32px] p-6 flex items-center justify-between">
        <div>
          <div className="font-medium">{t("common.language")}</div>
          <div className="text-sm text-muted-foreground">{user?.email}</div>
        </div>
        <LangSwitcher />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SettingsCard title={t("settings.preferences")}>
          <ToggleRow label={t("settings.emailReminders")} checked={emailReminders} onCheckedChange={setEmailReminders} />
          <ToggleRow label={t("settings.weeklyReport")} checked={weeklyReport} onCheckedChange={setWeeklyReport} />
          <ToggleRow label={t("settings.publicProfile")} checked={publicProfile} onCheckedChange={setPublicProfile} />
        </SettingsCard>

        <SettingsCard title={t("settings.connectedApps")}>
          <ToggleRow label={t("settings.youtubeSync")} checked={youtubeSync} onCheckedChange={setYoutubeSync} />
          <ToggleRow label={t("settings.googleDriveSync")} checked={driveSync} onCheckedChange={setDriveSync} />
          <div className="rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted-foreground">
            Google: {user?.email ? t("settings.connectedStatus") : t("settings.notConnected")}
          </div>
        </SettingsCard>

        <SettingsCard title={t("settings.notifications")}>
          <div className="rounded-2xl bg-surface-2 px-4 py-3 text-sm">19:00</div>
          <div className="rounded-2xl bg-surface-2 px-4 py-3 text-sm">45/10</div>
          <Button className="rounded-full w-fit">{t("common.save")}</Button>
        </SettingsCard>

        <SettingsCard title={t("settings.security")}>
          <form onSubmit={onResetPassword} className="space-y-4">
            <div className="rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted-foreground">
              {t("settings.passwordHelp")}
            </div>
            <Button type="button" onClick={onSendCode} disabled={sendingCode || !user?.email} className="rounded-full w-fit">
              {t("settings.sendResetCode")}
            </Button>
            <div className="space-y-2">
              <Label>{t("auth.reset.codeLabel")}</Label>
              <div className="flex justify-start">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="h-11 w-11 text-base border-border bg-surface-2" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">{t("auth.reset.newPassword")}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("settings.passwordPlaceholder")}
              />
            </div>
            <Button type="submit" disabled={resettingPassword || code.length !== 6 || !newPassword} className="rounded-full w-fit">
              {t("auth.reset.changePassword")}
            </Button>
          </form>
        </SettingsCard>

        <SettingsCard title={t("settings.privacy")}>
          <div className="rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted-foreground">
            {t("settings.linksHelp1")}
          </div>
          <div className="rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted-foreground">
            {t("settings.linksHelp2")}
          </div>
        </SettingsCard>
      </section>
    </div>
  );
}

function SettingsCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="paper-card rounded-[32px] p-6">
      <h2 className="font-serif text-2xl mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div className="rounded-2xl bg-surface-2 px-4 py-3 flex items-center justify-between">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
