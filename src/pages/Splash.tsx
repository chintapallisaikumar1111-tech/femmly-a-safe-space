import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Heart, Users, Sparkles, Star } from "lucide-react";
import { Suspense, lazy } from "react";
import femmlyLogo from "@/assets/femmly-logo.png";

const Scene3D = lazy(() => import("@/components/landing/Scene3D"));

const quotes = [
  "Where women connect, empower & thrive.",
  "Your safe space. Your voice. Your world.",
  "Built by Men. For women. Always.",
];

const features = [
  { icon: Shield, title: "100% Safe", desc: "AI-verified women-only community" },
  { icon: Heart, title: "Supportive", desc: "Zero harassment, zero trolls" },
  { icon: Users, title: "Empowering", desc: "Connect with inspiring women" },
  { icon: Sparkles, title: "Express Freely", desc: "Share without fear or judgement" },
];

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="absolute inset-0 gradient-femmly-soft opacity-50" />
        }>
          <Scene3D />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center"
          >
            <motion.img
              src={femmlyLogo}
              alt="Femmly"
              className="mx-auto h-24 w-24 mb-4 drop-shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h1 className="text-5xl font-bold font-display gradient-text-femmly mb-2">
              Femmly
            </h1>
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-6">
              Women-Only Social Platform
            </p>
          </motion.div>

          {/* Animated Quote Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="h-12 flex items-center justify-center mb-6"
          >
            {quotes.map((quote, i) => (
              <motion.p
                key={i}
                className="absolute text-center text-base font-display text-foreground/80 italic max-w-xs px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [20, 0, 0, -20],
                }}
                transition={{
                  duration: 4,
                  delay: i * 4,
                  repeat: Infinity,
                  repeatDelay: (quotes.length - 1) * 4,
                }}
              >
                "{quote}"
              </motion.p>
            ))}
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6"
          >
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.15 }}
                className="rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 p-3 text-center shadow-femmly"
              >
                <div className="w-9 h-9 rounded-full gradient-femmly mx-auto mb-2 flex items-center justify-center">
                  <Icon size={16} className="text-primary-foreground" />
                </div>
                <p className="text-xs font-bold text-foreground">{title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="w-full max-w-sm mx-auto space-y-3"
          >
            <button
              onClick={() => navigate("/auth")}
              className="w-full rounded-2xl gradient-femmly py-4 text-base font-semibold text-primary-foreground shadow-femmly-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Star size={18} />
              Get Started
            </button>
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="w-full rounded-2xl border border-border bg-card/60 backdrop-blur-md py-4 text-base font-semibold text-foreground transition-transform active:scale-[0.98]"
            >
              I already have an account
            </button>
          </motion.div>

          {/* Founder & Legal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-6 text-center space-y-2"
          >
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full gradient-femmly" />
              <p className="text-xs text-muted-foreground">
                Founded by <span className="font-semibold gradient-text-femmly">Sai Kumar CH</span>
              </p>
              <div className="w-1.5 h-1.5 rounded-full gradient-femmly" />
            </div>
            <p className="text-[10px] text-muted-foreground/60">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
            <p className="text-[10px] text-muted-foreground font-mono mt-1">
              © 2025 Femmly. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
