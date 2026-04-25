import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const SettingsLayout = ({ title, description, children }: SettingsLayoutProps) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold font-display text-foreground truncate">{title}</h1>
            {description && (
              <p className="text-[11px] text-muted-foreground truncate">{description}</p>
            )}
          </div>
        </div>
      </header>
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-5"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default SettingsLayout;