import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#07090F",
  card: "#0D1120",
  cardBorder: "#161B2E",
  accent: "#C8F464",
  accentDim: "#8DB844",
  text: "#E8EDF8",
  muted: "#4A5270",
  red: "#FF4D6A",
  blue: "#4D9FFF",
  purple: "#9B6DFF",
};

// ─── CSV URL ──────────────────────────────────────────────────────────────────
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRBsIS_cdPAVWenPPbR1I6Oqsb80pTM_-yJzx1mSgnZp9PpKBUu95ntukvUc4Lsxg/pub?output=csv";

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const WEEKS_DEMO = [
  { label: "S-5", ventes: 4200, pub: 320, reseaux: 1100, emails: 88, lancements: 0 },
  { label: "S-4", ventes: 5100, pub: 410, reseaux: 1340, emails: 102, lancements: 1 },
  { label: "S-3", ventes: 4750, pub: 380, reseaux: 1280, emails: 95,  lancements: 0 },
  { label: "S-2", ventes: 6200, pub: 520, reseaux: 1580, emails: 120, lancements: 2 },
  { label: "S-1", ventes: 5800, pub: 490, reseaux: 1490, emails: 111, lancements: 1 },
  { label: "Cette sem.", ventes: 6900, pub: 560, reseaux: 1720, emails: 134, lancements: 1 },
];

const MONTHS_DEMO = [
  { label: "Oct", ventes: 18200, pub: 1320, reseaux: 4800, emails: 380, lancements: 2 },
  { label: "Nov", ventes: 21500, pub: 1580, reseaux: 5400, emails: 420, lancements: 3 },
  { label: "Déc", ventes: 28900, pub: 2100, reseaux: 6200, emails: 510, lancements: 4 },
  { label: "Jan", ventes: 19400, pub: 1420, reseaux: 5100, emails: 390, lancements: 2 },
  { label: "Fév", ventes: 22800, pub: 1690, reseaux: 5700, emails: 445, lancements: 3 },
  { label: "Mars", ventes: 26100, pub: 1920, reseaux: 6500, emails: 498, lancements: 4 },
];

// ─── KPI DEFINITIONS ─────────────────────────────────────────────────────────
const KPI_DEFS = {
  ventes: [
    { key: "ca",        label: "CA Total",        icon: "💰", format: "€", color: C.accent },
    { key: "commandes", label: "Commandes",        icon: "🛒", format: "#", color: C.blue },
    { key: "panier",    label: "Panier Moyen",     icon: "🧺", format: "€", color: C.purple },
    { key: "taux_conv", label: "Taux Conv.",        icon: "🎯", format: "%", color: C.accentDim },
    { key: "retours",   label: "Retours",          icon: "↩️", format: "#", color: C.red },
    { key: "nouveaux",  label: "Nouveaux clients", icon: "👤", format: "#", color: C.blue },
  ],
  pub: [
    { key: "depenses",    label: "Dépenses Pub", icon: "💸", format: "€", color: C.red },
    { key: "impressions", label: "Impressions",  icon: "👁️", format: "K", color: C.blue },
    { key: "clics",       label: "Clics",        icon: "🖱️", format: "#", color: C.accent },
    { key: "cpc",         label: "CPC",          icon: "📊", format: "€", color: C.purple },
    { key: "roas",        label: "ROAS",         icon: "📈", format: "x", color: C.accent },
    { key: "ctr",         label: "CTR",          icon: "🎯", format: "%", color: C.accentDim },
  ],
  reseaux: [
    { key: "abonnes",          label: "Abonnés",         icon: "👥", format: "#", color: C.accent },
    { key: "reach",            label: "Reach",            icon: "📡", format: "K", color: C.blue },
    { key: "engagement",       label: "Engagement",       icon: "❤️", format: "%", color: C.red },
    { key: "partages",         label: "Partages",         icon: "🔁", format: "#", color: C.purple },
    { key: "saves",            label: "Enregistrements",  icon: "🔖", format: "#", color: C.accentDim },
    { key: "nouveaux_abonnes", label: "Nvx abonnés",      icon: "✨", format: "#", color: C.accent },
  ],
  emails: [
    { key: "envoyes",       label: "Emails envoyés", icon: "📧", format: "#", color: C.blue },
    { key: "ouvertures",    label: "Taux ouverture", icon: "📬", format: "%", color: C.accent },
    { key: "clics_email",   label: "Taux de clics",  icon: "🖱️", format: "%", color: C.purple },
    { key: "desabo",        label: "Désinscriptions",icon: "🚪", format: "#", color: C.red },
    { key: "revenus_email", label: "Revenus Email",  icon: "💰", format: "€", color: C.accent },
    { key: "delivrabilite", label: "Délivrabilité",  icon: "✅", format: "%", color: C.accentDim },
  ],
  lancements: [
    { key: "nb_lancements",        label: "Lancements",      icon: "🚀", format: "#", color: C.accent },
    { key: "ca_lancement",         label: "CA Lancement",    icon: "💰", format: "€", color: C.accentDim },
    { key: "inscrits",             label: "Inscrits",        icon: "📝", format: "#", color: C.blue },
    { key: "conversion_lancement", label: "Conv. Lancement", icon: "🎯", format: "%", color: C.purple },
    { key: "panier_lancement",     label: "Panier Moyen",    icon: "🧺", format: "€", color: C.accent },
    { key: "leads",                label: "Leads générés",   icon: "🌱", format: "#", color: C.accentDim },
  ],
};

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "ventes",    label: "Ventes",    icon: "🛒" },
  { id: "pub",       label: "Pub",       icon: "📢" },
  { id: "reseaux",   label: "Réseaux",   icon: "🌐" },
  { id: "emails",    label: "Emails",    icon: "📧" },
  { id: "lancements",label: "Lancements",icon: "🚀" },
  { id: "ia",        label: "IA",        icon: "🤖" },
];

// ─── KPI COMPUTATION ─────────────────────────────────────────────────────────
function computeKpis(tab, d, p) {
  const v = d.ventes || 0, pu = d.pub || 0, r = d.reseaux || 0;
  const e = d.emails || 0, l = d.lancements || 0;
  const pv = p?.ventes || v * 0.9, pp = p?.pub || pu * 0.9;
  const pr = p?.reseaux || r * 0.9, pe = p?.emails || e * 0.9;
  const pl = p?.lancements || l * 0.9 || 0.1;
  const tr = (c, prev) => prev ? Math.round(((c - prev) / prev) * 100) : 0;
  const maps = {
    ventes: [
      { val: v,                                        trend: tr(v, pv) },
      { val: Math.round(v / 85),                       trend: tr(v, pv) },
      { val: Math.round(v / (v / 85) / 10) * 10,      trend: tr(v, pv) - 2 },
      { val: +(3.2 + (v - 4000) / 20000).toFixed(1),  trend: 3 },
      { val: Math.round(v / 85 * 0.05),                trend: -2 },
      { val: Math.round(v / 85 * 0.4),                 trend: 8 },
    ],
    pub: [
      { val: pu,                                          trend: tr(pu, pp) },
      { val: Math.round(pu * 3.2),                        trend: 5 },
      { val: Math.round(pu * 0.08 * 100),                 trend: 3 },
      { val: +(pu / (pu * 0.08 * 100) * 100).toFixed(2), trend: -1 },
      { val: +(v / pu).toFixed(1),                        trend: 4 },
      { val: +(pu * 0.08 / pu * 100).toFixed(1),          trend: 2 },
    ],
    reseaux: [
      { val: 12400 + r,                     trend: tr(r, pr) },
      { val: r,                              trend: tr(r, pr) },
      { val: +(3.8 + r / 10000).toFixed(1), trend: 1 },
      { val: Math.round(r * 0.04),           trend: 6 },
      { val: Math.round(r * 0.07),           trend: 9 },
      { val: Math.round(r * 0.08),           trend: 12 },
    ],
    emails: [
      { val: e * 100,                           trend: tr(e, pe) },
      { val: +(28 + e / 20).toFixed(1),         trend: 2 },
      { val: +(4.2 + e / 200).toFixed(1),       trend: 3 },
      { val: Math.round(e * 0.3),               trend: -5 },
      { val: Math.round(e * 8.5),               trend: 7 },
      { val: +(97.2 + e / 1000).toFixed(1),     trend: 0 },
    ],
    lancements: [
      { val: l,                                                       trend: tr(l, pl) },
      { val: Math.round(v * l * 0.15),                                trend: 15 },
      { val: Math.round(l * 420),                                     trend: 8 },
      { val: +(12 + l * 2.5).toFixed(1),                              trend: 4 },
      { val: Math.round(v * l * 0.15 / (l * 420 || 1) * 100) * 10,   trend: 2 },
      { val: Math.round(l * 320),                                     trend: 11 },
    ],
  };
  return maps[tab] || [];
}

// ─── FORMAT ───────────────────────────────────────────────────────────────────
function fmtVal(val, format) {
  if (format === "€") return `${val >= 1000 ? (val / 1000).toFixed(1) + "k" : val}€`;
  if (format === "K") return `${(val / 1000).toFixed(1)}k`;
  if (format === "%") return `${val}%`;
  if (format === "x") return `${val}x`;
  if (format === "#") return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : String(val);
  return String(val);
}

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.cardBorder}`,
      borderRadius: 8, padding: "8px 12px", fontSize: 12,
    }}>
      <p style={{ color: C.muted, marginBottom: 4 }}>{label}</p>
      <p style={{ color: C.accent, margin: 0 }}>
        {payload[0].value >= 1000
          ? `${(payload[0].value / 1000).toFixed(1)}k`
          : payload[0].value}
      </p>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode]           = useState("semaine");
  const [periodIdx, setPeriodIdx] = useState(5);
  const [activeTab, setActiveTab] = useState("ventes");
  const [weekData, setWeekData]   = useState(WEEKS_DEMO);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [iaResult, setIaResult]   = useState("");
  const [iaLoading, setIaLoading] = useState(false);

  const data    = mode === "semaine" ? weekData : MONTHS_DEMO;
  const maxIdx  = data.length - 1;
  const cur     = data[Math.min(periodIdx, maxIdx)] || data[maxIdx];
  const prev    = data[Math.max(0, Math.min(periodIdx, maxIdx) - 1)];
  const score   = Math.min(100, Math.max(0, 72 + (periodIdx - 3) * 4 + (mode === "mois" ? 5 : 0)));
  const scoreColor = score > 75 ? C.accent : score > 50 ? "#FFB347" : C.red;

  // Fetch Google Sheet CSV on mount
  useEffect(() => {
    fetch(CSV_URL)
      .then((res) => { if (!res.ok) throw new Error("fetch failed"); return res.text(); })
      .then((csv) => {
        const rows    = csv.trim().split("\n").map((r) => r.split(","));
        if (rows.length < 2) throw new Error("empty");
        const headers = rows[0].map((h) => h.trim().toLowerCase());
        const parsed  = rows.slice(1).slice(0, 6).map((row, i) => {
          const o = {};
          headers.forEach((h, j) => {
            o[h] = isNaN(row[j]) ? (row[j] || "").trim() : parseFloat(row[j]) || 0;
          });
          return {
            label:     o.label || o.semaine || o.période || `P${i + 1}`,
            ventes:    o.ventes    || o.ca              || WEEKS_DEMO[i]?.ventes    || 0,
            pub:       o.pub       || o.publicite       || WEEKS_DEMO[i]?.pub       || 0,
            reseaux:   o.reseaux   || o.reach           || WEEKS_DEMO[i]?.reseaux   || 0,
            emails:    o.emails    || o.email           || WEEKS_DEMO[i]?.emails    || 0,
            lancements:o.lancements|| o.lancement       || WEEKS_DEMO[i]?.lancements|| 0,
          };
        });
        setWeekData(parsed);
        setPeriodIdx(parsed.length - 1);
        setDataLoaded(true);
      })
      .catch(() => {
        // Keep demo data silently
      });
  }, []);

  const handleModeChange = (m) => {
    setMode(m);
    setPeriodIdx(m === "semaine" ? weekData.length - 1 : MONTHS_DEMO.length - 1);
  };

  const navigate = (dir) => {
    setPeriodIdx((i) => Math.max(0, Math.min(maxIdx, i + dir)));
  };

  const handleAnalyze = useCallback(async () => {
    setIaLoading(true);
    setIaResult("");
    const snapshot = {
      période: cur.label, mode,
      ventes: cur.ventes, pub: cur.pub,
      reseaux: cur.reseaux, emails: cur.emails,
      lancements: cur.lancements, scoreSanté: score,
    };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Tu es un analyste business spécialisé en e-commerce et marketing digital pour assistantes virtuelles. Analyse les KPIs et formule des recommandations concrètes en français, de manière concise et actionnable. Format : 3 sections (📊 Analyse, ✅ Points forts, ⚡ Actions prioritaires). Texte simple, sans markdown lourd.",
          messages: [{ role: "user", content: `Analyse ces KPIs e-commerce :\n\n${JSON.stringify(snapshot, null, 2)}` }],
        }),
      });
      const d = await res.json();
      setIaResult(d.content?.[0]?.text || "Aucune réponse reçue.");
    } catch {
      setIaResult("Erreur lors de l'appel à l'API. Vérifiez votre connexion et la clé API Anthropic.");
    } finally {
      setIaLoading(false);
    }
  }, [cur, mode, score]);

  const kpiDefs    = activeTab !== "ia" ? KPI_DEFS[activeTab] || [] : [];
  const currentKpis = activeTab !== "ia" ? computeKpis(activeTab, cur, prev) : [];
  const graphData  = data.map((d) => ({ label: d.label, val: d[activeTab === "ia" ? "ventes" : activeTab] || 0 }));

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: C.bg, minHeight: "100vh", color: C.text,
      maxWidth: 430, margin: "0 auto", position: "relative",
    }}>

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: C.bg, borderBottom: `1px solid ${C.cardBorder}`,
        padding: "14px 16px 10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: `2.5px solid ${scoreColor}`,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: C.card, flexShrink: 0,
          }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: C.accent, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 7, color: C.muted, lineHeight: 1 }}>SANTÉ</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 1 }}>Client</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: "-0.3px" }}>
              Ma Boutique ✨
            </div>
          </div>
          <div style={{
            display: "flex", gap: 2,
            background: C.card, borderRadius: 20, padding: 3,
            border: `1px solid ${C.cardBorder}`,
          }}>
            {["semaine", "mois"].map((m) => (
              <button key={m} onClick={() => handleModeChange(m)} style={{
                padding: "5px 12px", borderRadius: 16, border: "none",
                cursor: "pointer", fontSize: 11, fontWeight: 700,
                fontFamily: "inherit",
                background: mode === m ? C.accent : "transparent",
                color: mode === m ? C.bg : C.muted,
                transition: "all .2s",
              }}>
                {m === "semaine" ? "Sem." : "Mois"}
              </button>
            ))}
          </div>
        </div>

        {/* Period nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => navigate(-1)} disabled={periodIdx === 0} style={{
            width: 34, height: 34, borderRadius: 8,
            border: `1px solid ${C.cardBorder}`,
            background: periodIdx > 0 ? C.card : "transparent",
            color: periodIdx > 0 ? C.text : C.muted,
            fontSize: 18, cursor: periodIdx > 0 ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{cur.label}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{Math.min(periodIdx, maxIdx) + 1} / {data.length}</div>
          </div>
          <button onClick={() => navigate(1)} disabled={periodIdx >= maxIdx} style={{
            width: 34, height: 34, borderRadius: 8,
            border: `1px solid ${C.cardBorder}`,
            background: periodIdx < maxIdx ? C.card : "transparent",
            color: periodIdx < maxIdx ? C.text : C.muted,
            fontSize: 18, cursor: periodIdx < maxIdx ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>›</button>
        </div>
      </header>

      {/* ── TABS ── */}
      <div style={{
        display: "flex", overflowX: "auto", gap: 5,
        padding: "10px 12px", scrollbarWidth: "none",
        borderBottom: `1px solid ${C.cardBorder}`,
      }}>
        {TABS.map((t) => {
          const active = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, padding: "8px 12px", borderRadius: 10,
              border: `1px solid ${active ? C.accent : C.cardBorder}`,
              background: active ? `${C.accent}18` : C.card,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              fontFamily: "inherit", transition: "all .2s",
            }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: active ? C.accent : C.muted }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "14px 12px 70px" }}>

        {activeTab !== "ia" ? (
          <>
            {/* KPI Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {kpiDefs.map((def, i) => {
                const kpi = currentKpis[i] || { val: 0, trend: 0 };
                const up  = kpi.trend > 0, neu = kpi.trend === 0;
                return (
                  <div key={def.key} style={{
                    background: C.card, border: `1px solid ${C.cardBorder}`,
                    borderRadius: 12, padding: "12px 14px",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 8, right: 8,
                      width: 6, height: 6, borderRadius: "50%",
                      background: def.color, opacity: 0.7,
                    }} />
                    <div style={{ fontSize: 18, marginBottom: 5 }}>{def.icon}</div>
                    <div style={{ fontSize: 9, color: C.muted, marginBottom: 3, lineHeight: 1.2 }}>
                      {def.label}
                    </div>
                    <div style={{ fontSize: 19, fontWeight: 800, color: C.text, letterSpacing: "-0.5px" }}>
                      {fmtVal(kpi.val, def.format)}
                    </div>
                    <div style={{
                      marginTop: 5, fontSize: 11, fontWeight: 700,
                      color: neu ? C.muted : up ? C.accent : C.red,
                    }}>
                      {neu ? "=" : up ? "▲" : "▼"} {Math.abs(kpi.trend)}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Area Chart */}
            <div style={{
              background: C.card, border: `1px solid ${C.cardBorder}`,
              borderRadius: 14, padding: "14px 8px 8px",
            }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, paddingLeft: 8, fontWeight: 700 }}>
                Évolution — {TABS.find((t) => t.id === activeTab)?.label}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={graphData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.accent} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.cardBorder} vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: C.muted }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: C.muted }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone" dataKey="val"
                    stroke={C.accent} strokeWidth={2}
                    fill="url(#grad)"
                    dot={{ fill: C.accent, r: 3, strokeWidth: 0 }}
                    activeDot={{ fill: C.accent, r: 5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          /* ── IA TAB ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              background: C.card, border: `1px solid ${C.cardBorder}`,
              borderRadius: 14, padding: 16,
            }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 700 }}>
                Période analysée
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{cur.label}</div>
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  { label: "CA",         val: fmtVal(cur.ventes, "€") },
                  { label: "Pub",        val: fmtVal(cur.pub, "€") },
                  { label: "Reach",      val: fmtVal(cur.reseaux, "K") },
                  { label: "Emails",     val: String(cur.emails * 100) },
                  { label: "Lancements", val: String(cur.lancements) },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: `${C.accent}15`, border: `1px solid ${C.accent}30`,
                    borderRadius: 8, padding: "4px 10px",
                    fontSize: 11, color: C.accent, fontWeight: 700,
                  }}>
                    {item.label}: {item.val}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={iaLoading}
              style={{
                width: "100%", padding: "15px", borderRadius: 12,
                border: "none", cursor: iaLoading ? "wait" : "pointer",
                background: iaLoading ? C.muted : C.accent,
                color: C.bg, fontWeight: 800, fontSize: 15,
                fontFamily: "inherit", letterSpacing: "-0.3px",
                transition: "all .2s", opacity: iaLoading ? 0.7 : 1,
              }}
            >
              {iaLoading ? "⏳ Analyse en cours..." : "🤖 Analyser avec Claude"}
            </button>

            {iaResult && (
              <div style={{
                background: C.card, border: `1px solid ${C.cardBorder}`,
                borderRadius: 14, padding: 16,
                fontSize: 13, lineHeight: 1.75, color: C.text,
                whiteSpace: "pre-wrap",
              }}>
                {iaResult}
              </div>
            )}

            {!iaResult && !iaLoading && (
              <div style={{ textAlign: "center", color: C.muted, fontSize: 13, padding: "36px 0" }}>
                Lance une analyse pour obtenir des recommandations IA personnalisées sur tes KPIs.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        position: "fixed", bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: C.bg, borderTop: `1px solid ${C.cardBorder}`,
        padding: "8px 16px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: dataLoaded ? C.accent : C.muted,
        }} />
        <span style={{ fontSize: 10, color: C.muted }}>
          {dataLoaded ? "Données Google Sheets" : "Données de démo"}
        </span>
      </div>
    </div>
  );
}
