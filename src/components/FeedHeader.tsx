import { MessageCircle } from "lucide-react";
import femmlyLogo from "@/assets/femmly-logo.png";

const FeedHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <img src={femmlyLogo} alt="Femmly" className="h-9 w-auto" />
        <button className="relative" aria-label="Messages">
          <MessageCircle size={24} className="text-foreground" strokeWidth={1.5} />
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full gradient-femmly flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground">3</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default FeedHeader;
