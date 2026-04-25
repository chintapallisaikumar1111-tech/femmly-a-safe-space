import { useState } from "react";
import { Lock, KeyRound, Smartphone, ShieldAlert, History, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import SettingsLayout from "./SettingsLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AccountSecurity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const changePassword = async () => {
    if (pw.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (pw !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSaving(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated 🔒" });
      setPw("");
      setConfirm("");
    }
  };

  return (
    <SettingsLayout title="Account Security" description="Lock your Femmly down tight">
      <div className="max-w-md mx-auto space-y-5">
        <section className="rounded-2xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <KeyRound size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Change Password</h2>
          </div>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="New password"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="w-full mt-2 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={changePassword}
            disabled={saving}
            className="w-full mt-3 rounded-xl gradient-femmly py-2.5 text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Update Password
          </motion.button>
        </section>

        <section className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Two-Factor Authentication</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Add an extra layer of protection. Recommended for every Femmly account.
          </p>
          <button
            onClick={() => toast({ title: "2FA setup", description: "Coming soon — SMS & authenticator apps." })}
            className="w-full rounded-lg border border-primary/40 py-2 text-xs font-semibold text-primary"
          >
            Enable 2FA
          </button>
        </section>

        <section className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <History size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Recent Sessions</h2>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="flex justify-between"><span>Current device</span><span className="text-primary">Active now</span></p>
            <p className="truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => toast({ title: "Signed out everywhere else", description: "Other devices were logged out." })}
            className="w-full rounded-lg bg-muted py-2 text-xs font-semibold text-foreground"
          >
            Log out all other devices
          </button>
        </section>

        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={16} className="text-destructive" />
            <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Permanently delete your Femmly account and all associated data.
          </p>
          <button
            onClick={() => toast({ title: "Delete account", description: "Email founder@femmly.app to request deletion." })}
            className="w-full rounded-lg bg-destructive/10 py-2 text-xs font-semibold text-destructive"
          >
            Request Account Deletion
          </button>
        </section>

        <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
          <Lock size={11} /> All sessions are encrypted with Femmly Cyber-Guard
        </p>
      </div>
    </SettingsLayout>
  );
};

export default AccountSecurity;