import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Mic, MicOff, Volume2, VolumeX, Loader2, Bot, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsLayout from "./SettingsLayout";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How do I get more followers on Femmly?",
  "Write me a catchy bio about being a creative woman",
  "Suggest 5 reel ideas for this week",
  "Best hashtags for women entrepreneurs?",
];

const AIAssistant = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi gorgeous 💜 I'm your Femmly AI Coach. Ask me anything — growing followers, content ideas, captions, safety tips, or just girl talk. Type or tap the mic to talk to me!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // ---- Voice input (Web Speech API) ----
  const startListening = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast({ title: "Voice not supported", description: "Your browser doesn't support speech recognition. Try Chrome on desktop or mobile.", variant: "destructive" });
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
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

  // ---- Voice output (TTS) ----
  const speak = (text: string) => {
    if (!speakReplies) return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1.1;
    utter.lang = "en-US";
    // Prefer a female voice when available
    const voices = window.speechSynthesis.getVoices();
    const female = voices.find((v) => /female|samantha|victoria|zira|google us english/i.test(v.name));
    if (female) utter.voice = female;
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  // ---- Streaming chat ----
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
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 429) {
          toast({ title: "Slow down 💜", description: err.error || "Too many requests, please wait.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "AI credits exhausted", description: err.error || "Add credits in Workspace Settings.", variant: "destructive" });
        } else {
          toast({ title: "AI error", description: err.error || "Please try again.", variant: "destructive" });
        }
        setLoading(false);
        return;
      }
      if (!resp.body) throw new Error("No response stream");

      // Add empty assistant message and stream into it
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

  return (
    <SettingsLayout title="Femmly AI Assistant" description="Your personal coach — chat or voice 💜">
      <div className="max-w-md mx-auto flex flex-col h-[calc(100vh-180px)]">
        {/* Header chip */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 rounded-full gradient-femmly-soft border border-primary/30 px-3 py-1.5">
            <Sparkles size={12} className="text-primary" />
            <span className="text-[11px] font-semibold text-foreground">Powered by Lovable AI</span>
          </div>
          <button
            onClick={() => {
              setSpeakReplies((s) => {
                if (s) stopSpeaking();
                return !s;
              });
            }}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground rounded-full bg-muted px-3 py-1.5"
          >
            {speakReplies ? <Volume2 size={12} /> : <VolumeX size={12} />}
            Voice {speakReplies ? "On" : "Off"}
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-2xl bg-muted/30 border border-border p-3 space-y-3"
        >
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
                    : "bg-background border border-border text-foreground rounded-bl-sm"
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
              <Loader2 size={12} className="animate-spin" /> Femmly AI is thinking…
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-[11px] rounded-full border border-border bg-muted px-3 py-1.5 text-foreground hover:bg-muted/70"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="mt-3 flex items-end gap-2">
          <div className="flex-1 rounded-2xl border border-border bg-background flex items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder={listening ? "Listening…" : "Ask anything — growth, captions, safety…"}
              className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none resize-none max-h-32"
            />
            <AnimatePresence>
              {listening ? (
                <motion.button
                  key="stop"
                  initial={{ scale: 0.8 }}
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
      </div>
    </SettingsLayout>
  );
};

export default AIAssistant;