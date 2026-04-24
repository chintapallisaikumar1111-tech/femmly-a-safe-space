import { MessageCircle, Send } from "lucide-react";
import femmlyLogo from "@/assets/femmly-logo.png";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { users } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const FeedHeader = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <img src={femmlyLogo} alt="Femmly" className="h-9 w-auto" />
        <button onClick={() => setOpen(true)} className="relative" aria-label="Messages">
          <MessageCircle size={24} className="text-foreground" strokeWidth={1.5} />
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full gradient-femmly flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground">3</span>
          </div>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Messages</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {users.slice(1).map((u) => (
              <button
                key={u.id}
                onClick={() => toast({ title: `Opening chat with ${u.username}`, description: "End-to-end encrypted 🔒" })}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors text-left"
              >
                <img src={u.avatar} alt={u.username} className="h-11 w-11 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{u.username}</p>
                  <p className="text-xs text-muted-foreground truncate">Tap to start a conversation</p>
                </div>
                <Send size={16} className="text-primary" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default FeedHeader;
