import { Settings, Grid3X3, Bookmark, Shield, LogOut, UserCog, Share2, ShieldCheck, Bell, HelpCircle, Lock, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { currentUser, exploreImages, users } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";

const Profile = () => {
  const navigate = useNavigate();
  const { signOut, user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"posts" | "saved">("posts");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [listOpen, setListOpen] = useState<null | "followers" | "following">(null);
  const [name, setName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);

  const handleLogout = async () => {
    setSettingsOpen(false);
    await signOut();
    toast({ title: "Logged out", description: "See you soon 💜" });
    navigate("/welcome", { replace: true });
  };

  const handleShare = async () => {
    const url = window.location.origin + "/profile";
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Femmly Profile", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied!" });
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1">
            <h1 className="text-lg font-bold font-sans text-foreground">{currentUser.username}</h1>
            <Shield size={16} className="text-primary fill-primary" />
          </div>
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetTrigger asChild>
              <button aria-label="Settings">
                <Settings size={24} className="text-foreground" strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:max-w-sm">
              <SheetHeader>
                <SheetTitle className="font-display">Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-1">
                {[
                  { icon: UserCog, label: "Edit Profile", path: "/settings/edit-profile" },
                  { icon: ShieldCheck, label: "Privacy & Safety", path: "/settings/privacy" },
                  { icon: Bell, label: "Notifications", path: "/settings/notifications" },
                  { icon: Lock, label: "Account Security", path: "/settings/security" },
                  { icon: HelpCircle, label: "Help & Support", path: "/settings/help" },
                  { icon: Sparkles, label: "AI Assistant", path: "/settings/assistant", highlight: true },
                  ...(isAdmin ? [{ icon: ShieldCheck, label: "Admin Panel", path: "/admin" }] : []),
                ].map(({ icon: Icon, label, path, highlight }) => (
                  <button
                    key={label}
                    onClick={() => { setSettingsOpen(false); navigate(path); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${
                      highlight ? "gradient-femmly-soft border border-primary/30 hover:opacity-90" : "hover:bg-muted"
                    }`}
                  >
                    <Icon size={18} className="text-primary" />
                    <span className="text-sm font-medium text-foreground flex-1">{label}</span>
                    {highlight && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary">New</span>
                    )}
                  </button>
                ))}
                <div className="border-t border-border my-3" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 transition-colors text-left"
                >
                  <LogOut size={18} className="text-destructive" />
                  <span className="text-sm font-medium text-destructive">Log out</span>
                </button>
                <p className="text-[10px] text-muted-foreground text-center pt-6">
                  Femmly • Built by Sai Kumar CH
                  <br />
                  Signed in as {user?.email}
                </p>
              </div>
            </SheetContent>
          </Sheet>
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
            <button onClick={() => setTab("posts")} className="focus:outline-none">
              <p className="text-lg font-bold text-foreground">{currentUser.posts}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </button>
            <button onClick={() => setListOpen("followers")} className="focus:outline-none">
              <p className="text-lg font-bold text-foreground">{currentUser.followers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </button>
            <button onClick={() => setListOpen("following")} className="focus:outline-none">
              <p className="text-lg font-bold text-foreground">{currentUser.following}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-foreground">{currentUser.displayName}</p>
          <p className="text-sm text-foreground mt-0.5">{currentUser.bio}</p>
        </div>

        <div className="mt-4 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/settings/edit-profile")}
            className="flex-1 rounded-lg bg-muted py-2 text-sm font-semibold text-foreground"
          >
            Edit Profile
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="flex-1 rounded-lg bg-muted py-2 text-sm font-semibold text-foreground flex items-center justify-center gap-1.5"
          >
            <Share2 size={14} /> Share Profile
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-border">
        <button
          onClick={() => setTab("posts")}
          className={`flex-1 flex justify-center py-3 border-b-2 ${tab === "posts" ? "border-foreground" : "border-transparent"}`}
        >
          <Grid3X3 size={22} className={tab === "posts" ? "text-foreground" : "text-muted-foreground"} />
        </button>
        <button
          onClick={() => setTab("saved")}
          className={`flex-1 flex justify-center py-3 border-b-2 ${tab === "saved" ? "border-foreground" : "border-transparent"}`}
        >
          <Bookmark size={22} className={tab === "saved" ? "text-foreground" : "text-muted-foreground"} />
        </button>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {(tab === "posts" ? exploreImages.slice(0, 9) : exploreImages.slice(0, 3)).map((img, i) => (
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
        {tab === "saved" && exploreImages.length === 0 && (
          <p className="col-span-3 text-center text-sm text-muted-foreground py-12">No saved posts yet</p>
        )}
      </div>

      {/* Edit Profile dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Display Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full mt-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => { setEditOpen(false); toast({ title: "Profile updated ✨" }); }}
              className="w-full rounded-xl gradient-femmly py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Followers/Following dialog */}
      <Dialog open={!!listOpen} onOpenChange={(o) => !o && setListOpen(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display capitalize">{listOpen}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {users.filter((u) => u.id !== "me").map((u) => (
              <div key={u.id} className="flex items-center gap-3 py-2">
                <img src={u.avatar} alt={u.username} className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                    {u.username}
                    {u.isVerified && <Shield size={11} className="text-primary fill-primary" />}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{u.displayName}</p>
                </div>
                <button
                  onClick={() => toast({ title: listOpen === "followers" ? "Removed" : "Unfollowed" })}
                  className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  {listOpen === "followers" ? "Remove" : "Following"}
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Profile;
