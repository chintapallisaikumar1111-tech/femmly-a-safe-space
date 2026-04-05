import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import femmlyLogo from "@/assets/femmly-logo.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Enter admin credentials", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Invalid credentials", variant: "destructive" });
      } else {
        // Auth state will update, then we check admin in the component
        navigate("/admin");
      }
    } catch {
      toast({ title: "Login failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <img src={femmlyLogo} alt="Femmly" className="h-16 w-16 mx-auto" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-femmly flex items-center justify-center shadow-femmly">
              <Shield size={14} className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Restricted to authorized administrators only
          </p>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 border border-border p-3 mb-6">
          <Lock size={16} className="text-primary flex-shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This is a secured admin portal. Unauthorized access attempts are logged and monitored.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@femmly.app"
              className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl gradient-femmly py-3.5 text-sm font-semibold text-primary-foreground shadow-femmly transition-transform active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            <Shield size={16} />
            Access Admin Panel
          </button>
        </form>

        <button
          onClick={() => navigate("/welcome")}
          className="w-full mt-4 text-sm text-muted-foreground text-center py-2"
        >
          ← Back to Femmly
        </button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
