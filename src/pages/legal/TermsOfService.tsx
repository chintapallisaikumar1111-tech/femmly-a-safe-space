import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/60">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Back" className="p-2 rounded-full hover:bg-card/60">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-xl font-semibold">Terms of Service</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Effective May 2026</p>
        <p>By creating a Femmly account you agree to these Terms. Femmly is intended exclusively for women aged 16 and over.</p>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Eligibility</h2>
          <p>You must complete AI gender verification to use Femmly. Fraudulent verification results in a permanent ban.</p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Community rules</h2>
          <p>No harassment, hate speech, nudity, doxxing, or sharing of others' images without consent. We follow a 3-strike enforcement policy.</p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Content ownership</h2>
          <p>You own everything you post. You grant Femmly a limited license to display it within the app.</p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Termination</h2>
          <p>We may suspend accounts that violate these Terms or endanger community safety.</p>
        </section>
      </main>
    </div>
  );
};

export default TermsOfService;