import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Shield, Flag, Link2, EyeOff } from "lucide-react";
import { Post } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);
  const [showHeart, setShowHeart] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ user: string; text: string }[]>([
    { user: "emma.wellness", text: "This is everything 💕" },
    { user: "priya.ceo", text: "Inspiring!" },
  ]);
  const { toast } = useToast();

  const handleShare = async () => {
    const url = `${window.location.origin}/?post=${post.id}`;
    try {
      if (navigator.share) await navigator.share({ title: "Femmly post", url });
      else { await navigator.clipboard.writeText(url); toast({ title: "Link copied" }); }
    } catch {}
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    setComments([...comments, { user: "you", text: comment }]);
    setComment("");
    toast({ title: "Comment added" });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes(prev => prev + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="story-ring">
            <div className="rounded-full bg-background p-[1.5px]">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">{post.user.username}</span>
              {post.user.isVerified && (
                <Shield size={14} className="text-primary fill-primary" />
              )}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground" aria-label="More options">
              <MoreHorizontal size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast({ title: "Reported", description: "Our team will review within 24h." })}>
              <Flag size={14} className="mr-2" /> Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Hidden", description: "You won't see this again." })}>
              <EyeOff size={14} className="mr-2" /> Hide
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              <Link2 size={14} className="mr-2" /> Copy link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image */}
      <div className="relative" onDoubleClick={handleDoubleTap}>
        <img
          src={post.image}
          alt={post.caption}
          className="w-full aspect-[4/5] object-cover"
          loading="lazy"
        />
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Heart size={80} className="fill-primary-foreground text-primary-foreground drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={handleLike}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <Heart
                size={24}
                className={isLiked ? "fill-destructive text-destructive animate-heart-pop" : "text-foreground"}
                strokeWidth={1.5}
              />
            </motion.button>
            <button aria-label="Comment" onClick={() => setCommentsOpen(true)}>
              <MessageCircle size={24} className="text-foreground" strokeWidth={1.5} />
            </button>
            <button aria-label="Share" onClick={handleShare}>
              <Send size={24} className="text-foreground" strokeWidth={1.5} />
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 1.2 }}
            onClick={() => setIsSaved(!isSaved)}
            aria-label={isSaved ? "Unsave" : "Save"}
          >
            <Bookmark
              size={24}
              className={isSaved ? "fill-foreground text-foreground" : "text-foreground"}
              strokeWidth={1.5}
            />
          </motion.button>
        </div>

        {/* Likes */}
        <p className="mt-2 text-sm font-semibold text-foreground">
          {likes.toLocaleString()} likes
        </p>

        {/* Caption */}
        <p className="mt-1 text-sm text-foreground">
          <span className="font-semibold">{post.user.username}</span>{" "}
          {post.caption}
        </p>

        {/* Comments link */}
        <button onClick={() => setCommentsOpen(true)} className="mt-1 text-sm text-muted-foreground">
          View all {post.comments} comments
        </button>

        {/* Time */}
        <p className="mt-1 text-[11px] text-muted-foreground uppercase">
          {post.timeAgo} ago
        </p>
      </div>

      <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Comments</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {comments.map((c, i) => (
              <div key={i} className="text-sm">
                <span className="font-semibold text-foreground">{c.user}</span>{" "}
                <span className="text-foreground">{c.text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t border-border">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="Add a comment..."
              className="flex-1 rounded-lg bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={submitComment} className="rounded-lg gradient-femmly px-4 py-2 text-xs font-semibold text-primary-foreground">
              Post
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
};

export default PostCard;
