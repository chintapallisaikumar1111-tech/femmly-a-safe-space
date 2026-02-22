import { stories } from "@/lib/mock-data";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const StoriesBar = () => {
  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {/* Your Story */}
        <motion.button
          whileTap={{ scale: 0.95 }}
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
    </div>
  );
};

export default StoriesBar;
