import BottomNav from "@/components/BottomNav";
import { users } from "@/lib/mock-data";
import { Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";

const activities = [
  { user: users[1], action: "liked your photo", time: "2m", type: "like" as const },
  { user: users[2], action: "started following you", time: "1h", type: "follow" as const },
  { user: users[3], action: "commented: Beautiful! 💕", time: "3h", type: "comment" as const },
  { user: users[1], action: "mentioned you in a comment", time: "5h", type: "mention" as const },
  { user: users[2], action: "liked your story", time: "8h", type: "like" as const },
];

const Activity = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold font-sans text-foreground">Activity</h1>
        </div>
      </header>

      <div className="px-4 py-2">
        <p className="text-sm font-semibold text-foreground mb-3">Today</p>
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 py-3"
          >
            <img
              src={activity.user.avatar}
              alt={activity.user.username}
              className="h-11 w-11 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-semibold">{activity.user.username}</span>
                {activity.user.isVerified && (
                  <Shield size={12} className="inline text-primary fill-primary mx-0.5" />
                )}
                {" "}{activity.action}
                <span className="text-muted-foreground"> {activity.time}</span>
              </p>
            </div>
            {activity.type === "follow" ? (
              <button className="rounded-lg gradient-femmly px-5 py-1.5 text-xs font-semibold text-primary-foreground">
                Follow
              </button>
            ) : (
              <Heart size={16} className="text-destructive fill-destructive flex-shrink-0" />
            )}
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Activity;
