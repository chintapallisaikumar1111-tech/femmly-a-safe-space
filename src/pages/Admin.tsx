import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, CheckCircle, XCircle, Eye, ArrowLeft, Loader2, UserCheck, UserX, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<"pending" | "users" | "stats">("pending");
  const [verifications, setVerifications] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/feed", { replace: true });
    }
  }, [loading, isAdmin]);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, tab]);

  const fetchData = async () => {
    setLoadingData(true);
    if (tab === "pending") {
      const { data } = await supabase
        .from("verification_requests")
        .select("*")
        .order("created_at", { ascending: false });
      setVerifications(data || []);
    } else if (tab === "users") {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setProfiles(data || []);
    } else {
      const { data: allProfiles } = await supabase.from("profiles").select("is_verified");
      const { data: pendingReqs } = await supabase.from("verification_requests").select("status");
      const total = allProfiles?.length || 0;
      const verified = allProfiles?.filter((p: any) => p.is_verified).length || 0;
      const pending = pendingReqs?.filter((r: any) => r.status === "pending").length || 0;
      const rejected = pendingReqs?.filter((r: any) => r.status === "rejected").length || 0;
      setStats({ total, verified, pending, rejected });
    }
    setLoadingData(false);
  };

  const handleVerification = async (reqId: string, userId: string, approve: boolean) => {
    const status = approve ? "approved" : "rejected";
    await supabase.from("verification_requests").update({
      status,
      reviewed_by: user?.id,
      updated_at: new Date().toISOString(),
    }).eq("id", reqId);

    if (approve) {
      await supabase.from("profiles").update({ is_verified: true }).eq("id", userId);
    }

    toast({ title: approve ? "User approved" : "User rejected" });
    fetchData();
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => navigate("/feed")} aria-label="Back">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <Shield size={20} className="text-primary" />
        <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {[
          { key: "pending", label: "Verifications", icon: Clock },
          { key: "users", label: "Users", icon: Users },
          { key: "stats", label: "Stats", icon: Eye },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
              tab === key ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {loadingData ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : (
          <>
            {tab === "pending" && (
              <div className="space-y-3">
                {verifications.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">No verification requests</p>
                ) : (
                  verifications.map((v) => (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-border bg-card p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(v.created_at).toLocaleDateString()}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          v.status === "approved" ? "bg-primary/10 text-primary" :
                          v.status === "rejected" ? "bg-destructive/10 text-destructive" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>AI Confidence: {((v.ai_confidence || 0) * 100).toFixed(0)}%</p>
                        <p>AI Result: {v.ai_result?.gender || "N/A"} — {v.ai_result?.reason || ""}</p>
                      </div>

                      {v.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerification(v.id, v.user_id, true)}
                            className="flex-1 rounded-lg gradient-femmly py-2 text-xs font-semibold text-primary-foreground flex items-center justify-center gap-1"
                          >
                            <UserCheck size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleVerification(v.id, v.user_id, false)}
                            className="flex-1 rounded-lg bg-destructive py-2 text-xs font-semibold text-destructive-foreground flex items-center justify-center gap-1"
                          >
                            <UserX size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {tab === "users" && (
              <div className="space-y-2">
                {profiles.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.full_name || "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">{p.id.slice(0, 8)}...</p>
                    </div>
                    {p.is_verified ? (
                      <CheckCircle size={18} className="text-primary" />
                    ) : (
                      <XCircle size={18} className="text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === "stats" && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Users", value: stats.total, color: "text-foreground" },
                  { label: "Verified", value: stats.verified, color: "text-primary" },
                  { label: "Pending Review", value: stats.pending, color: "text-muted-foreground" },
                  { label: "Rejected", value: stats.rejected, color: "text-destructive" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
