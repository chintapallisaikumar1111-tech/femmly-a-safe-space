import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Star, Download, Apple, Smartphone, Play, X, ArrowRight,
  MessageCircle, Heart, Sparkles, Lock,
} from "lucide-react";
import { useState } from "react";
import femmlyLogo from "@/assets/femmly-logo.png";
import landingBg from "@/assets/landing-bg.jpg";
import demoVideo from "@/assets/femmly-demo.mp4.asset.json";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";
import post4 from "@/assets/post-4.jpg";

const APK_URL =
  "https://github.com/chintapallisaikumar1111-tech/femmly-a-safe-space/releases/download/v1.0/Femmly.apk";

const stories = [
  { name: "Priya", img: avatar1 },
  { name: "Aisha", img: avatar2 },
  { name: "Sofia", img: avatar3 },
  { name: "Yuna", img: avatar4 },
];

const community = [
  { name: "Priya S.", city: "Mumbai", img: post1, avatar: avatar1 },
  { name: "Aisha M.", city: "London", img: post2, avatar: avatar2 },
  { name: "Sofia R.", city: "São Paulo", img: post3, avatar: avatar3 },
  { name: "Yuna K.", city: "Seoul", img: post4, avatar: avatar4 },
];

const Splash = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="dark relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Fixed background image with dark overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingBg})` }}
        aria-hidden
      />
      <div className="fixed inset-0 z-0 bg-background/85" aria-hidden />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/40 via-background/70 to-background pointer-events-none" aria-hidden />

      {/* Page content */}
      <main className="relative z-10">
        {/* HERO */}
        <section className="px-6 pt-16 pb-20 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Women-only · AI Verified
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-8 mx-auto h-20 w-20 rounded-2xl bg-card/80 backdrop-blur-md border border-border/60 flex items-center justify-center shadow-femmly-lg"
          >
            <img src={femmlyLogo} alt="Femmly logo" className="h-14 w-14" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-8 font-display text-7xl sm:text-8xl font-bold tracking-tight text-foreground"
          >
            Femmly
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-base text-muted-foreground max-w-md mx-auto leading-relaxed"
          >
            A women-only social space built for safe sharing, real connection, and private conversations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col gap-3 max-w-sm mx-auto"
          >
            <button
              onClick={() => navigate("/auth")}
              className="group w-full rounded-2xl gradient-femmly py-4 text-base font-semibold text-primary-foreground shadow-femmly-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Star size={18} fill="currentColor" />
              Get Started Free
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="w-full rounded-2xl border border-border bg-card/60 backdrop-blur-md py-4 text-base font-semibold text-foreground transition-transform active:scale-[0.98]"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className="w-full rounded-2xl border border-pink-400/40 bg-pink-500/10 backdrop-blur-md py-4 text-base font-semibold text-pink-300 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Play size={16} />
              Watch App Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2">
              {[avatar1, avatar2, avatar3, avatar4].map((a, i) => (
                <img
                  key={i}
                  src={a}
                  alt=""
                  className="w-7 h-7 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">10,000+ women</p>
              <p className="text-[10px] text-muted-foreground">already joined</p>
            </div>
          </motion.div>
        </section>

        {/* FEED PREVIEW */}
        <section className="px-6 py-16 max-w-2xl mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">See it in action</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">A feed built for you</h2>
          <p className="mt-3 text-sm text-muted-foreground">Real posts, real women, real moments.</p>

          <div className="mt-10 mx-auto max-w-xs rounded-3xl bg-card/80 backdrop-blur-xl border border-border/60 shadow-femmly-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <img src={femmlyLogo} alt="" className="w-7 h-7" />
              <span className="font-display text-base font-semibold text-primary">femmly</span>
              <img src={avatar2} alt="" className="w-7 h-7 rounded-full object-cover" />
            </div>
            {community.slice(0, 2).map((p, i) => (
              <div key={i} className="px-4 py-3 border-b border-border/30 last:border-0 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{i === 0 ? "2m ago" : "15m ago"}</p>
                  </div>
                </div>
                <p className="text-xs mb-2">
                  {i === 0 ? "Morning run done ✨ Feeling unstoppable today!" : "Finally tried that recipe — turned out amazing 🍝"}
                </p>
                <img src={p.img} alt="" className="w-full h-32 object-cover rounded-lg" />
                <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                  <span className="flex items-center gap-1 text-[11px]"><Heart size={12} className="text-pink-400" fill="currentColor" /> {48 - i * 12}</span>
                  <span className="flex items-center gap-1 text-[11px]"><MessageCircle size={12} /> 12</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="px-6 py-12 max-w-2xl mx-auto">
          <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md p-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "100+", l: "Countries" },
                { v: "24/7", l: "Safe Moderation" },
                { v: "∞", l: "Private Chats" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-border/40 p-4 text-center">
                  <p className="font-display text-2xl font-bold text-foreground">{s.v}</p>
                  <p className="mt-1 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMUNITY GRID */}
        <section className="px-6 py-16 max-w-2xl mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-pink-400">Community</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">Women who inspire</h2>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {community.map((c) => (
              <motion.div
                key={c.name}
                whileHover={{ y: -4 }}
                className="relative aspect-square rounded-2xl overflow-hidden border border-border/40"
              >
                <img src={c.img} alt={c.name} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                  <img src={c.avatar} alt="" className="w-7 h-7 rounded-full border border-white/40 object-cover" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">{c.name}</p>
                    <p className="text-[10px] text-white/70">{c.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* STORIES */}
        <section className="px-6 py-16 max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Stories, live & shared</h2>
          <p className="mt-2 text-sm text-muted-foreground">Moments that matter, for 24 hours.</p>
          <div className="mt-8 flex items-center justify-center gap-5 flex-wrap">
            {stories.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-1.5">
                <div className="story-ring">
                  <img src={s.img} alt={s.name} className="w-16 h-16 rounded-full object-cover bg-background border-2 border-background" />
                </div>
                <span className="text-[11px] text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* JOIN MOVEMENT */}
        <section className="px-6 py-16 max-w-2xl mx-auto">
          <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md p-8 text-center">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">Join the movement</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">A calmer, safer social home</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              Every scroll should feel intentional — soft motion, warm colors, and a community-first rhythm all the way to the bottom.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/auth")}
                className="rounded-2xl gradient-femmly px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-femmly-lg active:scale-[0.98] transition-transform"
              >
                Create account
              </button>
              <a
                href={APK_URL}
                download="Femmly.apk"
                className="rounded-2xl border border-border bg-card/70 px-8 py-3.5 text-sm font-semibold text-foreground active:scale-[0.98] transition-transform"
              >
                Install app
              </a>
            </div>
          </div>
        </section>

        {/* DOWNLOAD APP */}
        <section className="px-6 py-12 max-w-2xl mx-auto">
          <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md p-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              <Download size={12} /> Download the App
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold">Take Femmly with you</h2>
            <p className="mt-2 text-sm text-muted-foreground">Android & iOS. Free forever.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
              <a
                href={APK_URL}
                download="Femmly.apk"
                className="flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 py-3.5 text-sm font-semibold text-primary active:scale-[0.98] transition-transform"
              >
                <Smartphone size={16} /> Android
              </a>
              <a
                href="https://apps.apple.com/app/femmly"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-accent/50 bg-accent/10 py-3.5 text-sm font-semibold text-foreground active:scale-[0.98] transition-transform"
              >
                <Apple size={16} /> iOS
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 pt-10 pb-32 max-w-2xl mx-auto text-center">
          <div className="mx-auto w-px h-8 bg-border/60" />
          <img src={femmlyLogo} alt="Femmly" className="mx-auto mt-6 h-10 w-10 opacity-70" />
          <p className="mt-4 text-xs text-muted-foreground">
            Founder &amp; Published by <span className="font-semibold text-foreground">Sai Kumar Chintapalli</span>
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground/60">© 2025 Femmly. All rights reserved.</p>
        </footer>
      </main>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-3 bg-gradient-to-t from-background via-background/90 to-transparent safe-bottom">
        <button
          onClick={() => navigate("/auth")}
          className="w-full max-w-md mx-auto block rounded-2xl gradient-femmly py-4 text-sm font-semibold text-primary-foreground shadow-femmly-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Star size={16} fill="currentColor" />
          Join Femmly — It's Free
        </button>
      </div>

      {/* Demo Video Modal */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center text-foreground shadow-lg"
            aria-label="Close demo"
          >
            <X size={20} />
          </button>
          <div
            className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden shadow-femmly-lg border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={demoVideo.url}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-cover bg-black"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Splash;
