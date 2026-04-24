import { stories } from "@/lib/mock-data";
import { Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const StoriesBar = () => {
  const [active, setActive] = useState<typeof stories[0] | null>(null);
  const { toast } = useToast();
  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {/* Your Story */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => toast({ title: "Add your story", description: "Camera coming up..." })}
          className="flex flex-col items-center gap-1.5 flex-shrink-0"
        >
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <img
                src={stories[0].user.avatar}
                alt="Your story"
                className="h-14 w-14 rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full gradient-femmly flex items-center justify-center border-2 border-background">
              <Plus size={12} className="text-primary-foreground" />
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground">Your story</span>
        </motion.button>

        {/* Other stories */}
        {stories.slice(1).map((story, i) => (
          <motion.button
            key={story.id}
            onClick={() => setActive(story)}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className={story.isViewed ? "p-[2.5px] rounded-full bg-muted" : "story-ring"}>
              <div className="rounded-full bg-background p-[2px]">
                <img
                  src={story.user.avatar}
                  alt={story.user.username}
                  className="h-14 w-14 rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground w-16 truncate text-center">
              {story.user.username.split(".")[0]}
            </span>
          </motion.button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-xs p-0 overflow-hidden bg-foreground border-0">
          {active && (
            <div className="relative aspect-[9/16] flex flex-col">
              <div className="absolute top-0 left-0 right-0 h-1 bg-background/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  onAnimationComplete={() => setActive(null)}
                  className="h-full bg-background"
                />
              </div>
              <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10">
                <img src={active.user.avatar} alt={active.user.username} className="h-8 w-8 rounded-full object-cover border-2 border-background" />
                <span className="text-xs font-semibold text-background">{active.user.username}</span>
                <button onClick={() => setActive(null)} className="ml-auto text-background"><X size={20} /></button>
              </div>
              <img src={active.user.avatar} alt="" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <p className="text-center text-background font-display text-xl drop-shadow-lg">
                  ✨ Sharing the day with my Femmly sisters ✨
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoriesBar;
