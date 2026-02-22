import FeedHeader from "@/components/FeedHeader";
import StoriesBar from "@/components/StoriesBar";
import PostCard from "@/components/PostCard";
import BottomNav from "@/components/BottomNav";
import { posts } from "@/lib/mock-data";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <FeedHeader />
      <StoriesBar />
      <main>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
