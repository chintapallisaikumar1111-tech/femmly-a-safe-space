import { Search, Loader2, Sparkles, X } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { exploreItems, type ExploreItem } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["For You", "Wellness", "Entrepreneurs", "Art", "Travel", "Food"];

const Explore = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("For You");
  const [results, setResults] = useState<ExploreItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // Category-based filter (instant)
  const categoryFiltered = useMemo(() => {
    if (category === "For You") return exploreItems;
    const tag = category.toLowerCase().replace(/s$/, "");
    return exploreItems.filter((it) =>
      it.tags.some((t) => t.toLowerCase().includes(tag))
    );
  }, [category]);

  // AI search (debounced)
  useEffect(() => {
    if (!query.trim()) { setResults(null); return; }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-search`;
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ query, items: exploreItems }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          toast({ title: "Search error", description: data.error || "Try again.", variant: "destructive" });
          setLoading(false);
          return;
        }
        const ids: string[] = data.ids ?? [];
        const map = new Map(exploreItems.map((it) => [it.id, it]));
        setResults(ids.map((id) => map.get(id)).filter(Boolean) as ExploreItem[]);
      } catch (e: any) {
        toast({ title: "Network error", description: e.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }, 450);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [query, toast]);

  const items = results ?? categoryFiltered;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl p-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-2.5">
          {loading ? (
            <Loader2 size={18} className="text-primary animate-spin" />
          ) : query ? (
            <Sparkles size={18} className="text-primary" />
          ) : (
            <Search size={18} className="text-muted-foreground" />
          )}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Femmly AI… e.g. cozy morning routines"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults(null); }} aria-label="Clear search">
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
        {query && (
          <p className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1">
            <Sparkles size={10} className="text-primary" />
            AI understanding your search · {results ? `${results.length} matches` : "thinking…"}
          </p>
        )}
      </div>

      {/* Category pills */}
      {!query && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const active = cat === category;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "gradient-femmly text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-16 px-6">
          {query ? `No matches for "${query}". Try a different mood or topic.` : "Nothing here yet."}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 px-0.5">
          {items.map((it, i) => (
            <motion.div
              key={it.id + "-" + i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`${!query && i % 5 === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <img
                src={it.src}
                alt={it.caption}
                className="w-full h-full aspect-square object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Explore;
