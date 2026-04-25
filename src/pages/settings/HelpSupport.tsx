import { useState } from "react";
import { HelpCircle, Mail, MessageSquare, BookOpen, Shield, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsLayout from "./SettingsLayout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const FAQS = [
  { q: "How does Femmly verify I'm a woman?", a: "We use a strict 3-step live AI face check (front, blink, side turn). No uploads — only live captures are accepted." },
  { q: "Are my messages private?", a: "Yes — every DM on Femmly is end-to-end encrypted. Not even our team can read them." },
  { q: "Can someone screenshot my posts?", a: "Screenshots are blocked by default. You can adjust this in Privacy & Safety." },
  { q: "How do I report someone?", a: "Tap the ⋯ menu on any profile or post → Report. Our AI moderators review every report within minutes." },
  { q: "What is the 3-strike policy?", a: "Any user reported for harassment, hate, or unsafe behaviour gets one warning, one suspension, then a permanent ban." },
  { q: "How do I grow on Femmly?", a: "Use the AI Assistant in Settings — it's a personal coach for content, captions, hashtags & growth tips!" },
];

const HelpSupport = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SettingsLayout title="Help & Support" description="We're here for you 💜">
      <div className="max-w-md mx-auto space-y-5">
        <section className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/settings/assistant")}
            className="rounded-2xl gradient-femmly-soft border border-primary/30 p-4 text-left"
          >
            <MessageSquare size={20} className="text-primary mb-2" />
            <p className="text-sm font-semibold text-foreground">Ask Femmly AI</p>
            <p className="text-[11px] text-muted-foreground">Voice or chat — instant help</p>
          </button>
          <a
            href="mailto:founder@femmly.app"
            className="rounded-2xl bg-muted p-4 text-left"
          >
            <Mail size={20} className="text-primary mb-2" />
            <p className="text-sm font-semibold text-foreground">Email Support</p>
            <p className="text-[11px] text-muted-foreground">founder@femmly.app</p>
          </a>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">FAQ</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-xl bg-muted/50 overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-foreground pr-3">{f.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed"
                    >
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border p-4 flex items-start gap-3">
          <Shield size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">In danger or feeling unsafe?</p>
            <p className="text-xs text-muted-foreground mt-1">
              Femmly partners with women's safety helplines worldwide. Tap below to view emergency contacts in your region.
            </p>
            <button
              onClick={() => toast({ title: "Safety hotlines", description: "Local helplines coming soon. For now: 1091 (India Women Helpline)." })}
              className="mt-2 text-xs font-semibold text-primary"
            >
              View Safety Hotlines →
            </button>
          </div>
        </section>

        <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
          <HelpCircle size={11} /> Femmly • Built with care by Sai Kumar CH
        </p>
      </div>
    </SettingsLayout>
  );
};

export default HelpSupport;