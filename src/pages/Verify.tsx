import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Shield, CheckCircle, XCircle, Loader2, RotateCcw, Eye, ArrowLeftRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import femmlyLogo from "@/assets/femmly-logo.png";

type Step = "intro" | "live" | "processing" | "result";
type LiveStage = "front" | "blink" | "side" | "done";

const STAGE_CONFIG: Record<Exclude<LiveStage, "done">, {
  title: string;
  instruction: string;
  hint: string;
  icon: typeof Camera;
  countdown: number;
}> = {
  front: {
    title: "Step 1 of 3 — Look straight",
    instruction: "Look directly at the camera with eyes OPEN",
    hint: "Center your face in the circle",
    icon: Camera,
    countdown: 3,
  },
  blink: {
    title: "Step 2 of 3 — Blink",
    instruction: "Now CLOSE your eyes (blink and hold for a moment)",
    hint: "We need a real blink to confirm you're live",
    icon: Eye,
    countdown: 3,
  },
  side: {
    title: "Step 3 of 3 — Turn head",
    instruction: "Slowly turn your head to the LEFT or RIGHT",
    hint: "Show us your profile briefly",
    icon: ArrowLeftRight,
    countdown: 3,
  },
};

const Verify = () => {
  const [step, setStep] = useState<Step>("intro");
  const [liveStage, setLiveStage] = useState<LiveStage>("front");
  const [countdown, setCountdown] = useState(0);
  const [aiGuidance, setAiGuidance] = useState("Get ready — AI is watching");
  const [result, setResult] = useState<{ verified: boolean; message: string } | null>(null);
  const [frames, setFrames] = useState<{ front?: string; blink?: string; side?: string }>({});
  const [previewFrame, setPreviewFrame] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const { isVerified, refreshProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isVerified) navigate("/feed", { replace: true });
  }, [isVerified, navigate]);

  // Attach stream when live step mounts
  useEffect(() => {
    if (step === "live" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [step]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    return dataUrl.split(",")[1] || null;
  }, []);

  const verify = useCallback(async (collected: { front: string; blink: string; side: string }) => {
    setStep("processing");
    setAiGuidance("AI is analyzing all 3 live frames…");
    try {
      const { data, error } = await supabase.functions.invoke("verify-gender", {
        body: { frames: collected },
      });
      if (error) {
        setResult({ verified: false, message: "Verification service error. Please try again." });
      } else {
        setResult({ verified: !!data.verified, message: data.message });
        if (data.verified) await refreshProfile();
      }
    } catch {
      setResult({ verified: false, message: "Network error. Please try again." });
    }
    setStep("result");
  }, [refreshProfile]);

  // Run sequential capture sequence inside the live step
  const runStage = useCallback(async (stage: Exclude<LiveStage, "done">, collected: typeof frames) => {
    const cfg = STAGE_CONFIG[stage];
    setLiveStage(stage);
    setAiGuidance(cfg.instruction);
    // Countdown
    for (let i = cfg.countdown; i > 0; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 800));
    }
    setCountdown(0);
    // Capture
    const frame = captureFrame();
    if (!frame) {
      toast({ title: "Capture failed", description: "Please try again.", variant: "destructive" });
      return null;
    }
    setPreviewFrame(`data:image/jpeg;base64,${frame}`);
    const next = { ...collected, [stage]: frame };
    setFrames(next);
    // brief pause showing capture
    await new Promise((r) => setTimeout(r, 600));
    return next;
  }, [captureFrame, toast]);

  const startLiveSequence = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({ title: "Live camera required", description: "Your browser doesn't support live camera access.", variant: "destructive" });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      setFrames({});
      setPreviewFrame(null);
      setStep("live");

      // Wait one tick so the video element mounts and effect attaches stream
      await new Promise((r) => setTimeout(r, 600));
      setAiGuidance("AI is initialising — hold still…");
      await new Promise((r) => setTimeout(r, 800));

      let collected: typeof frames = {};
      const after1 = await runStage("front", collected);
      if (!after1) { stopCamera(); setStep("intro"); return; }
      collected = after1;

      const after2 = await runStage("blink", collected);
      if (!after2) { stopCamera(); setStep("intro"); return; }
      collected = after2;

      const after3 = await runStage("side", collected);
      if (!after3) { stopCamera(); setStep("intro"); return; }
      collected = after3;

      setLiveStage("done");
      setAiGuidance("All 3 live captures complete!");
      stopCamera();
      await verify(collected as { front: string; blink: string; side: string });
    } catch (err: any) {
      console.error("getUserMedia failed:", err?.name, err?.message);
      let description = "Allow camera access in your browser to continue.";
      if (err?.name === "NotAllowedError") description = "Permission denied. Please allow camera access in browser settings.";
      else if (err?.name === "NotFoundError") description = "No camera detected on this device.";
      else if (err?.name === "NotReadableError") description = "Camera is in use by another app. Close it and try again.";
      else if (err?.name === "SecurityError") description = "Camera blocked. This site requires HTTPS and camera permission.";
      toast({ title: "Live camera required", description, variant: "destructive" });
    }
  };

  const retry = () => {
    stopCamera();
    setFrames({});
    setPreviewFrame(null);
    setResult(null);
    setLiveStage("front");
    setStep("intro");
  };

  const currentStageCfg = liveStage !== "done" ? STAGE_CONFIG[liveStage] : null;
  const StageIcon = currentStageCfg?.icon ?? Sparkles;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {step === "intro" && (
            <div className="text-center space-y-6">
              <img src={femmlyLogo} alt="Femmly" className="h-16 w-16 mx-auto" />
              <div>
                <h1 className="text-2xl font-bold font-display text-foreground">Live Identity Verification</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Femmly uses strict <span className="font-semibold text-foreground">live AI face verification</span> to keep this a women-only space.
                  No uploads, no photos of photos — only a real live capture is accepted.
                </p>
              </div>

              <div className="space-y-3 text-left">
                {[
                  { icon: Camera, text: "Step 1 — Look straight at camera with eyes open" },
                  { icon: Eye, text: "Step 2 — Blink (close your eyes briefly)" },
                  { icon: ArrowLeftRight, text: "Step 3 — Turn your head left or right" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <div className="w-8 h-8 rounded-full gradient-femmly flex items-center justify-center text-primary-foreground">
                      <Icon size={16} />
                    </div>
                    <span className="text-sm text-foreground">{text}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 rounded-xl gradient-femmly-soft p-4">
                <Shield size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed text-left">
                  Our AI verifies that you are a <span className="font-semibold text-foreground">real, live woman</span>. Accounts identified as male, fake, or non-female will be <span className="font-semibold text-destructive">rejected immediately</span>.
                </p>
              </div>

              <button
                onClick={startLiveSequence}
                className="w-full rounded-xl gradient-femmly py-3.5 text-sm font-semibold text-primary-foreground shadow-femmly transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Camera size={18} />
                Start Live Verification
              </button>
            </div>
          )}

          {step === "live" && (
            <div className="text-center space-y-4">
              {currentStageCfg && (
                <div>
                  <h2 className="text-base font-bold text-foreground">{currentStageCfg.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{currentStageCfg.hint}</p>
                </div>
              )}

              {/* Live camera */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary/40 bg-black aspect-[4/3]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                {/* Face guide overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-60 border-[3px] border-primary/70 rounded-[50%] shadow-[0_0_30px_hsl(var(--primary)/0.4)]" />
                </div>

                {/* Countdown */}
                <AnimatePresence>
                  {countdown > 0 && (
                    <motion.div
                      key={countdown}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-7xl font-black text-primary-foreground drop-shadow-[0_0_20px_hsl(var(--primary))]">
                        {countdown}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stage indicator chip */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur px-3 py-1.5 text-xs font-semibold text-foreground">
                    <StageIcon size={12} className="text-primary" />
                    {liveStage !== "done" ? liveStage.toUpperCase() : "DONE"}
                  </div>
                  <div className="flex gap-1">
                    {(["front","blink","side"] as const).map((s) => (
                      <div
                        key={s}
                        className={`w-2 h-2 rounded-full ${frames[s] ? "gradient-femmly" : "bg-foreground/20"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* AI guidance bar */}
              <motion.div
                key={aiGuidance}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl gradient-femmly-soft px-3 py-2.5"
              >
                <Sparkles size={14} className="text-primary flex-shrink-0" />
                <p className="text-xs font-medium text-foreground text-left">{aiGuidance}</p>
              </motion.div>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center space-y-6">
              {previewFrame && (
                <img
                  src={previewFrame}
                  alt="Last live frame"
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary/30"
                  style={{ transform: "scaleX(-1)" }}
                />
              )}
              <Loader2 size={40} className="text-primary animate-spin mx-auto" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">AI is verifying your identity…</h2>
                <p className="text-sm text-muted-foreground mt-1">Checking liveness, blink, head turn & gender</p>
              </div>
            </div>
          )}

          {step === "result" && result && (
            <div className="text-center space-y-6">
              {previewFrame && (
                <img
                  src={previewFrame}
                  alt="Your selfie"
                  className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-primary/20"
                  style={{ transform: "scaleX(-1)" }}
                />
              )}
              {result.verified ? (
                <CheckCircle size={56} className="text-primary mx-auto" />
              ) : (
                <XCircle size={56} className="text-destructive mx-auto" />
              )}
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {result.verified ? "Verified!" : "Verification Failed"}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">{result.message}</p>
              </div>
              {result.verified ? (
                <button
                  onClick={() => navigate("/feed")}
                  className="w-full rounded-xl gradient-femmly py-3.5 text-sm font-semibold text-primary-foreground shadow-femmly transition-transform active:scale-[0.98]"
                >
                  Enter Femmly
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={retry}
                    className="w-full rounded-xl gradient-femmly py-3.5 text-sm font-semibold text-primary-foreground shadow-femmly transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Try Live Verification Again
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Femmly is a strictly women-only platform. Repeated failed attempts will be flagged for review.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Verify;
