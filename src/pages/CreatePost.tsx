import { ArrowLeft, Image, Camera, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const CreatePost = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft size={24} className="text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">New Post</h1>
          <button className="text-sm font-semibold text-primary">Share</button>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center px-6 pt-20">
        <div className="w-full max-w-sm space-y-4">
          <button className="flex w-full items-center gap-4 rounded-2xl border border-border p-5 transition-colors hover:bg-muted">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-femmly">
              <Image size={24} className="text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Photo/Video</p>
              <p className="text-xs text-muted-foreground">Share from your gallery</p>
            </div>
          </button>

          <button className="flex w-full items-center gap-4 rounded-2xl border border-border p-5 transition-colors hover:bg-muted">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Camera size={24} className="text-secondary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Camera</p>
              <p className="text-xs text-muted-foreground">Take a new photo</p>
            </div>
          </button>

          <button className="flex w-full items-center gap-4 rounded-2xl border border-border p-5 transition-colors hover:bg-muted">
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
    </div>
  );
};

export default CreatePost;
