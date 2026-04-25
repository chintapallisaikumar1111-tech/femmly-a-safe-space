import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Shield, CheckCircle, XCircle, Loader2, RotateCcw, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import femmlyLogo from "@/assets/femmly-logo.png";

const Verify = () => {
  const [step, setStep] = useState<"intro" | "camera" | "processing" | "result">("intro");
  const [result, setResult] = useState<{ verified: boolean; message: string } | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, isVerified, refreshProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isVerified) navigate("/feed", { replace: true });
  }, [isVerified, navigate]);

  // Attach the live stream once <video> mounts (step === "camera")
  useEffect(() => {
    if (step === "camera" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [step]);

  // Stop camera tracks on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({
        title: "Camera not supported",
        description: "Use the Upload Photo option instead.",
        variant: "destructive",
      });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      setStep("camera");
    } catch (err: any) {
      console.error("getUserMedia failed:", err?.name, err?.message);
      let description = "Allow camera access in your browser, or use Upload Photo.";
      if (err?.name === "NotAllowedError") description = "Permission denied. Allow camera in site settings or use Upload Photo.";
      else if (err?.name === "NotFoundError") description = "No camera detected. Use Upload Photo instead.";
      else if (err?.name === "NotReadableError") description = "Camera in use by another app. Close it and try again.";
      else if (err?.name === "SecurityError") description = "Camera blocked. Try Upload Photo.";
      toast({ title: "Couldn't open camera", description, variant: "destructive" });
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);
      verifyGender(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(dataUrl);
    stopCamera();
    verifyGender(dataUrl);
  }, []);

  const verifyGender = async (dataUrl: string) => {
    setStep("processing");
    try {
      const base64 = dataUrl.split(",")[1];
      const { data, error } = await supabase.functions.invoke("verify-gender", {
        body: { imageBase64: base64 },
      });

      if (error) {
        setResult({ verified: false, message: "Verification service error. Please try again." });
      } else {
        setResult({ verified: data.verified, message: data.message });
        if (data.verified) {
          await refreshProfile();
        }
      }
    } catch {
      setResult({ verified: false, message: "Network error. Please try again." });
    }
    setStep("result");
  };

  const retry = () => {
    setCapturedImage(null);
    setResult(null);
    setStep("intro");
  };

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
                <h1 className="text-2xl font-bold font-display text-foreground">Identity Verification</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  To keep Femmly safe, we verify all members with a quick selfie using AI.
                </p>
              </div>

              <div className="space-y-3 text-left">
                {[
                  "Look directly at the camera",
                  "Make sure your face is well-lit",
                  "Remove sunglasses or face coverings",
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <div className="w-6 h-6 rounded-full gradient-femmly flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                    <span className="text-sm text-foreground">{tip}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 rounded-xl gradient-femmly-soft p-4">
                <Shield size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your selfie is processed securely by AI and stored privately. It will only be used for verification.
                </p>
              </div>

              <button
                onClick={startCamera}
                className="w-full rounded-xl gradient-femmly py-3.5 text-sm font-semibold text-primary-foreground shadow-femmly transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Camera size={18} />
                Open Camera
              </button>
            </div>
          )}

          {step === "camera" && (
            <div className="text-center space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Take your selfie</h2>
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-[4/3] object-cover mirror"
                  style={{ transform: "scaleX(-1)" }}
                />
                <div className="absolute inset-0 border-[3px] border-primary/20 rounded-2xl pointer-events-none" />
              </div>
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full gradient-femmly shadow-femmly-lg mx-auto flex items-center justify-center transition-transform active:scale-90"
              >
                <Camera size={28} className="text-primary-foreground" />
              </button>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center space-y-6">
              {capturedImage && (
                <img src={capturedImage} alt="Your selfie" className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-primary/20" style={{ transform: "scaleX(-1)" }} />
              )}
              <Loader2 size={40} className="text-primary animate-spin mx-auto" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Verifying your identity...</h2>
                <p className="text-sm text-muted-foreground mt-1">Our AI is analyzing your selfie</p>
              </div>
            </div>
          )}

          {step === "result" && result && (
            <div className="text-center space-y-6">
              {capturedImage && (
                <img src={capturedImage} alt="Your selfie" className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary/20" style={{ transform: "scaleX(-1)" }} />
              )}
              
              {result.verified ? (
                <CheckCircle size={56} className="text-primary mx-auto" />
              ) : (
                <XCircle size={56} className="text-destructive mx-auto" />
              )}

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {result.verified ? "Verified!" : "Verification Needed"}
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
                    Try Again
                  </button>
                  <p className="text-xs text-muted-foreground">
                    If you believe this is an error, your request is under manual review.
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
