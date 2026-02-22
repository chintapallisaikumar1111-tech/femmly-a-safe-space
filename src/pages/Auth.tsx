import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import femmlyLogo from "@/assets/femmly-logo.png";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") === "login");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/feed");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate("/welcome")} aria-label="Back">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
      </div>

      <div className="px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <img src={femmlyLogo} alt="Femmly" className="h-16 w-16 mb-4" />
          <h1 className="text-2xl font-bold font-display text-foreground">
            {isLogin ? "Welcome back" : "Join Femmly"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Sign in to your safe space" : "Create your account to get started"}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-muted px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start gap-3 rounded-xl gradient-femmly-soft p-4">
                <Shield size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground leading-relaxed">
                  Femmly is a women-only platform. After registration, you'll complete our
                  identity verification process to ensure everyone's safety.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl gradient-femmly py-3.5 text-sm font-semibold text-primary-foreground shadow-femmly transition-transform active:scale-[0.98]"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </motion.form>
        </AnimatePresence>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="font-semibold gradient-text-femmly">
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
