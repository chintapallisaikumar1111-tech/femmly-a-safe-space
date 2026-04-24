import { ArrowLeft, Image, Camera, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const CreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [textOpen, setTextOpen] = useState(false);
  const [text, setText] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      toast({ title: "Photo selected", description: e.target.files[0].name });
      setTimeout(() => navigate("/"), 800);
    }
  };

  const handleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      toast({ title: "Camera ready", description: "Capture flow opening soon" });
    } catch {
      toast({ title: "Camera unavailable", variant: "destructive" });
    }
  };

  const handleShare = () => {
    if (text.trim()) {
      toast({ title: "Posted! ✨", description: "Your post is live." });
      setText("");
      setTextOpen(false);
      navigate("/");
    } else {
      toast({ title: "Add some text first", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft size={24} className="text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">New Post</h1>
          <button onClick={handleShare} className="text-sm font-semibold text-primary">Share</button>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center px-6 pt-20">
        <div className="w-full max-w-sm space-y-4">
          <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={handleFile} />
          <button onClick={() => fileRef.current?.click()} className="flex w-full items-center gap-4 rounded-2xl border border-border p-5 transition-colors hover:bg-muted">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-femmly">
              <Image size={24} className="text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Photo/Video</p>
              <p className="text-xs text-muted-foreground">Share from your gallery</p>
            </div>
          </button>

          <button onClick={handleCamera} className="flex w-full items-center gap-4 rounded-2xl border border-border p-5 transition-colors hover:bg-muted">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Camera size={24} className="text-secondary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Camera</p>
              <p className="text-xs text-muted-foreground">Take a new photo</p>
            </div>
          </button>

          <button onClick={() => setTextOpen(true)} className="flex w-full items-center gap-4 rounded-2xl border border-border p-5 transition-colors hover:bg-muted">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <Type size={24} className="text-accent-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Text Post</p>
              <p className="text-xs text-muted-foreground">Share your thoughts</p>
            </div>
          </button>
        </div>
      </div>

      <BottomNav />

      <Dialog open={textOpen} onOpenChange={setTextOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Share your thoughts</DialogTitle>
          </DialogHeader>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="What's on your mind?"
            className="w-full rounded-xl border border-border bg-muted p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          <button
            onClick={handleShare}
            className="w-full rounded-xl gradient-femmly py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Post
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
