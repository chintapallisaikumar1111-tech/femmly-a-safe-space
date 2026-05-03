import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/60">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Back" className="p-2 rounded-full hover:bg-card/60">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-xl font-semibold">Privacy Policy</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Effective May 2026</p>
        <p>Femmly is a women-only social platform. We take your privacy seriously and only collect information necessary to keep the community safe.</p>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Information we collect</h2>
          <p>Account details (name, email), AI face-verification data used solely for gender confirmation, and content you choose to post.</p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">How we use it</h2>
          <p>To verify identity, moderate content, deliver the app, and enforce safety rules. We never sell your data.</p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Your rights</h2>
          <p>You can request deletion of your account and data at any time from Settings → Account Security.</p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Contact</h2>
          <p>Questions? Reach out via Settings → Help &amp; Support.</p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;