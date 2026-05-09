import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Mic, MicOff, Volume2, VolumeX, Loader2, Bot, User as UserIcon, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

type Msg = { role: "user" | "assistant"; content: string };

const CHARACTERS = [
  { id: "coach", label: "Femmly Coach", desc: "Warm growth & content coach", emoji: "💜" },
  { id: "bestie", label: "Bestie", desc: "Playful, hype-girl friend", emoji: "✨" },
  { id: "mentor", label: "Mentor", desc: "Calm, wise, professional", emoji: "🌿" },
  { id: "therapist", label: "Soft Therapist", desc: "Gentle, reflective listener", emoji: "🤍" },
  { id: "stylist", label: "Stylist", desc: "Bold creative director", emoji: "🌸" },
] as const;

const STYLES = [
  { id: "concise", label: "Concise", desc: "Short, punchy answers" },
  { id: "detailed", label: "Detailed", desc: "Step-by-step explanations" },
  { id: "casual", label: "Casual", desc: "Friendly, emoji-rich tone" },
  { id: "professional", label: "Professional", desc: "Formal, polished tone" },
] as const;

const PERSONALITY_PROMPTS: Record<string, string> = {
  coach: "Be a warm, encouraging growth coach. Focus on actionable Femmly tips.",
  bestie: "Talk like an excited best friend — playful, hype-girl energy, lots of warmth and reassurance.",
  mentor: "Be a calm, wise mentor. Speak with measured authority and life experience.",
  therapist: "Be a gentle, reflective listener. Ask soft questions, validate feelings, never judge.",
  stylist: "Be a bold creative director with strong taste. Give confident style and content opinions.",
};

const STYLE_PROMPTS: Record<string, string> = {
  concise: "Keep replies to 2–4 short sentences or quick bullets. No fluff.",
  detailed: "Give thorough, structured answers with step-by-step guidance and examples.",
  casual: "Write in a friendly conversational tone with tasteful emojis.",
  professional: "Use a polished, professional tone. Clear, direct, minimal emojis.",
};

const AssistantPage = () => {
  const { toast } = useToast();
  const [character, setCharacter] = useState<string>("coach");
  const [styleId, setStyleId] = useState<string>("casual");
  const [voiceURI, setVoiceURI] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speakReplies, setSpeakReplies] = useState(true);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hey gorgeous 💜 I'm your Femmly AI. Pick a character, voice and style from the top-right settings — then chat or tap the mic to talk to me!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load TTS voices
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      setVoices(all);
      if (!voiceURI && all.length) {
        const female = all.find((v) =>
          /female|samantha|victoria|zira|google us english|karen|tessa|moira/i.test(v.name)
        );
        setVoiceURI((female ?? all[0]).voiceURI);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, [voiceURI]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const startListening = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast({ title: "Voice not supported", description: "Try Chrome or Safari.", variant: "destructive" });
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join("");
      setInput(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (e: any) => {
      setListening(false);
      toast({ title: "Voice error", description: e.error || "Try again.", variant: "destructive" });
    };
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const speak = (text: string) => {
    if (!speakReplies) return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1.05;
    const v = voices.find((vv) => vv.voiceURI === voiceURI);
    if (v) utter.voice = v;
    window.speechSynthesis.speak(utter);
  };
  const stopSpeaking = () => "speechSynthesis" in window && window.speechSynthesis.cancel();

  const send = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    setInput("");
    stopSpeaking();
    const next: Msg[] = [...messages, { role: "user", content: message }];
    setMessages(next);
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/growth-coach`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next,
          personality: PERSONALITY_PROMPTS[character],
          style: STYLE_PROMPTS[styleId],
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 429) toast({ title: "Slow down 💜", description: err.error || "Too many requests.", variant: "destructive" });
        else if (resp.status === 402) toast({ title: "AI credits exhausted", description: err.error || "Top up usage.", variant: "destructive" });
        else toast({ title: "AI error", description: err.error || "Try again.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!resp.body) throw new Error("No response stream");

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") { done = true; break; }
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantText += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
      if (assistantText) speak(assistantText);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Network error", description: e.message || "Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const activeChar = CHARACTERS.find((c) => c.id === character)!;

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-femmly flex items-center justify-center">
              <Sparkles size={14} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold font-sans text-foreground leading-tight">
                {activeChar.emoji} {activeChar.label}
              </h1>
              <p className="text-[10px] text-muted-foreground leading-tight">{activeChar.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSpeakReplies((s) => { if (s) stopSpeaking(); return !s; });
              }}
              className="p-2 rounded-full bg-muted text-foreground"
              aria-label="Toggle voice"
            >
              {speakReplies ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-full bg-muted text-foreground" aria-label="Customize assistant">
                  <Settings2 size={16} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] sm:max-w-sm overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-display">Customize your AI</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-5">
                  <section>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Character</p>
                    <div className="grid grid-cols-1 gap-2">
                      {CHARACTERS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCharacter(c.id)}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                            character === c.id
                              ? "border-primary bg-primary/5"
                              : "border-border bg-muted/30 hover:bg-muted"
                          }`}
                        >
                          <span className="text-xl">{c.emoji}</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{c.label}</p>
                            <p className="text-[11px] text-muted-foreground">{c.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response style</p>
                    <div className="grid grid-cols-2 gap-2">
                      {STYLES.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStyleId(s.id)}
                          className={`rounded-xl border p-3 text-left transition-all ${
                            styleId === s.id
                              ? "border-primary bg-primary/5"
                              : "border-border bg-muted/30 hover:bg-muted"
                          }`}
                        >
                          <p className="text-sm font-semibold text-foreground">{s.label}</p>
                          <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Voice</p>
                    {voices.length ? (
                      <select
                        value={voiceURI}
                        onChange={(e) => setVoiceURI(e.target.value)}
                        className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm text-foreground"
                      >
                        {voices.map((v) => (
                          <option key={v.voiceURI} value={v.voiceURI}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-muted-foreground">Loading voices…</p>
                    )}
                    <button
                      onClick={() => speak(`Hi, I'm your ${activeChar.label}. How do I sound?`)}
                      className="mt-2 text-xs rounded-full bg-primary/10 text-primary px-3 py-1.5 font-semibold"
                    >
                      Preview voice
                    </button>
                  </section>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-full gradient-femmly flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "gradient-femmly text-primary-foreground rounded-br-sm"
                  : "bg-muted border border-border text-foreground rounded-bl-sm"
              }`}
            >
              {m.content || (loading && i === messages.length - 1 ? "…" : "")}
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <UserIcon size={14} className="text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 size={12} className="animate-spin" /> Thinking…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-16 bg-background/95 backdrop-blur-xl border-t border-border p-3 flex items-end gap-2">
        <div className="flex-1 rounded-2xl border border-border bg-muted/30 flex items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            rows={1}
            placeholder={listening ? "Listening…" : "Talk or type to your AI…"}
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none resize-none max-h-32"
          />
          <AnimatePresence>
            {listening ? (
              <motion.button
                key="stop"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                onClick={stopListening}
                className="m-1 p-2 rounded-full bg-destructive text-destructive-foreground"
                aria-label="Stop listening"
              >
                <MicOff size={16} />
              </motion.button>
            ) : (
              <button
                key="mic"
                onClick={startListening}
                className="m-1 p-2 rounded-full bg-muted text-foreground hover:bg-muted/70"
                aria-label="Start voice input"
              >
                <Mic size={16} />
              </button>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="rounded-full gradient-femmly p-3 text-primary-foreground shadow-femmly disabled:opacity-50"
          aria-label="Send"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default AssistantPage;