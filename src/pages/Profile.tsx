import { Settings, Grid3X3, Bookmark, Shield } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { currentUser, exploreImages } from "@/lib/mock-data";
import { motion } from "framer-motion";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1">
            <h1 className="text-lg font-bold font-sans text-foreground">{currentUser.username}</h1>
            <Shield size={16} className="text-primary fill-primary" />
          </div>
          <button aria-label="Settings">
            <Settings size={24} className="text-foreground" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Profile info */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-6">
          <div className="story-ring flex-shrink-0">
            <div className="rounded-full bg-background p-[2px]">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-1 justify-around text-center">
            <div>
              <p className="text-lg font-bold text-foreground">{currentUser.posts}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{currentUser.followers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{currentUser.following}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-foreground">{currentUser.displayName}</p>
          <p className="text-sm text-foreground mt-0.5">{currentUser.bio}</p>
        </div>

        <div className="mt-4 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex-1 rounded-lg bg-muted py-2 text-sm font-semibold text-foreground"
          >
            Edit Profile
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex-1 rounded-lg bg-muted py-2 text-sm font-semibold text-foreground"
          >
            Share Profile
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-border">
        <button className="flex-1 flex justify-center py-3 border-b-2 border-foreground">
          <Grid3X3 size={22} className="text-foreground" />
        </button>
        <button className="flex-1 flex justify-center py-3 border-b-2 border-transparent">
          <Bookmark size={22} className="text-muted-foreground" />
        </button>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {exploreImages.slice(0, 9).map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            <img
              src={img}
              alt="Post"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
