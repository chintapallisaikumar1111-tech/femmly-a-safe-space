import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Users, CheckCircle, XCircle, ArrowLeft, Loader2,
  UserCheck, UserX, Clock, Activity, AlertTriangle, Lock,
  TrendingUp, BarChart3, ShieldCheck, RefreshCw, LogOut,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type TabKey = "overview" | "reports" | "security" | "verifications" | "users";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "hsl(var(--destructive))",
  warning: "hsl(38 92% 50%)",
  low: "hsl(var(--primary))",
  info: "hsl(var(--muted-foreground))",
};

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<TabKey>("overview");
  const [verifications, setVerifications] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({
    total: 0, verified: 0, pending: 0, rejected: 0,
    threats24h: 0, criticalThreats: 0, last24Signups: 0,
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/feed", { replace: true });
    }
  }, [loading, isAdmin]);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  // Real-time: refresh on new security event
  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("admin-security-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "security_events" },
        () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoadingData(true);
    const [profRes, verRes, secRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("verification_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("security_events").select("*").order("created_at", { ascending: false }).limit(200),
    ]);

    const allProfiles = profRes.data || [];
    const allVer = verRes.data || [];
    const allSec = secRes.data || [];
    setProfiles(allProfiles);
    setVerifications(allVer);
    setSecurityEvents(allSec);

    const dayAgo = Date.now() - 24 * 3600 * 1000;
    setStats({
      total: allProfiles.length,
      verified: allProfiles.filter((p: any) => p.is_verified).length,
      pending: allVer.filter((r: any) => r.status === "pending").length,
      rejected: allVer.filter((r: any) => r.status === "rejected").length,
      threats24h: allSec.filter((s: any) => new Date(s.created_at).getTime() > dayAgo).length,
      criticalThreats: allSec.filter((s: any) => s.severity === "critical").length,
      last24Signups: allProfiles.filter((p: any) => new Date(p.created_at).getTime() > dayAgo).length,
    });
    setLoadingData(false);
  };

  const handleAdminLogout = async () => {
    await signOut();
    navigate("/admin-login", { replace: true });
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
    fetchAll();
  };

  // Power-BI style derived series
  const signupSeries = useMemo(() => {
    const days: { day: string; signups: number; verified: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const dayProfiles = profiles.filter((p: any) => p.created_at?.slice(0, 10) === key);
      days.push({
        day: label,
        signups: dayProfiles.length,
        verified: dayProfiles.filter((p: any) => p.is_verified).length,
      });
    }
    return days;
  }, [profiles]);

  const threatSeries = useMemo(() => {
    const buckets: Record<string, number> = {};
    for (let i = 23; i >= 0; i--) {
      const h = new Date(Date.now() - i * 3600000).getHours();
      buckets[`${h}:00`] = 0;
    }
    securityEvents.forEach((e: any) => {
      const t = new Date(e.created_at);
      if (Date.now() - t.getTime() < 24 * 3600000) {
        const k = `${t.getHours()}:00`;
        if (k in buckets) buckets[k] += 1;
      }
    });
    return Object.entries(buckets).map(([hour, count]) => ({ hour, count }));
  }, [securityEvents]);

  const verificationPie = useMemo(() => ([
    { name: "Verified", value: stats.verified, color: "hsl(var(--primary))" },
    { name: "Pending", value: stats.pending, color: "hsl(38 92% 50%)" },
    { name: "Rejected", value: stats.rejected, color: "hsl(var(--destructive))" },
    { name: "Unverified", value: Math.max(0, stats.total - stats.verified - stats.pending - stats.rejected), color: "hsl(var(--muted))" },
  ]), [stats]);

  const severityBreakdown = useMemo(() => {
    const map: Record<string, number> = { critical: 0, warning: 0, low: 0, info: 0 };
    securityEvents.forEach((e: any) => { map[e.severity] = (map[e.severity] || 0) + 1; });
    return Object.entries(map).map(([severity, count]) => ({ severity, count }));
  }, [securityEvents]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="sticky top-0 z-20 backdrop-blur bg-background/85 border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto">
          <button onClick={() => navigate("/feed")} aria-label="Back" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={22} />
          </button>
          <Shield size={20} className="text-primary" />
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground leading-none">Femmly Command Center</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Live ops · Reports · Cyber-shield</p>
          </div>
          <button onClick={fetchAll} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Refresh">
            <RefreshCw size={18} className={loadingData ? "animate-spin" : ""} />
          </button>
          <button onClick={handleAdminLogout} className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 text-xs font-medium">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border max-w-7xl mx-auto overflow-x-auto">
        {[
          { key: "overview", label: "Overview", icon: Activity },
          { key: "reports", label: "Reports", icon: BarChart3 },
          { key: "security", label: "Cyber-Shield", icon: ShieldCheck },
          { key: "verifications", label: "Verifications", icon: Clock },
          { key: "users", label: "Users", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`flex-1 min-w-[110px] py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
              tab === key ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {loadingData ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : (
          <>
            {/* OVERVIEW */}
            {tab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total Users", value: stats.total, icon: Users, color: "text-foreground" },
                    { label: "Verified", value: stats.verified, icon: CheckCircle, color: "text-primary" },
                    { label: "New (24h)", value: stats.last24Signups, icon: TrendingUp, color: "text-primary" },
                    { label: "Threats (24h)", value: stats.threats24h, icon: AlertTriangle, color: stats.threats24h > 0 ? "text-destructive" : "text-muted-foreground" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-border bg-card p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon size={16} className={color} />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
                      </div>
                      <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Signups · last 14 days</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={signupSeries}>
                        <defs>
                          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} allowDecimals={false} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}/>
                        <Area type="monotone" dataKey="signups" stroke="hsl(var(--primary))" fill="url(#g1)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Verification mix</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={verificationPie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                          {verificationPie.map((entry, idx) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend wrapperStyle={{ fontSize: 11 }}/>
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Live security feed</h3>
                    <span className="flex items-center gap-1 text-[10px] text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/> realtime
                    </span>
                  </div>
                  {securityEvents.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-6 text-center">No security events yet — system clear.</p>
                  ) : (
                    <ul className="divide-y divide-border max-h-72 overflow-y-auto">
                      {securityEvents.slice(0, 10).map((e: any) => (
                        <li key={e.id} className="flex items-center gap-3 py-2 text-xs">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: SEVERITY_COLORS[e.severity] || SEVERITY_COLORS.info }}
                          />
                          <span className="font-medium text-foreground flex-1 truncate">{e.event_type}</span>
                          <span className="text-muted-foreground">{e.threat_score}/100</span>
                          <span className="text-muted-foreground tabular-nums">
                            {new Date(e.created_at).toLocaleTimeString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* REPORTS – Power BI tab */}
            {tab === "reports" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Signups vs Verified</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={signupSeries}>
                      <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10}/>
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} allowDecimals={false}/>
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}/>
                      <Legend wrapperStyle={{ fontSize: 11 }}/>
                      <Bar dataKey="signups" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                      <Bar dataKey="verified" fill="hsl(173 80% 40%)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Threat severity mix</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={severityBreakdown} layout="vertical">
                        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} allowDecimals={false}/>
                        <YAxis type="category" dataKey="severity" stroke="hsl(var(--muted-foreground))" fontSize={11}/>
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}/>
                        <Bar dataKey="count" radius={[0,4,4,0]}>
                          {severityBreakdown.map((entry, idx) => (
                            <Cell key={idx} fill={SEVERITY_COLORS[entry.severity]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Threats · last 24h</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={threatSeries}>
                        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10}/>
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} allowDecimals={false}/>
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}/>
                        <Line type="monotone" dataKey="count" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Funnel KPIs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <KPI label="Verification rate" value={`${stats.total ? Math.round((stats.verified/stats.total)*100) : 0}%`}/>
                    <KPI label="Pending review" value={stats.pending}/>
                    <KPI label="Rejection rate" value={`${stats.total ? Math.round((stats.rejected/Math.max(1,stats.total))*100) : 0}%`}/>
                    <KPI label="Critical threats" value={stats.criticalThreats} danger={stats.criticalThreats>0}/>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {tab === "security" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/20 p-2"><Lock size={20} className="text-primary"/></div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">AI Cyber-Shield Active</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Realtime anomaly scoring · Rate-limit detection · Bot UA fingerprinting · Leaked-password protection enabled.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Security event log</h3>
                    <span className="text-[10px] text-muted-foreground">{securityEvents.length} recent</span>
                  </div>
                  {securityEvents.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-10 text-center">No threats detected. System nominal.</p>
                  ) : (
                    <div className="max-h-[480px] overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-muted/40 text-muted-foreground">
                          <tr>
                            <th className="text-left px-3 py-2 font-medium">Severity</th>
                            <th className="text-left px-3 py-2 font-medium">Event</th>
                            <th className="text-left px-3 py-2 font-medium">Score</th>
                            <th className="text-left px-3 py-2 font-medium">IP</th>
                            <th className="text-left px-3 py-2 font-medium">When</th>
                          </tr>
                        </thead>
                        <tbody>
                          {securityEvents.map((e: any) => (
                            <tr key={e.id} className="border-t border-border">
                              <td className="px-3 py-2">
                                <span
                                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
                                  style={{
                                    background: `${SEVERITY_COLORS[e.severity]}22`,
                                    color: SEVERITY_COLORS[e.severity],
                                  }}
                                >
                                  {e.severity}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-foreground">{e.event_type}</td>
                              <td className="px-3 py-2 tabular-nums">{e.threat_score}/100</td>
                              <td className="px-3 py-2 text-muted-foreground">{e.ip_address || "—"}</td>
                              <td className="px-3 py-2 text-muted-foreground tabular-nums">
                                {new Date(e.created_at).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "verifications" && (
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
          </>
        )}
      </div>
    </div>
  );
};

const KPI = ({ label, value, danger }: { label: string; value: string | number; danger?: boolean }) => (
  <div className="rounded-lg bg-muted/40 p-3">
    <p className={`text-xl font-bold ${danger ? "text-destructive" : "text-foreground"}`}>{value}</p>
    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">{label}</p>
  </div>
);

export default Admin;
