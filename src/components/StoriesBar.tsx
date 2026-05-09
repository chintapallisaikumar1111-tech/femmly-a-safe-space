import { stories } from "@/lib/mock-data";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const StoriesBar = () => {
  // Other stories (excludes "your story")
  const list = stories.slice(1);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const active = activeIdx !== null ? list[activeIdx] : null;

  const next = () => {
    if (activeIdx === null) return;
    if (activeIdx < list.length - 1) setActiveIdx(activeIdx + 1);
    else setActiveIdx(null); // close after last
  };
  const prev = () => {
    if (activeIdx === null) return;
    if (activeIdx > 0) setActiveIdx(activeIdx - 1);
  };
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
        {list.map((story, i) => (
          <motion.button
            key={story.id}
            onClick={() => setActiveIdx(i)}
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

      <Dialog open={activeIdx !== null} onOpenChange={(o) => !o && setActiveIdx(null)}>
        <DialogContent className="max-w-xs p-0 overflow-hidden bg-foreground border-0">
          {active && (
            <div className="relative aspect-[9/16] flex flex-col">
              {/* Segmented progress bars: one per story */}
              <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
                {list.map((_, i) => (
                  <div key={i} className="flex-1 h-0.5 bg-background/30 rounded-full overflow-hidden">
                    {i < activeIdx! && <div className="h-full w-full bg-background" />}
                    {i === activeIdx && (
                      <motion.div
                        key={`p-${activeIdx}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        onAnimationComplete={next}
                        className="h-full bg-background"
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* Tap zones: left = prev, right = next */}
              <button
                aria-label="Previous story"
                onClick={prev}
                className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
              />
              <button
                aria-label="Next story"
                onClick={next}
                className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
              />
              {/* Visible chevrons */}
              {activeIdx! > 0 && (
                <button onClick={prev} className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-background/30 text-background">
                  <ChevronLeft size={18} />
                </button>
              )}
              {activeIdx! < list.length - 1 && (
                <button onClick={next} className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-background/30 text-background">
                  <ChevronRight size={18} />
                </button>
              )}
              <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10">
                <img src={active.user.avatar} alt={active.user.username} className="h-8 w-8 rounded-full object-cover border-2 border-background" />
                <span className="text-xs font-semibold text-background">{active.user.username}</span>
                <button onClick={() => setActiveIdx(null)} className="ml-auto text-background z-20"><X size={20} /></button>
              </div>
              <motion.img
                key={active.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={active.user.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <motion.p
                  key={active.id + "-text"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-center text-background font-display text-xl drop-shadow-lg"
                >
                  ✨ Sharing the day with my Femmly sisters ✨
                </motion.p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoriesBar;
