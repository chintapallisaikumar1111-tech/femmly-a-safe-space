import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Star, Download, Apple, Smartphone, Play, X, ArrowRight,
  MessageCircle, Heart, Sparkles,
} from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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
  const [agreed, setAgreed] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  const handleGetStarted = () => {
    if (!agreed) {
      toast.error("Please accept the Terms and Privacy Policy to continue.");
      return;
    }
    navigate("/auth");
  };

  return (
    <div className="dark relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Fixed background image with parallax + zoom */}
      <motion.div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingBg})`, y: bgY, scale: bgScale }}
        aria-hidden
      />
      <div className="fixed inset-0 z-0 bg-background/85" aria-hidden />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/40 via-background/70 to-background pointer-events-none" aria-hidden />

      {/* Floating ambient orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Floating sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${10 + i * 11}%`, top: `${15 + (i * 9) % 70}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          >
            <Sparkles size={10 + (i % 3) * 4} className="text-primary/60" />
          </motion.div>
        ))}
      </div>

      {/* Page content */}
      <main className="relative z-10">
        {/* HERO */}
        <section ref={heroRef} className="px-6 pt-16 pb-20 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            Women-only · AI Verified
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.9, type: "spring", bounce: 0.5 }}
            whileHover={{ scale: 1.08, rotate: 6 }}
            className="mt-8 mx-auto h-20 w-20 rounded-2xl bg-card/80 backdrop-blur-md border border-border/60 flex items-center justify-center shadow-femmly-lg"
          >
            <motion.img
              src={femmlyLogo}
              alt="Femmly logo"
              className="h-14 w-14"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-8 font-display text-7xl sm:text-8xl font-bold tracking-tight text-foreground"
          >
            Femmly
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-2 font-display text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-300 to-pink-300 bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]"
          >
            Real.
          </motion.h2>

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
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px hsl(var(--primary) / 0.6)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGetStarted}
              disabled={!agreed}
              className="group relative overflow-hidden w-full rounded-2xl gradient-femmly py-4 text-base font-semibold text-primary-foreground shadow-femmly-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <Star size={18} fill="currentColor" className="relative z-10" />
              Get Started Free
              <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/auth?mode=login")}
              className="w-full rounded-2xl border border-border bg-card/60 backdrop-blur-md py-4 text-base font-semibold text-foreground"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowVideo(true)}
              className="w-full rounded-2xl border border-pink-400/40 bg-pink-500/10 backdrop-blur-md py-4 text-base font-semibold text-pink-300 flex items-center justify-center gap-2"
            >
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <Play size={16} />
              </motion.span>
              Watch App Demo
            </motion.button>

            <label className="mt-2 flex items-start gap-3 text-left cursor-pointer select-none rounded-xl border border-border/50 bg-card/40 backdrop-blur-md p-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary cursor-pointer"
                aria-label="Agree to Terms and Privacy Policy"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I'm 16+ and agree to Femmly's{" "}
                <Link to="/terms" className="text-primary font-semibold underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary font-semibold underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
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
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="px-6 py-16 max-w-2xl mx-auto text-center"
        >
          <motion.p variants={fadeUp} className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">See it in action</motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 font-display text-4xl sm:text-5xl font-bold">A feed built for you</motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-sm text-muted-foreground">Real posts, real women, real moments.</motion.p>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
            style={{ transformPerspective: 1000 }}
            className="mt-10 mx-auto max-w-xs rounded-3xl bg-card/80 backdrop-blur-xl border border-border/60 shadow-femmly-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <img src={femmlyLogo} alt="" className="w-7 h-7" />
              <span className="font-display text-base font-semibold text-primary">femmly</span>
              <img src={avatar2} alt="" className="w-7 h-7 rounded-full object-cover" />
            </div>
            {community.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="px-4 py-3 border-b border-border/30 last:border-0 text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{["2m ago","15m ago","1h ago","3h ago"][i]}</p>
                  </div>
                </div>
                <p className="text-xs mb-2">
                  {[
                    "Morning run done ✨ Feeling unstoppable today!",
                    "Finally tried that recipe — turned out amazing 🍜",
                    "Sunsets hit different when you're present 🌅",
                    "A little journaling and a lot more peace today 🤍",
                  ][i]}
                </p>
                <img src={p.img} alt="" className="w-full h-32 object-cover rounded-lg" />
                <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                  <span className="flex items-center gap-1 text-[11px]">
                    <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}>
                      <Heart size={12} className="text-pink-400" fill="currentColor" />
                    </motion.span>
                    {[48,91,134,76][i]}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]"><MessageCircle size={12} /> {[12,23,37,18][i]}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* STATS */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="px-6 py-12 max-w-2xl mx-auto"
        >
          <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md p-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "100+", l: "Countries" },
                { v: "24/7", l: "Safe Moderation" },
                { v: "∞", l: "Private Chats" },
              ].map((s) => (
                <motion.div
                  key={s.l}
                  variants={fadeUp}
                  whileHover={{ scale: 1.06, y: -4 }}
                  className="rounded-2xl border border-border/40 p-4 text-center cursor-default"
                >
                  <p className="font-display text-2xl font-bold text-foreground">{s.v}</p>
                  <p className="mt-1 text-[10px] tracking-[0.18em] uppercase text-muted-foreground">{s.l}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* COMMUNITY GRID */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="px-6 py-16 max-w-2xl mx-auto text-center"
        >
          <motion.p variants={fadeUp} className="text-[11px] font-bold tracking-[0.2em] uppercase text-pink-400">Community</motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 font-display text-4xl sm:text-5xl font-bold">Women who inspire</motion.h2>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {community.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.03, rotate: i % 2 === 0 ? 1 : -1 }}
                className="relative aspect-square rounded-2xl overflow-hidden border border-border/40"
              >
                <motion.img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.6 }}
                />
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
        </motion.section>

        {/* STORIES */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="px-6 py-16 max-w-2xl mx-auto text-center"
        >
          <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold">Stories, live & shared</motion.h2>
          <motion.p variants={fadeUp} className="mt-2 text-sm text-muted-foreground">Moments that matter, for 24 hours.</motion.p>
          <div className="mt-8 flex items-center justify-center gap-5 flex-wrap">
            {stories.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.1 }}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <motion.div
                  className="story-ring"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <img src={s.img} alt={s.name} className="w-16 h-16 rounded-full object-cover bg-background border-2 border-background" />
                </motion.div>
                <span className="text-[11px] text-muted-foreground">{s.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* JOIN MOVEMENT */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="px-6 py-16 max-w-2xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md p-8 text-center"
          >
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">Join the movement</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">A calmer, safer social home</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              Every scroll should feel intentional — soft motion, warm colors, and a community-first rhythm all the way to the bottom.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                className="rounded-2xl gradient-femmly px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-femmly-lg"
              >
                Create account
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={APK_URL}
                download="Femmly.apk"
                className="inline-block rounded-2xl border border-border bg-card/70 px-8 py-3.5 text-sm font-semibold text-foreground"
              >
                Install app
              </motion.a>
            </div>
          </motion.div>
        </motion.section>

        {/* DOWNLOAD APP */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="px-6 py-12 max-w-2xl mx-auto"
        >
          <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md p-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                <Download size={12} />
              </motion.span>
              Download the App
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold">Take Femmly with you</h2>
            <p className="mt-2 text-sm text-muted-foreground">Android & iOS. Free forever.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={APK_URL}
                download="Femmly.apk"
                className="flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 py-3.5 text-sm font-semibold text-primary"
              >
                <Smartphone size={16} /> Android
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://apps.apple.com/app/femmly"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-accent/50 bg-accent/10 py-3.5 text-sm font-semibold text-foreground"
              >
                <Apple size={16} /> iOS
              </motion.a>
            </div>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="px-6 pt-10 pb-32 max-w-2xl mx-auto text-center">
          <div className="mx-auto w-px h-8 bg-border/60" />
          <motion.img
            src={femmlyLogo}
            alt="Femmly"
            className="mx-auto mt-6 h-10 w-10 opacity-70"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/40">·</span>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Founder &amp; Published by <span className="font-semibold text-foreground">Sai Kumar Chintapalli</span>
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground/60">© 2025 Femmly. All rights reserved.</p>
        </footer>
      </main>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-3 bg-gradient-to-t from-background via-background/90 to-transparent safe-bottom">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          animate={{ boxShadow: ["0 10px 30px -10px hsl(var(--primary)/0.4)", "0 15px 40px -10px hsl(var(--primary)/0.7)", "0 10px 30px -10px hsl(var(--primary)/0.4)"] }}
          transition={{ boxShadow: { duration: 2.5, repeat: Infinity } }}
          onClick={() => navigate("/auth")}
          className="w-full max-w-md mx-auto rounded-2xl gradient-femmly py-4 text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2"
        >
          <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
            <Star size={16} fill="currentColor" />
          </motion.span>
          Join Femmly — It's Free
        </motion.button>
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
