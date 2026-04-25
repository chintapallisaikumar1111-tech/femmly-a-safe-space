import { useState } from "react";
import { ShieldCheck, EyeOff, Lock, MessageSquareOff, ScanFace, UserX } from "lucide-react";
import SettingsLayout from "./SettingsLayout";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const PrivacySafety = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    privateAccount: true,
    blockScreenshots: true,
    e2eeMessages: true,
    aiModeration: true,
    hideActivity: false,
    blockMessageRequests: false,
  });

  const update = (key: keyof typeof settings, value: boolean) => {
    setSettings((s) => ({ ...s, [key]: value }));
    toast({ title: "Updated", description: `${key} ${value ? "enabled" : "disabled"}.` });
  };

  const items = [
    { key: "privateAccount", icon: Lock, label: "Private Account", desc: "Only verified followers can see your posts" },
    { key: "blockScreenshots", icon: EyeOff, label: "Block Screenshots", desc: "Prevent others from screenshotting your content" },
    { key: "e2eeMessages", icon: ShieldCheck, label: "End-to-End Encrypted DMs", desc: "Messages can only be read by you and the recipient" },
    { key: "aiModeration", icon: ScanFace, label: "AI Content Moderation", desc: "Automatically filter unsafe content from your feed" },
    { key: "hideActivity", icon: UserX, label: "Hide Activity Status", desc: "Don't show when you're online or last active" },
    { key: "blockMessageRequests", icon: MessageSquareOff, label: "Block Message Requests", desc: "Only people you follow can DM you" },
  ] as const;

  return (
    <SettingsLayout title="Privacy & Safety" description="Maximum protection by default 💜">
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
            <Switch
              checked={settings[key]}
              onCheckedChange={(v) => update(key, v)}
            />
          </div>
        ))}
        <p className="text-[11px] text-muted-foreground text-center pt-4">
          Femmly is built on a zero-tolerance safety policy. All messages are E2E encrypted and AI-moderated 24/7.
        </p>
      </div>
    </SettingsLayout>
  );
};

export default PrivacySafety;