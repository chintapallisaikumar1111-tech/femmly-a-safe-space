import { useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus, AtSign, Megaphone, Mail } from "lucide-react";
import SettingsLayout from "./SettingsLayout";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Notifications = () => {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState({
    pushAll: true,
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    announcements: false,
    emailDigest: true,
  });

  const update = (k: keyof typeof prefs, v: boolean) => {
    setPrefs((p) => ({ ...p, [k]: v }));
    toast({ title: "Saved", description: `${k} ${v ? "on" : "off"}` });
  };

  const items = [
    { key: "pushAll", icon: Bell, label: "Push notifications", desc: "Master switch for all notifications" },
    { key: "likes", icon: Heart, label: "Likes", desc: "When someone likes your post" },
    { key: "comments", icon: MessageCircle, label: "Comments", desc: "When someone comments on your post" },
    { key: "follows", icon: UserPlus, label: "New followers", desc: "When someone starts following you" },
    { key: "mentions", icon: AtSign, label: "Mentions & tags", desc: "When you're tagged or mentioned" },
    { key: "announcements", icon: Megaphone, label: "Femmly announcements", desc: "Updates from the Femmly team" },
    { key: "emailDigest", icon: Mail, label: "Weekly email digest", desc: "Summary of your week every Monday" },
  ] as const;

  return (
    <SettingsLayout title="Notifications" description="Choose what you hear from Femmly">
      <div className="max-w-md mx-auto space-y-2">
        {items.map(({ key, icon: Icon, label, desc }) => (
          <div key={key} className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
            <div className="w-9 h-9 rounded-lg gradient-femmly-soft flex items-center justify-center">
              <Icon size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <Switch checked={prefs[key]} onCheckedChange={(v) => update(key, v)} />
          </div>
        ))}
      </div>
    </SettingsLayout>
  );
};

export default Notifications;