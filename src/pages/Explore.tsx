import { Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { exploreImages } from "@/lib/mock-data";
import { motion } from "framer-motion";

const Explore = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl p-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-2.5">
          <Search size={18} className="text-muted-foreground" />
          <input
            placeholder="Search Femmly"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
        {["For You", "Wellness", "Entrepreneurs", "Art", "Travel", "Food"].map((cat, i) => (
          <button
            key={cat}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              i === 0
                ? "gradient-femmly text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5 px-0.5">
        {exploreImages.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`${i % 5 === 0 ? "col-span-2 row-span-2" : ""}`}
          >
            <img
              src={img}
              alt="Explore content"
              className="w-full h-full aspect-square object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Explore;
