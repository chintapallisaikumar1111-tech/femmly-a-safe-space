import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Heart, Users } from "lucide-react";
import femmlyLogo from "@/assets/femmly-logo.png";
import heroImage from "@/assets/hero-image.jpg";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Hero image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-end px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <img src={femmlyLogo} alt="Femmly" className="mx-auto h-24 w-24 mb-4" />
          <h1 className="text-4xl font-bold font-display text-foreground mb-2">Femmly</h1>
          <p className="text-base text-muted-foreground max-w-xs mx-auto">
            A safe space built by women, for women. Express yourself freely.
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 mb-8"
        >
          {[
            { icon: Shield, label: "Safe" },
            { icon: Heart, label: "Supportive" },
            { icon: Users, label: "Women Only" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border px-3 py-1.5"
            >
              <Icon size={14} className="text-primary" />
              <span className="text-xs font-medium text-foreground">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm space-y-3"
        >
          <button
            onClick={() => navigate("/auth")}
            className="w-full rounded-2xl gradient-femmly py-4 text-base font-semibold text-primary-foreground shadow-femmly-lg transition-transform active:scale-[0.98]"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/auth?mode=login")}
            className="w-full rounded-2xl border border-border bg-background py-4 text-base font-semibold text-foreground transition-transform active:scale-[0.98]"
          >
            I already have an account
          </button>
        </motion.div>

        <p className="mt-6 text-center text-xs text-muted-foreground max-w-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Splash;
