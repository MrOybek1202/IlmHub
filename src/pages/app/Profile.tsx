import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { activityData, getSubjectById, localize } from "@/lib/content";
import { PageHeader } from "./Subjects";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Edit2, X, Check } from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const displayName = user?.name || user?.email || "User";
  const initials = displayName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "U";
  const favoriteSubject = getSubjectById("physics");
  const monthLabels = t("profile.activityMonths").split(",");
  const dayLabels = t("profile.activityDays").split(",");

  useEffect(() => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setAvatarUrl(user?.avatarUrl || "");
  }, [user?.firstName, user?.lastName, user?.avatarUrl, user?.name]);

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      toast({ title: t("toast.success"), description: t("profile.saveSuccess") });
      setIsEditing(false);
    } catch (err: any) {
      toast({ title: t("toast.error"), description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: t("toast.error"),
          description: "Rasm hajmi 2MB dan oshmasligi kerak",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <PageHeader title={t("common.profile")} desc={user?.email || ""} />

      <section className="paper-card rounded-[32px] p-7">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <Avatar className="h-24 w-24 ring-1 ring-border">
            {user?.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={displayName} /> : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-serif text-3xl mb-2">{displayName}</h2>
            <div className="flex flex-wrap gap-2">
              {user?.grade ? <span className="pill">{t("profile.grade")} {user.grade}</span> : null}
              {user?.goal ? <span className="pill">{t(`goal.${user.goal}`)}</span> : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <ProfileStat label={t("dash.streak")} value={user?.streak ?? 0} />
            <ProfileStat label={t("dash.level")} value={user?.level ?? 1} />
            <ProfileStat label={t("profile.studyHours")} value="8.5h" />
            <ProfileStat label={t("profile.favoriteSubject")} value={favoriteSubject ? localize(favoriteSubject.name, lang) : "-"} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="paper-card rounded-[32px] p-6">
          <div className="mb-5">
            <h2 className="font-serif text-2xl">{t("profile.activity")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("profile.activity.desc")}</p>
          </div>
          <ActivityGrid monthLabels={monthLabels} dayLabels={dayLabels} />
        </div>

        <div className="space-y-6">
          <div className="paper-card rounded-[32px] p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-serif text-2xl">{isEditing ? t("profile.edit") : t("common.profile")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isEditing ? t("profile.editDesc") : t("profile.viewDesc")}
                </p>
              </div>
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="rounded-full gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  {t("common.edit")}
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={onSaveProfile} className="space-y-6">
                <div className="flex flex-col items-center gap-4 mb-2">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                      {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="text-white h-8 w-8" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("profile.changeAvatar")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-first-name">{t("profile.firstName")}</Label>
                    <Input
                      id="profile-first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t("auth.firstName.placeholder")}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-last-name">{t("profile.lastName")}</Label>
                    <Input
                      id="profile-last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t("auth.lastName.placeholder")}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1 rounded-xl gap-2">
                    {saving ? t("common.saving") : (
                      <>
                        <Check className="h-4 w-4" />
                        {t("common.save")}
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => {
                      setIsEditing(false);
                      setFirstName(user?.firstName || "");
                      setLastName(user?.lastName || "");
                      setAvatarUrl(user?.avatarUrl || "");
                    }} 
                    className="flex-1 rounded-xl gap-2"
                  >
                    <X className="h-4 w-4" />
                    {t("common.cancel")}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-2">
                    <p className="text-xs text-muted-foreground mb-1">{t("profile.firstName")}</p>
                    <p className="font-medium">{user?.firstName || "-"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-2">
                    <p className="text-xs text-muted-foreground mb-1">{t("profile.lastName")}</p>
                    <p className="font-medium">{user?.lastName || "-"}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-2">
                  <p className="text-xs text-muted-foreground mb-1">{t("auth.email")}</p>
                  <p className="font-medium">{user?.email || "-"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="paper-card rounded-[32px] p-6">
            <h3 className="font-serif text-2xl mb-4">{t("profile.preferences")}</h3>
            <div className="space-y-3 text-sm">
              <Row label={t("profile.learningPace")} value={t("profile.fastTrack")} />
              <Row label={t("profile.favoriteSubject")} value={favoriteSubject ? localize(favoriteSubject.name, lang) : "-"} />
              <Row label={t("profile.studyHours")} value="8.5h" />
            </div>
          </div>

          <div className="paper-card rounded-[32px] p-6">
            <h3 className="font-serif text-2xl mb-4">{t("profile.connected")}</h3>
            <div className="space-y-3 text-sm">
              <Row label="Google" value={t("settings.connectedStatus")} />
              <Row label={t("profile.youtubeLabel")} value={t("settings.connectedStatus")} />
              <Row label={t("profile.driveLabel")} value={t("settings.notConnected")} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="font-serif text-2xl">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ActivityGrid({ monthLabels, dayLabels }: { monthLabels: string[]; dayLabels: string[] }) {
  const weeks = Array.from({ length: Math.ceil(activityData.length / 7) }, (_, weekIndex) =>
    activityData.slice(weekIndex * 7, weekIndex * 7 + 7)
  );

  return (
    <div className="rounded-[28px] bg-[#23211f] text-white p-5 overflow-x-auto">
      <div className="min-w-[780px]">
        <div className="flex ml-16 gap-6 text-xs text-white/60 mb-3">
          {monthLabels.map((month) => <span key={month}>{month}</span>)}
        </div>
        <div className="flex gap-3">
          <div className="grid grid-rows-7 gap-2 pt-1 text-xs text-white/50">
            <span>{dayLabels[0]}</span>
            <span className="opacity-0">.</span>
            <span>{dayLabels[1]}</span>
            <span className="opacity-0">.</span>
            <span>{dayLabels[2]}</span>
          </div>
          <div className="flex gap-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-2">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const cell = week[dayIndex];
                  const level = cell?.level ?? 0;
                  const bg = ["bg-[#2b3036]", "bg-[#20396d]", "bg-[#2346a0]", "bg-[#2e61de]", "bg-[#5a84ff]"][level];
                  return <div key={dayIndex} className={`h-4 w-4 rounded-[4px] ${bg}`} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
