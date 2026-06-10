import { useState, useEffect, useCallback } from "react";

const TOOLS = [
  { id: "analyzer",  label: "Creative Analyzer",   icon: "ti-scan",           desc: "AI feedback on ad copy & creative" },
  { id: "abtest",    label: "A/B Headline Scorer",  icon: "ti-layout-columns", desc: "Compare two headlines head-to-head" },
  { id: "keywords",  label: "Keyword Generator",    icon: "ti-tag",            desc: "Build paid search keyword lists" },
  { id: "naming",    label: "Campaign Naming",      icon: "ti-tag-starred",    desc: "Consistent naming conventions" },
  { id: "workspace", label: "Client Workspace",     icon: "ti-building",       desc: "Save conventions per client" },
  { id: "utm",       label: "UTM Builder",          icon: "ti-link",           desc: "GA4-ready tracking URLs" },
  { id: "bulkutm",   label: "Bulk UTM Builder",     icon: "ti-list",           desc: "Tag multiple URLs at once" },
  { id: "adcopy",    label: "Ad Copy Generator",    icon: "ti-writing",        desc: "Generate RSA & display copy" },
  { id: "audience",  label: "Audience Planner",     icon: "ti-users",          desc: "Audience segment suggestions" },
];

const ACCENT = "#E8A020";

// ── URL & SEO HELPERS ─────────────────────────────────────────────────
const TOOL_META = {
  analyzer:  { path:"/tools/creative-analyzer",    title:"AI Ad Creative Analyzer — Free Tool | ADSTACK",           desc:"Get instant AI feedback on your ad headlines, descriptions and CTR potential. Free creative analyzer for paid media managers." },
  abtest:    { path:"/tools/ab-headline-scorer",   title:"A/B Headline Scorer — Compare Ad Variants | ADSTACK",     desc:"Compare two ad headline variants head-to-head and get AI-powered scoring, CTR predictions and a hybrid suggestion." },
  keywords:  { path:"/tools/keyword-generator",    title:"Google Ads Keyword Generator — Free PPC Tool | ADSTACK",  desc:"Generate branded, non-branded, competitor and long-tail keyword lists for paid search campaigns instantly." },
  naming:    { path:"/tools/campaign-naming",       title:"Campaign Naming Convention Generator | ADSTACK",          desc:"Generate consistent Google Ads and paid media campaign naming conventions for any channel, objective and geography." },
  workspace: { path:"/tools/client-workspace",      title:"Client Workspace — Save Campaign Conventions | ADSTACK", desc:"Save and manage campaign naming conventions across multiple clients in your personal paid media workspace." },
  utm:       { path:"/tools/utm-builder",           title:"GA4 UTM Builder — Free Campaign URL Generator | ADSTACK",desc:"Build GA4-ready UTM tagged URLs instantly with source, medium, campaign, term and content parameters." },
  bulkutm:   { path:"/tools/bulk-utm-builder",      title:"Bulk UTM Builder — Tag Multiple URLs at Once | ADSTACK", desc:"Paste multiple URLs and generate UTM tagged versions in bulk. Save hours on campaign URL tagging." },
  adcopy:    { path:"/tools/ad-copy-generator",     title:"AI Ad Copy Generator — RSA & Display | ADSTACK",         desc:"Generate complete RSA headline and description sets, display ad copy and PMax assets with AI in seconds." },
  audience:  { path:"/tools/audience-planner",      title:"Audience Planner — Paid Media Segments | ADSTACK",       desc:"Get AI-generated audience targeting recommendations for Google Ads, Meta, LinkedIn and programmatic campaigns." },
};
const PAGE_META = {
  blog:        { path:"/blog",        title:"Paid Media Blog — Insights & Guides | ADSTACK",       desc:"Practical paid media guides, Google Ads strategy, GA4 tutorials and adtech insights for digital marketing professionals." },
  advertising: { path:"/advertising", title:"Advertise on ADSTACK — Reach Paid Media Professionals",desc:"Advertise to digital marketers, PPC managers and agency teams. Premium ad placements on ADSTACK." },
  subscribe:   { path:"/subscribe",   title:"Subscribe to the ADSTACK Monthly Newsletter",           desc:"Weekly paid media hints, tips and strategy straight to your inbox. Free forever." },
  privacy:     { path:"/privacy",     title:"Privacy Policy | ADSTACK",                               desc:"ADSTACK privacy policy. How we collect, use and protect your data." },
  about:       { path:"/about",       title:"About ADSTACK — Built by Digital Marketing Practitioners",desc:"ADSTACK is a free AI-powered toolkit built by digital media professionals for paid media managers and PPC specialists." },
};
const SITE_DEFAULT = { title:"ADSTACK — Free AI-Powered Paid Media Toolkit", desc:"Free AI-powered tools for paid media managers and PPC specialists. UTM builder, keyword generator, ad creative analyzer, campaign naming and more." };

function useDocumentMeta(title, desc) {
  useEffect(() => {
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc); }
    metaDesc.content = desc;
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property','og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = title;
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property','og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = desc;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = 'https://adstack.co.uk' + window.location.pathname;
  }, [title, desc]);
}

function usePushState(path) {
  useEffect(() => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [path]);
}


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body, #root { background: #0d0d0d; color: #e8e8e0; font-family: 'IBM Plex Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #1a1a1a; }
  ::-webkit-scrollbar-thumb { background: #333; }

  textarea, input, select {
    background: #141414; border: 1px solid #2a2a2a; color: #e8e8e0;
    font-family: 'IBM Plex Sans', sans-serif; font-size: 14px;
    border-radius: 4px; outline: none; transition: border-color .2s;
  }
  textarea:focus, input:focus, select:focus { border-color: #E8A020; }
  textarea { resize: vertical; width: 100%; padding: 10px 12px; line-height: 1.6; }
  input   { width: 100%; padding: 8px 12px; height: 40px; }
  select  { width: 100%; padding: 8px 12px; height: 40px; cursor: pointer; }
  select option { background: #141414; }
  label { display: block; font-size: 12px; letter-spacing: .06em; color: #888; margin-bottom: 6px; text-transform: uppercase; }

  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; background: #E8A020; color: #0d0d0d;
    font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 500;
    border: none; border-radius: 4px; cursor: pointer;
    transition: background .2s, transform .1s; letter-spacing: .04em;
    white-space: nowrap;
  }
  .btn:hover   { background: #f0b030; }
  .btn:active  { transform: scale(.98); }
  .btn:disabled { background: #333; color: #666; cursor: not-allowed; }
  .btn-full { width: 100%; justify-content: center; }
  .btn-ghost {
    background: transparent; border: 1px solid #2a2a2a; color: #aaa;
    padding: 7px 14px; font-size: 12px;
  }
  .btn-ghost:hover { background: #1a1a1a; color: #e8e8e0; }
  .btn-danger {
    background: transparent; border: 1px solid #3a1a1a;
    color: #e06040; padding: 6px 12px; font-size: 11px;
  }
  .btn-danger:hover { background: #1a0a0a; }

  .card { background: #141414; border: 1px solid #1e1e1e; border-radius: 6px; padding: 20px; }
  .result-box {
    background: #0a0a0a; border: 1px solid #1e1e1e; border-radius: 4px;
    padding: 16px; font-size: 14px; line-height: 1.8; color: #d0d0c8;
    white-space: pre-wrap; min-height: 120px;
  }
  .spinner {
    width: 16px; height: 16px; border: 2px solid #333;
    border-top-color: #E8A020; border-radius: 50%;
    animation: spin .7s linear infinite; display: inline-block; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .copy-btn {
    background: transparent; border: none; color: #555; cursor: pointer;
    font-size: 11px; font-family: 'IBM Plex Mono', monospace;
    padding: 4px 8px; border-radius: 3px; transition: color .2s; flex-shrink: 0;
  }
  .copy-btn:hover { color: #E8A020; }

  /* ── layout helpers ── */
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .section-title {
    font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
    color: #555; margin-bottom: 12px; padding-bottom: 8px;
    border-bottom: 1px solid #1a1a1a;
  }
  .tab-row {
    display: flex; border-bottom: 1px solid #1e1e1e;
    margin-bottom: 20px; overflow-x: auto; -webkit-overflow-scrolling: touch;
  }
  .tab-row::-webkit-scrollbar { height: 2px; }
  .tab {
    padding: 10px 14px; font-size: 13px; cursor: pointer; color: #666;
    border-bottom: 2px solid transparent; transition: color .2s, border-color .2s;
    white-space: nowrap; flex-shrink: 0;
  }
  .tab.active  { color: #E8A020; border-bottom-color: #E8A020; }
  .tab:hover   { color: #aaa; }

  .kw-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: #141414; border: 1px solid #252525; border-radius: 3px;
    padding: 5px 10px; margin: 4px; font-size: 13px;
    font-family: 'IBM Plex Mono', monospace; color: #c8c8c0;
    cursor: pointer; transition: border-color .15s;
  }
  .kw-pill:hover    { border-color: #E8A020; color: #E8A020; }
  .kw-pill.selected { background: #1a1200; border-color: #E8A020; color: #E8A020; }

  .score-bar  { height: 6px; background: #1a1a1a; border-radius: 3px; overflow: hidden; margin-top: 4px; }
  .score-fill { height: 100%; border-radius: 3px; transition: width .8s ease; }
  .tip-box    { background: #0a0a0a; border-radius: 4px; padding: 12px 14px; border-left: 2px solid #E8A020; }
  .bottom-ad-slot   { height: 90px; }
  .bottom-ad-divider { height: 40px; }

  /* ── INLINE RESPONSIVE AD UNIT ── */
  .inline-ad {
    width: 100%; border: 1px solid #1a1a1a; border-radius: 6px;
    background: #0f0f0f; overflow: hidden; position: relative;
    margin-top: 8px; cursor: pointer; transition: border-color .2s;
  }
  .inline-ad:hover { border-color: #2a2a2a; }
  .inline-ad-label {
    font-size: 9px; letter-spacing: .1em; color: #252525;
    text-transform: uppercase; text-align: center; padding: 5px 0 0;
  }
  .inline-ad-slot {
    width: 100%; height: 90px;
    display: flex; align-items: center; justify-content: center;
    gap: 14px; padding: 0 24px; position: relative;
  }
  .inline-ad-slot::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, #E8A020 40%, #E8A020 60%, transparent);
    opacity: .1;
  }
  .inline-ad-size { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #252525; letter-spacing: .06em; }
  .inline-ad-divider { width: 1px; height: 40px; background: #1e1e1e; flex-shrink: 0; }
  .inline-ad-tag  { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #1e1e1e; letter-spacing: .04em; }
  .show-desktop   { display: inline; }
  .show-mobile    { display: none; }
  @media (max-width: 768px) {
    .inline-ad-slot   { height: 60px; padding: 0 16px; gap: 10px; }
    .inline-ad-divider { height: 26px; }
    .show-desktop { display: none; }
    .show-mobile  { display: inline; }
  }

  /* ── SIDEBAR (desktop) ── */
  .sidebar {
    width: 324px; background: #0a0a0a; border-right: 1px solid #1a1a1a;
    padding: 12px 0; flex-shrink: 0; overflow-y: auto;
    display: flex; flex-direction: column;
  }
  .sidebar-tool-btn {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 9px 16px; background: transparent; border: none;
    cursor: pointer; transition: all .15s; text-align: left;
  }

  /* ── MOBILE NAV ── */
  .mobile-header { display: none; }
  .mobile-drawer {
    position: fixed; inset: 0; z-index: 200;
    display: flex; flex-direction: column;
  }
  .mobile-drawer-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,.7);
    backdrop-filter: blur(2px);
  }
  .mobile-drawer-panel {
    position: relative; z-index: 1;
    width: min(92vw, 340px); height: 100%;
    background: #0a0a0a; border-right: 1px solid #1e1e1e;
    overflow-y: auto; display: flex; flex-direction: column;
  }

  /* ── MAIN CONTENT ── */
  .main-scroll { flex: 1; overflow: auto; padding: 28px; }
  .main-inner  { max-width: 720px; margin: 0 auto; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .sidebar       { display: none; }
    .mobile-header { display: flex; }
    .main-scroll   { padding: 16px; }
    .grid2         { grid-template-columns: 1fr; }
    .ab-cols       { grid-template-columns: 1fr !important; }
    .card          { padding: 14px; }
    .btn           { font-size: 12px; padding: 9px 16px; }
    .tab           { padding: 8px 10px; font-size: 12px; }
    h1.tool-title  { font-size: 16px !important; }
    .kw-pill       { font-size: 12px; padding: 4px 8px; }
    .hide-mobile   { display: none !important; }
    .utm-breakdown { grid-template-columns: 100px 1fr !important; }
    .bottom-ad-slot  { height: 58px !important; padding: 0 14px !important; gap: 10px !important; }
    .bottom-ad-divider { height: 26px !important; }
    .show-desktop   { display: none !important; }
    .show-mobile    { display: inline !important; }
  }

  @media (max-width: 480px) {
    .main-scroll  { padding: 12px; }
    .card         { padding: 12px; }
    .btn-row-wrap { flex-wrap: wrap; }
    .preset-row   { gap: 4px; }
    .preset-row .btn-ghost { font-size: 11px; padding: 5px 10px; }
  }
`;

/* ─────────────────────────────────────────── helpers ── */
async function callClaude(sys, msg, maxTokens = 1200) {
  const resp = await fetch("/.netlify/functions/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system: sys,
      messages: [{ role: "user", content: msg }],
    }),
  });
  const data = await resp.json();
  return data.content?.[0]?.text || "";
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="copy-btn"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
      {copied ? "✓" : "copy"}
    </button>
  );
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 768);
    window.addEventListener("resize", fn);
    fn(); // run once on mount to ensure accuracy
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

/* ─────────────────────────────────── CREATIVE ANALYZER ── */
function CreativeAnalyzer() {
  const [adType, setAdType]       = useState("search");
  const [headline, setHeadline]   = useState("");
  const [desc, setDesc]           = useState("");
  const [dispUrl, setDispUrl]     = useState("");
  const [result, setResult]       = useState("");
  const [loading, setLoading]     = useState(false);

  const analyze = async () => {
    setLoading(true); setResult("");
    const sys = `You are a senior paid media strategist and CRO expert. Use this exact format:
SCORE: [1-10]
CTR POTENTIAL: [Low/Medium/High] — [one sentence]
STRENGTHS:\n• [point]\n• [point]\n• [point]
WEAKNESSES:\n• [point]\n• [point]
QUICK WINS:\n• [improvement]\n• [improvement]\n• [improvement]
REWRITTEN HEADLINE: [improved version]
Be specific, direct, performance-focused.`;
    const r = await callClaude(sys,
      `Ad Type: ${adType}\nHeadline: ${headline}\nDescription: ${desc}${dispUrl ? `\nDisplay URL: ${dispUrl}` : ""}`);
    setResult(r); setLoading(false);
  };

  const score = result.match(/SCORE:\s*(\d+)/)?.[1];
  const sc    = score ? parseInt(score) : null;
  const col   = sc >= 7 ? "#4ab870" : sc >= 5 ? ACCENT : "#e06040";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div>
          <label>Ad Format</label>
          <select value={adType} onChange={e => setAdType(e.target.value)}>
            <option value="search">Google Search Ad</option>
            <option value="display">Display Banner</option>
            <option value="pmax">Performance Max</option>
            <option value="social">Social Ad (Meta/LinkedIn)</option>
          </select>
        </div>
        <div>
          <label>Display URL (optional)</label>
          <input placeholder="example.com/offer" value={dispUrl} onChange={e => setDispUrl(e.target.value)} />
        </div>
      </div>
      <div>
        <label>Headline / Main Copy</label>
        <input placeholder="e.g. Award-Winning Jewellery | Shop Now" value={headline} onChange={e => setHeadline(e.target.value)} />
        <div style={{ fontSize:11, color:headline.length>30?"#e06040":"#444", textAlign:"right", marginTop:3, fontFamily:"IBM Plex Mono" }}>
          {headline.length}/30
        </div>
      </div>
      <div>
        <label>Description / Body Copy</label>
        <textarea rows={3} placeholder="e.g. Handcrafted pearl jewellery. Free UK delivery." value={desc} onChange={e => setDesc(e.target.value)} />
        <div style={{ fontSize:11, color:desc.length>90?"#e06040":"#444", textAlign:"right", marginTop:3, fontFamily:"IBM Plex Mono" }}>
          {desc.length}/90
        </div>
      </div>
      <button className="btn btn-full" onClick={analyze} disabled={!headline || loading}>
        {loading ? <><span className="spinner" /> Analyzing…</> : <><i className="ti ti-scan" /> Analyze Creative</>}
      </button>
      {result && (
        <div className="card">
          {sc && (
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16, paddingBottom:16, borderBottom:"1px solid #1e1e1e" }}>
              <div style={{ fontSize:36, fontFamily:"IBM Plex Mono", fontWeight:500, color:col }}>{sc}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:"#555", marginBottom:6, fontFamily:"IBM Plex Mono" }}>CREATIVE SCORE / 10</div>
                <div className="score-bar"><div className="score-fill" style={{ width:`${sc*10}%`, background:col }} /></div>
              </div>
              <CopyButton text={result} />
            </div>
          )}
          <div className="result-box" style={{ fontSize:13 }}>{result}</div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────── A/B HEADLINE SCORER ── */
function ABHeadlineScorer() {
  const [headlineA, setHeadlineA] = useState("");
  const [headlineB, setHeadlineB] = useState("");
  const [descA, setDescA]         = useState("");
  const [descB, setDescB]         = useState("");
  const [adType, setAdType]       = useState("search");
  const [context, setContext]     = useState("");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);

  const compare = async () => {
    setLoading(true); setResult(null);
    const sys = `You are a paid media CRO expert. Return ONLY valid JSON:
{"winner":"A or B","confidence":"Low/Medium/High","scoreA":1-10,"scoreB":1-10,"ctrA":"Low/Medium/High","ctrB":"Low/Medium/High","reasonA":"2 sentences","reasonB":"2 sentences","winnerReason":"1-2 sentences","improvementA":"one quick win","improvementB":"one quick win","hybridHeadline":"best of both"}`;
    const r = await callClaude(sys,
      `Ad Type: ${adType}\nContext: ${context||"general conversion"}\nVariant A: ${headlineA}\nDesc A: ${descA||"N/A"}\nVariant B: ${headlineB}\nDesc B: ${descB||"N/A"}`);
    try { setResult(JSON.parse(r.replace(/```json|```/g,"").trim())); } catch { setResult({ error:r }); }
    setLoading(false);
  };

  const sc = s => s >= 7 ? "#4ab870" : s >= 5 ? ACCENT : "#e06040";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div>
          <label>Ad Format</label>
          <select value={adType} onChange={e => setAdType(e.target.value)}>
            <option value="search">Google Search</option>
            <option value="display">Display</option>
            <option value="social">Social</option>
            <option value="pmax">PMax</option>
          </select>
        </div>
        <div>
          <label>Campaign Goal (optional)</label>
          <input placeholder="e.g. Drive jewellery purchases" value={context} onChange={e => setContext(e.target.value)} />
        </div>
      </div>

      {/* A/B cards — stack on mobile */}
      <div className="ab-cols" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {[
          { v:"A", hl:headlineA, setHl:setHeadlineA, d:descA, setD:setDescA, color:ACCENT },
          { v:"B", hl:headlineB, setHl:setHeadlineB, d:descB, setD:setDescB, color:"#4ab870" },
        ].map(({ v, hl, setHl, d, setD, color }) => (
          <div key={v} className="card" style={{ borderColor: result?.winner===v ? color : "#1e1e1e" }}>
            <div style={{ fontSize:11, color, fontFamily:"IBM Plex Mono", letterSpacing:".08em", marginBottom:12 }}>VARIANT {v}</div>
            <div style={{ marginBottom:10 }}>
              <label>Headline</label>
              <input placeholder={`Headline variant ${v}`} value={hl} onChange={e => setHl(e.target.value)} />
              <div style={{ fontSize:10, color:hl.length>30?"#e06040":"#444", textAlign:"right", marginTop:3, fontFamily:"IBM Plex Mono" }}>{hl.length}/30</div>
            </div>
            <div>
              <label>Description (optional)</label>
              <textarea rows={2} placeholder={`Description ${v}`} value={d} onChange={e => setD(e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-full" onClick={compare} disabled={!headlineA||!headlineB||loading}>
        {loading ? <><span className="spinner" /> Comparing…</> : <><i className="ti ti-layout-columns" /> Compare Variants</>}
      </button>

      {result && !result.error && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div className="card" style={{ borderColor: result.winner==="A" ? ACCENT : "#4ab870", background:"#0f0f0f" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10, flexWrap:"wrap" }}>
              <div style={{ fontFamily:"IBM Plex Mono", fontSize:20, fontWeight:500, color: result.winner==="A"?ACCENT:"#4ab870" }}>
                Variant {result.winner} wins
              </div>
              <span style={{ fontSize:11, fontFamily:"IBM Plex Mono", color:"#555", background:"#1a1a1a", padding:"3px 10px", borderRadius:3 }}>
                {result.confidence} confidence
              </span>
            </div>
            <div style={{ fontSize:13, color:"#b0b0a8", marginBottom:10 }}>{result.winnerReason}</div>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ fontSize:11, color:"#555" }}>Hybrid:</span>
              <span style={{ fontFamily:"IBM Plex Mono", fontSize:12, color:"#e8e8e0" }}>{result.hybridHeadline}</span>
              <CopyButton text={result.hybridHeadline} />
            </div>
          </div>
          <div className="ab-cols" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {["A","B"].map(v => {
              const score = v==="A" ? result.scoreA : result.scoreB;
              const reason = v==="A" ? result.reasonA : result.reasonB;
              const ctr = v==="A" ? result.ctrA : result.ctrB;
              const imp = v==="A" ? result.improvementA : result.improvementB;
              const color = v==="A" ? ACCENT : "#4ab870";
              return (
                <div key={v} className="card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:11, fontFamily:"IBM Plex Mono", color }}>VARIANT {v}</span>
                    <span style={{ fontSize:20, fontFamily:"IBM Plex Mono", fontWeight:500, color:sc(score) }}>
                      {score}<span style={{ fontSize:11, color:"#444" }}>/10</span>
                    </span>
                  </div>
                  <div className="score-bar" style={{ marginBottom:10 }}>
                    <div className="score-fill" style={{ width:`${score*10}%`, background:sc(score) }} />
                  </div>
                  <div style={{ fontSize:12, color:"#888", marginBottom:6, lineHeight:1.6 }}>{reason}</div>
                  <div style={{ fontSize:11, color:"#555" }}>CTR: <span style={{ color:ctr==="High"?"#4ab870":ctr==="Medium"?ACCENT:"#e06040" }}>{ctr}</span></div>
                  <div style={{ fontSize:11, color:"#555", marginTop:4 }}>→ <span style={{ color:"#777" }}>{imp}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────── KEYWORD GENERATOR ── */
function KeywordGenerator() {
  const [business, setBusiness] = useState("");
  const [brief, setBrief]       = useState("");
  const [intent, setIntent]     = useState("all");
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState([]);
  const [tab, setTab]           = useState("all");

  const generate = async () => {
    setLoading(true); setResult(null); setSelected([]);
    const sys = `PPC keyword research specialist. Return ONLY valid JSON:
{"branded":[],"nonBranded":[],"competitor":[],"longTail":[],"negative":[]}
8-12 per category.`;
    const r = await callClaude(sys, `Business: ${business}\nBrief: ${brief}\nFocus: ${intent}`);
    try { setResult(JSON.parse(r.replace(/```json|```/g,"").trim())); } catch { setResult({ error:r }); }
    setLoading(false);
  };

  const toggle = kw => setSelected(p => p.includes(kw) ? p.filter(k=>k!==kw) : [...p,kw]);

  const all = result && !result.error ? {
    all:[...(result.branded||[]),...(result.nonBranded||[]),...(result.competitor||[]),...(result.longTail||[])],
    branded:result.branded||[], nonBranded:result.nonBranded||[],
    competitor:result.competitor||[], longTail:result.longTail||[], negative:result.negative||[],
  } : null;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div><label>Business Name</label><input placeholder="e.g. The Pearl & Gem Studio" value={business} onChange={e=>setBusiness(e.target.value)} /></div>
        <div>
          <label>Focus</label>
          <select value={intent} onChange={e=>setIntent(e.target.value)}>
            <option value="all">All Intent Types</option>
            <option value="transactional">Transactional</option>
            <option value="informational">Informational</option>
            <option value="navigational">Navigational</option>
          </select>
        </div>
      </div>
      <div><label>Business Brief</label><textarea rows={3} placeholder="e.g. Handcrafted pearl jewellery, studio tours, based in London." value={brief} onChange={e=>setBrief(e.target.value)} /></div>
      <button className="btn btn-full" onClick={generate} disabled={!business||!brief||loading}>
        {loading ? <><span className="spinner"/>Generating…</> : <><i className="ti ti-tag"/>Generate Keywords</>}
      </button>
      {all && (
        <div className="card">
          <div className="tab-row">
            {["all","branded","nonBranded","competitor","longTail","negative"].map(t=>(
              <div key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
                {t==="nonBranded"?"Non-Brand":t==="longTail"?"Long-tail":t.charAt(0).toUpperCase()+t.slice(1)}
                <span style={{ marginLeft:5, fontSize:10, color:"#444", fontFamily:"IBM Plex Mono" }}>{all[t]?.length||0}</span>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:12 }}>
            {(all[tab]||[]).map((kw,i)=>(
              <span key={i} className={`kw-pill ${selected.includes(kw)?"selected":""}`} onClick={()=>toggle(kw)}>
                {tab==="negative"&&<span style={{ color:"#e06040",fontSize:10 }}>−</span>}{kw}
              </span>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12, borderTop:"1px solid #1e1e1e", flexWrap:"wrap", gap:8 }}>
            <span style={{ fontSize:12, color:"#555" }}>{selected.length?`${selected.length} selected`:"Click to select"}</span>
            <div style={{ display:"flex", gap:8 }}>
              {selected.length>0 && <button className="btn btn-ghost" onClick={()=>setSelected([])}>Clear</button>}
              <button className="btn" onClick={()=>navigator.clipboard.writeText((selected.length?selected:all.all).join("\n"))}>
                <i className="ti ti-copy"/>Copy {selected.length?"Selected":"All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────── CAMPAIGN NAMING ── */
function CampaignNaming({ onSave }) {
  const [channel, setChannel]       = useState("google_search");
  const [brand, setBrand]           = useState("");
  const [campType, setCampType]     = useState("");
  const [geo, setGeo]               = useState("");
  const [objective, setObjective]   = useState("conversions");
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [saveName, setSaveName]     = useState("");
  const [saved, setSaved]           = useState(false);

  const generate = async () => {
    setLoading(true); setResult(null);
    const sys = `Marketing ops specialist. Return ONLY valid JSON:
{"campaign":"TEMPLATE","adGroup":"TEMPLATE","examples":["e1","e2","e3"],"conventions":{"separators":"","case":"","date":"","geo":"","notes":""},"variants":["v1","v2","v3"]}`;
    const r = await callClaude(sys,`Channel:${channel}\nBrand:${brand}\nType:${campType}\nGeo:${geo||"UK"}\nObjective:${objective}`);
    try { setResult(JSON.parse(r.replace(/```json|```/g,"").trim())); } catch { setResult({ raw:r }); }
    setLoading(false);
  };

  const handleSave = () => {
    if (!saveName||!result) return;
    onSave({ name:saveName, channel, brand, campType, geo, objective, result, savedAt:new Date().toLocaleDateString() });
    setSaved(true); setTimeout(()=>setSaved(false),2000); setSaveName("");
  };

  const res = result && !result.raw ? result : null;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div><label>Brand / Client</label><input placeholder="e.g. PearlStudio" value={brand} onChange={e=>setBrand(e.target.value)} /></div>
        <div>
          <label>Channel</label>
          <select value={channel} onChange={e=>setChannel(e.target.value)}>
            <option value="google_search">Google Search</option>
            <option value="google_display">Google Display</option>
            <option value="pmax">Performance Max</option>
            <option value="meta">Meta Ads</option>
            <option value="linkedin">LinkedIn</option>
            <option value="bing">Microsoft Ads</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
      </div>
      <div className="grid2">
        <div><label>Campaign Type</label><input placeholder="Brand, Non-Brand, Retargeting…" value={campType} onChange={e=>setCampType(e.target.value)} /></div>
        <div>
          <label>Objective</label>
          <select value={objective} onChange={e=>setObjective(e.target.value)}>
            <option value="conversions">Conversions</option>
            <option value="leads">Lead Gen</option>
            <option value="awareness">Awareness</option>
            <option value="traffic">Traffic</option>
            <option value="roas">ROAS / Revenue</option>
          </select>
        </div>
      </div>
      <div><label>Geographic Target</label><input placeholder="e.g. UK, London, GB-ENG" value={geo} onChange={e=>setGeo(e.target.value)} /></div>
      <button className="btn btn-full" onClick={generate} disabled={!brand||!campType||loading}>
        {loading?<><span className="spinner"/>Generating…</>:<><i className="ti ti-tag-starred"/>Generate Convention</>}
      </button>
      {res && (
        <div className="card" style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {[{label:"Campaign Template",val:res.campaign,color:ACCENT},{label:"Ad Group Template",val:res.adGroup,color:"#4ab870"}].map(({label,val,color})=>(
            <div key={label}>
              <div className="section-title">{label}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"#0a0a0a", border:"1px solid #2a2a2a", borderRadius:4, padding:"10px 14px", flexWrap:"wrap" }}>
                <code style={{ fontFamily:"IBM Plex Mono", fontSize:13, color, flex:1, wordBreak:"break-all" }}>{val}</code>
                <CopyButton text={val} />
              </div>
            </div>
          ))}
          {res.examples && (
            <div>
              <div className="section-title">Live Examples</div>
              {res.examples.map((ex,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#444" }}>0{i+1}</span>
                  <code style={{ fontFamily:"IBM Plex Mono", fontSize:12, color:"#c8c8c0", flex:1, wordBreak:"break-all" }}>{ex}</code>
                  <CopyButton text={ex} />
                </div>
              ))}
            </div>
          )}
          {res.conventions && (
            <div>
              <div className="section-title">Convention Rules</div>
              {Object.entries(res.conventions).map(([k,v])=>(
                <div key={k} style={{ display:"grid", gridTemplateColumns:"90px 1fr", gap:8, marginBottom:6, fontSize:13 }}>
                  <span style={{ color:"#555", textTransform:"uppercase", fontSize:11, letterSpacing:".06em" }}>{k}</span>
                  <span style={{ color:"#b0b0a8" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ paddingTop:12, borderTop:"1px solid #1e1e1e" }}>
            <div className="section-title">Save to Client Workspace</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <input placeholder="Convention name, e.g. PearlStudio Google Search" value={saveName} onChange={e=>setSaveName(e.target.value)} style={{ flex:1, minWidth:180 }} />
              <button className="btn" onClick={handleSave} disabled={!saveName}>
                {saved?<><i className="ti ti-check"/>Saved!</>:<><i className="ti ti-building"/>Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────── CLIENT WORKSPACE ── */
function ClientWorkspace({ conventions, onDelete }) {
  const [filter, setFilter] = useState(null);
  const clients  = [...new Set(conventions.map(c=>c.brand))];
  const filtered = filter ? conventions.filter(c=>c.brand===filter) : conventions;

  if (!conventions.length) return (
    <div style={{ textAlign:"center", padding:"60px 20px" }}>
      <i className="ti ti-building" style={{ fontSize:32, color:"#2a2a2a", display:"block", marginBottom:12 }} />
      <div style={{ color:"#444", fontSize:14, marginBottom:8 }}>No saved conventions yet</div>
      <div style={{ color:"#333", fontSize:12 }}>Use Campaign Naming → Save to Client Workspace</div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:11, color:"#555", letterSpacing:".06em", textTransform:"uppercase" }}>Filter:</span>
        <button className="btn btn-ghost" style={filter===null?{borderColor:ACCENT,color:ACCENT}:{}} onClick={()=>setFilter(null)}>
          All ({conventions.length})
        </button>
        {clients.map(c=>(
          <button key={c} className="btn btn-ghost" style={filter===c?{borderColor:ACCENT,color:ACCENT}:{}} onClick={()=>setFilter(filter===c?null:c)}>{c}</button>
        ))}
      </div>
      {filtered.map((conv,i)=>(
        <div key={i} className="card" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontWeight:500, color:"#e8e8e0", fontSize:14, marginBottom:4 }}>{conv.name}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {[conv.channel,conv.objective].map(t=>(
                  <span key={t} style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#555", background:"#1a1a1a", padding:"2px 8px", borderRadius:2 }}>{t}</span>
                ))}
                <span style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#333" }}>saved {conv.savedAt}</span>
              </div>
            </div>
            <button className="btn btn-danger" onClick={()=>onDelete(i)}><i className="ti ti-trash" style={{ fontSize:12 }}/>Delete</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:6 }}>
            {[{lbl:"Campaign",val:conv.result.campaign,col:ACCENT},{lbl:"Ad Group",val:conv.result.adGroup,col:"#4ab870"}].map(({lbl,val,col})=>(
              <>{" "}
                <span key={lbl+"k"} style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:col, paddingTop:2 }}>{lbl}</span>
                <div key={lbl+"v"} style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                  <code style={{ fontFamily:"IBM Plex Mono", fontSize:12, color:"#c8c8c0", wordBreak:"break-all" }}>{val}</code>
                  <CopyButton text={val} />
                </div>
              </>
            ))}
          </div>
          {conv.result.examples && (
            <div style={{ paddingTop:8, borderTop:"1px solid #1a1a1a" }}>
              <div style={{ fontSize:10, color:"#333", letterSpacing:".06em", marginBottom:6, textTransform:"uppercase" }}>Examples</div>
              {conv.result.examples.map((ex,j)=>(
                <div key={j} style={{ display:"flex", gap:8, marginBottom:4, alignItems:"center", flexWrap:"wrap" }}>
                  <code style={{ fontFamily:"IBM Plex Mono", fontSize:11, color:"#666", flex:1, wordBreak:"break-all" }}>{ex}</code>
                  <CopyButton text={ex} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────── UTM BUILDER ── */
function UTMBuilder() {
  const [url, setUrl]         = useState("");
  const [source, setSource]   = useState("");
  const [medium, setMedium]   = useState("cpc");
  const [campaign, setCamp]   = useState("");
  const [term, setTerm]       = useState("");
  const [content, setContent] = useState("");
  const [ga4id, setGa4id]     = useState("");
  const [copied, setCopied]   = useState(false);

  const clean = s => s.trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"");
  const params = [
    ["utm_source",clean(source)], ["utm_medium",clean(medium)], ["utm_campaign",clean(campaign)],
    ...(term?[["utm_term",clean(term)]]:[]),
    ...(content?[["utm_content",clean(content)]]:[]),
    ...(ga4id?[["utm_id",ga4id.trim()]]:[]),
  ];
  const ok      = url&&source&&medium&&campaign;
  const base    = url.includes("?") ? url+"&" : url+"?";
  const fullUrl = ok ? base+params.map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join("&") : "";

  const presets = [
    {label:"Google Search",source:"google",medium:"cpc"},
    {label:"Google Display",source:"google",medium:"display"},
    {label:"Meta Paid",source:"facebook",medium:"paid_social"},
    {label:"Email",source:"email",medium:"email"},
    {label:"LinkedIn",source:"linkedin",medium:"paid_social"},
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div><label>Landing Page URL</label><input placeholder="https://yoursite.com/page" value={url} onChange={e=>setUrl(e.target.value)} /></div>
      <div>
        <div className="section-title">Quick Presets</div>
        <div className="preset-row" style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {presets.map(p=><button key={p.label} className="btn btn-ghost" onClick={()=>{setSource(p.source);setMedium(p.medium);}}>{p.label}</button>)}
        </div>
      </div>
      <div className="grid2">
        <div><label>utm_source *</label><input placeholder="google, facebook…" value={source} onChange={e=>setSource(e.target.value)} /></div>
        <div>
          <label>utm_medium *</label>
          <select value={medium} onChange={e=>setMedium(e.target.value)}>
            {["cpc","display","paid_social","email","social","affiliate","referral","organic"].map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div><label>utm_campaign *</label><input placeholder="spring_sale_2025" value={campaign} onChange={e=>setCamp(e.target.value)} /></div>
      <div className="grid2">
        <div><label>utm_term</label><input placeholder="keyword" value={term} onChange={e=>setTerm(e.target.value)} /></div>
        <div><label>utm_content</label><input placeholder="banner_v1" value={content} onChange={e=>setContent(e.target.value)} /></div>
      </div>
      <div><label>utm_id <span style={{ color:"#555",fontSize:10 }}>GA4 campaign ID</span></label><input placeholder="12345" value={ga4id} onChange={e=>setGa4id(e.target.value)} /></div>
      {ok && (
        <div className="card">
          <div className="section-title">Parameter Breakdown</div>
          <div style={{ marginBottom:16 }}>
            {params.map(([k,v])=>(
              <div key={k} className="utm-breakdown" style={{ display:"grid", gridTemplateColumns:"130px 1fr", gap:8, marginBottom:6, alignItems:"center" }}>
                <span className="utm-key">{k}</span>
                <span style={{ fontFamily:"IBM Plex Mono", fontSize:13, color:"#c8c8c0", wordBreak:"break-all" }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="section-title">Full URL</div>
          <div style={{ background:"#0a0a0a", border:"1px solid #2a2a2a", borderRadius:4, padding:"12px", wordBreak:"break-all", fontFamily:"IBM Plex Mono", fontSize:11, marginBottom:12, lineHeight:1.7 }}>
            <span style={{ color:"#e8e8e0" }}>{url}</span><span style={{ color:"#555" }}>?</span>
            {params.map(([k,v],i)=>(
              <span key={k}><span style={{ color:ACCENT }}>{k}</span><span style={{ color:"#555" }}>=</span><span style={{ color:"#4ab870" }}>{encodeURIComponent(v)}</span>{i<params.length-1&&<span style={{ color:"#555" }}>&amp;</span>}</span>
            ))}
          </div>
          <button className="btn btn-full" onClick={()=>{navigator.clipboard.writeText(fullUrl);setCopied(true);setTimeout(()=>setCopied(false),1500);}}>
            {copied?<><i className="ti ti-check"/>Copied!</>:<><i className="ti ti-copy"/>Copy Full URL</>}
          </button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────── BULK UTM BUILDER ── */
function BulkUTMBuilder() {
  const [urlInput, setUrlInput] = useState("");
  const [source, setSource]     = useState("");
  const [medium, setMedium]     = useState("cpc");
  const [campaign, setCamp]     = useState("");
  const [term, setTerm]         = useState("");
  const [content, setContent]   = useState("");
  const [results, setResults]   = useState([]);
  const [copied, setCopied]     = useState(false);

  const clean = s => s.trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_-]/g,"");
  const buildParams = (eTerm,eContent) => {
    const p = [["utm_source",clean(source)],["utm_medium",clean(medium)],["utm_campaign",clean(campaign)]];
    if (eTerm||term)    p.push(["utm_term",clean(eTerm||term)]);
    if (eContent||content) p.push(["utm_content",clean(eContent||content)]);
    return p.map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join("&");
  };

  const buildUrls = () => {
    const lines = urlInput.split("\n").map(l=>l.trim()).filter(Boolean);
    setResults(lines.map(line => {
      const [url,rTerm,rContent] = line.split("\t");
      const base = url.includes("?") ? url+"&" : url+"?";
      return { url, tagged: base+buildParams(rTerm||"",rContent||"") };
    }));
  };

  const urlCount = urlInput.split("\n").filter(l=>l.trim()).length;
  const ok = urlInput.trim()&&source&&medium&&campaign;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="tip-box">
        <div style={{ fontSize:11, color:ACCENT, letterSpacing:".06em", marginBottom:6 }}>HOW TO USE</div>
        <div style={{ fontSize:12, color:"#888", lineHeight:1.7 }}>
          Paste one URL per line. Optionally add tab-separated columns for per-row utm_term and utm_content:<br />
          <code style={{ fontFamily:"IBM Plex Mono", fontSize:11, color:"#666" }}>https://site.com/page[TAB]keyword[TAB]variant_a</code>
        </div>
      </div>
      <div>
        <label>URLs (one per line)</label>
        <textarea rows={5} placeholder={"https://yoursite.com/page-one\nhttps://yoursite.com/page-two"} value={urlInput} onChange={e=>setUrlInput(e.target.value)} style={{ fontFamily:"IBM Plex Mono", fontSize:12 }} />
        <div style={{ fontSize:11, color:"#444", textAlign:"right", marginTop:3, fontFamily:"IBM Plex Mono" }}>{urlCount} URLs</div>
      </div>
      <div className="grid2">
        <div><label>utm_source *</label><input placeholder="google, facebook…" value={source} onChange={e=>setSource(e.target.value)} /></div>
        <div>
          <label>utm_medium *</label>
          <select value={medium} onChange={e=>setMedium(e.target.value)}>
            {["cpc","display","paid_social","email","social","affiliate"].map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div><label>utm_campaign *</label><input placeholder="spring_sale_2025" value={campaign} onChange={e=>setCamp(e.target.value)} /></div>
      <div className="grid2">
        <div><label>utm_term (default)</label><input placeholder="per-row override via tab" value={term} onChange={e=>setTerm(e.target.value)} /></div>
        <div><label>utm_content (default)</label><input placeholder="per-row override via tab" value={content} onChange={e=>setContent(e.target.value)} /></div>
      </div>
      <button className="btn btn-full" onClick={buildUrls} disabled={!ok}>
        <i className="ti ti-list"/>Build {urlCount||""} URLs
      </button>
      {results.length>0 && (
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
            <div className="section-title" style={{ margin:0, border:"none", padding:0 }}>{results.length} Tagged URLs</div>
            <button className="btn" style={{ padding:"6px 14px", fontSize:12 }} onClick={()=>{navigator.clipboard.writeText(results.map(r=>r.tagged).join("\n"));setCopied(true);setTimeout(()=>setCopied(false),1500);}}>
              {copied?<><i className="ti ti-check"/>Copied!</>:<><i className="ti ti-copy"/>Copy All</>}
            </button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:360, overflowY:"auto" }}>
            {results.map((r,i)=>(
              <div key={i} style={{ background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:4, padding:"8px 12px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#444" }}>{String(i+1).padStart(2,"0")}</span>
                  <CopyButton text={r.tagged} />
                </div>
                <div style={{ fontFamily:"IBM Plex Mono", fontSize:11, color:"#666", wordBreak:"break-all", lineHeight:1.5 }}>
                  <span style={{ color:"#e8e8e0" }}>{r.url}</span>
                  <span style={{ color:"#555" }}>?</span>
                  <span style={{ color:ACCENT }}>{r.tagged.split("?")[1]||""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────── AD COPY GENERATOR ── */
function AdCopyGenerator() {
  const [format, setFormat] = useState("rsa");
  const [product, setProduct] = useState("");
  const [usp, setUsp]         = useState("");
  const [cta, setCta]         = useState("Shop Now");
  const [tone, setTone]       = useState("professional");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true); setResult(null);
    const sys = `Direct response copywriter. Return ONLY valid JSON.
RSA: {"headlines":["h1"..."h15"],"descriptions":["d1"..."d4"],"tips":["t1","t2"]}
Other: {"primary":["p1","p2","p3"],"headlines":["h1","h2","h3"],"cta":["c1","c2","c3"],"tips":["t1","t2"]}
Headlines ≤30 chars, descriptions ≤90 chars.`;
    const r = await callClaude(sys,`Format:${format}\nProduct:${product}\nUSPs:${usp}\nCTA:${cta}\nTone:${tone}`,1400);
    try { setResult(JSON.parse(r.replace(/```json|```/g,"").trim())); } catch { setResult({ raw:r }); }
    setLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div>
          <label>Format</label>
          <select value={format} onChange={e=>setFormat(e.target.value)}>
            <option value="rsa">Responsive Search Ad (RSA)</option>
            <option value="display">Display / Social</option>
            <option value="pmax">PMax Text Assets</option>
          </select>
        </div>
        <div>
          <label>Tone</label>
          <select value={tone} onChange={e=>setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="urgent">Urgent / Direct</option>
            <option value="luxury">Luxury / Premium</option>
            <option value="friendly">Friendly</option>
            <option value="bold">Bold / Disruptive</option>
          </select>
        </div>
      </div>
      <div><label>Product / Service</label><input placeholder="e.g. Handcrafted pearl jewellery, studio tours" value={product} onChange={e=>setProduct(e.target.value)} /></div>
      <div><label>Key USPs</label><textarea rows={2} placeholder="Award-winning, free UK delivery, 20+ years experience…" value={usp} onChange={e=>setUsp(e.target.value)} /></div>
      <div><label>Primary CTA</label><input placeholder="Shop Now, Book a Tour…" value={cta} onChange={e=>setCta(e.target.value)} /></div>
      <button className="btn btn-full" onClick={generate} disabled={!product||loading}>
        {loading?<><span className="spinner"/>Writing…</>:<><i className="ti ti-writing"/>Generate Copy</>}
      </button>
      {result && !result.raw && (
        <div className="card" style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {result.headlines && (
            <div>
              <div className="section-title">Headlines <span style={{ float:"right",fontSize:10,color:"#555" }}>≤30 chars</span></div>
              {result.headlines.map((h,i)=>(
                <div key={i} style={{ display:"grid", gridTemplateColumns:"22px 1fr 60px auto", gap:8, alignItems:"center", padding:"6px 0", borderBottom:"1px solid #1a1a1a" }}>
                  <span style={{ fontFamily:"IBM Plex Mono",fontSize:10,color:"#333" }}>H{i+1}</span>
                  <span style={{ fontSize:13,color:"#e8e8e0",wordBreak:"break-word" }}>{h}</span>
                  <span style={{ fontFamily:"IBM Plex Mono",fontSize:10,color:h.length>30?"#e06040":"#444",textAlign:"right" }}>{h.length}/30</span>
                  <CopyButton text={h} />
                </div>
              ))}
            </div>
          )}
          {result.descriptions && (
            <div>
              <div className="section-title">Descriptions <span style={{ float:"right",fontSize:10,color:"#555" }}>≤90 chars</span></div>
              {result.descriptions.map((d,i)=>(
                <div key={i} style={{ display:"grid", gridTemplateColumns:"22px 1fr 60px auto", gap:8, alignItems:"center", padding:"6px 0", borderBottom:"1px solid #1a1a1a" }}>
                  <span style={{ fontFamily:"IBM Plex Mono",fontSize:10,color:"#333" }}>D{i+1}</span>
                  <span style={{ fontSize:13,color:"#e8e8e0",wordBreak:"break-word" }}>{d}</span>
                  <span style={{ fontFamily:"IBM Plex Mono",fontSize:10,color:d.length>90?"#e06040":"#444",textAlign:"right" }}>{d.length}/90</span>
                  <CopyButton text={d} />
                </div>
              ))}
            </div>
          )}
          {result.primary && (
            <div>
              <div className="section-title">Primary Text</div>
              {result.primary.map((p,i)=>(
                <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}>
                  <span style={{ fontFamily:"IBM Plex Mono",fontSize:10,color:"#333",paddingTop:2,flexShrink:0 }}>0{i+1}</span>
                  <span style={{ fontSize:13,color:"#e8e8e0",flex:1 }}>{p}</span>
                  <CopyButton text={p} />
                </div>
              ))}
            </div>
          )}
          {result.tips && (
            <div className="tip-box">
              <div style={{ fontSize:11,color:ACCENT,letterSpacing:".06em",marginBottom:8 }}>PERFORMANCE TIPS</div>
              {result.tips.map((t,i)=><div key={i} style={{ fontSize:12,color:"#888",marginBottom:4 }}>→ {t}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────── AUDIENCE PLANNER ── */
function AudiencePlanner() {
  const [business, setBusiness] = useState("");
  const [platform, setPlatform] = useState("google");
  const [product, setProduct]   = useState("");
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);

  const generate = async () => {
    setLoading(true); setResult(null);
    const sys = `Paid media audience strategist. Return ONLY valid JSON:
{"primary":[{"name":"","type":"in-market/affinity/custom/remarketing","description":"","size":"small/medium/large","priority":"high/medium"}],"remarketing":[{"name":"","description":"","lookback":"7/14/30/90 days"}],"exclusions":[""],"tip":""}`;
    const r = await callClaude(sys,`Business:${business}\nProduct:${product}\nPlatform:${platform}`);
    try { setResult(JSON.parse(r.replace(/```json|```/g,"").trim())); } catch { setResult({ raw:r }); }
    setLoading(false);
  };

  const typeColor = t => ({ "in-market":"#6090d0","affinity":"#9070d0","custom":ACCENT,"remarketing":"#4ab870" }[t]||"#888");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="grid2">
        <div><label>Business / Brand</label><input placeholder="e.g. The Pearl & Gem Studio" value={business} onChange={e=>setBusiness(e.target.value)} /></div>
        <div>
          <label>Platform</label>
          <select value={platform} onChange={e=>setPlatform(e.target.value)}>
            <option value="google">Google Ads</option>
            <option value="meta">Meta Ads</option>
            <option value="linkedin">LinkedIn Ads</option>
            <option value="programmatic">DV360 / Programmatic</option>
          </select>
        </div>
      </div>
      <div><label>Product / Service</label><textarea rows={2} placeholder="e.g. Luxury handcrafted pearl jewellery. Studio tours. Bespoke commissions." value={product} onChange={e=>setProduct(e.target.value)} /></div>
      <button className="btn btn-full" onClick={generate} disabled={!business||!product||loading}>
        {loading?<><span className="spinner"/>Planning…</>:<><i className="ti ti-users"/>Plan Audiences</>}
      </button>
      {result && !result.raw && (
        <div className="card" style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {result.primary && (
            <div>
              <div className="section-title">Primary Segments</div>
              {result.primary.map((seg,i)=>(
                <div key={i} style={{ padding:"10px 0", borderBottom:"1px solid #1a1a1a", display:"flex", justifyContent:"space-between", gap:8, alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13,fontWeight:500,color:"#e8e8e0" }}>{seg.name}</span>
                      <span style={{ fontSize:10,color:typeColor(seg.type),background:"#1a1a1a",padding:"1px 7px",borderRadius:2,fontFamily:"IBM Plex Mono" }}>{seg.type}</span>
                      <span style={{ fontSize:10,color:"#444",fontFamily:"IBM Plex Mono" }}>{seg.size}</span>
                    </div>
                    <div style={{ fontSize:12,color:"#888" }}>{seg.description}</div>
                  </div>
                  <span style={{ fontSize:10,fontFamily:"IBM Plex Mono",color:seg.priority==="high"?"#4ab870":ACCENT,background:"#0a0a0a",padding:"2px 8px",borderRadius:2,whiteSpace:"nowrap",flexShrink:0 }}>{seg.priority}</span>
                </div>
              ))}
            </div>
          )}
          {result.remarketing && (
            <div>
              <div className="section-title">Remarketing Lists</div>
              {result.remarketing.map((seg,i)=>(
                <div key={i} style={{ padding:"8px 0", borderBottom:"1px solid #1a1a1a", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
                  <div>
                    <div style={{ fontSize:13,color:"#4ab870",marginBottom:2 }}>{seg.name}</div>
                    <div style={{ fontSize:12,color:"#888" }}>{seg.description}</div>
                  </div>
                  <span style={{ fontFamily:"IBM Plex Mono",fontSize:11,color:"#555",whiteSpace:"nowrap",flexShrink:0 }}>{seg.lookback}</span>
                </div>
              ))}
            </div>
          )}
          {result.exclusions && (
            <div>
              <div className="section-title">Exclusions</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {result.exclusions.map((ex,i)=><span key={i} style={{ fontFamily:"IBM Plex Mono",fontSize:12,color:"#e06040",background:"#1a0a0a",border:"1px solid #3a1a1a",borderRadius:3,padding:"3px 10px" }}>− {ex}</span>)}
              </div>
            </div>
          )}
          {result.tip && (
            <div className="tip-box">
              <div style={{ fontSize:11,color:ACCENT,letterSpacing:".06em",marginBottom:6 }}>STRATEGIC TIP</div>
              <div style={{ fontSize:13,color:"#b0b0a8" }}>{result.tip}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────── BOTTOM RESPONSIVE AD UNIT ── */
function BottomAdUnit() {
  const isMobile = useIsMobile();
  const [hover, setHover] = useState(false);
  const slotH = isMobile ? 58 : 90;
  const divH  = isMobile ? 26 : 40;
  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{ width:"100%", border:`1.5px solid ${hover ? "#2a2a2a" : "#1a1a1a"}`,
        borderRadius:6, background:"#0f0f0f", overflow:"hidden", cursor:"pointer",
        transition:"border-color .2s", marginTop:32 }}
      title="Responsive bottom ad slot — replace with your ad tag"
    >
      <div style={{ fontSize:9, letterSpacing:".1em", color:"#555", textTransform:"uppercase",
        textAlign:"center", padding:"5px 0 0", fontFamily:"'IBM Plex Mono',monospace" }}>
        Advertisement
      </div>
      <div style={{ width:"100%", height:slotH, display:"flex", alignItems:"center",
        justifyContent:"center", gap:isMobile?10:14, padding:`0 ${isMobile?14:24}px`,
        position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
          background:`linear-gradient(90deg,transparent,#E8A020 40%,#E8A020 60%,transparent)`,
          opacity: hover ? .25 : .12, transition:"opacity .2s" }} />
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flexShrink:0 }}>
          <i className="ti ti-ad-2" style={{ fontSize:isMobile?14:18, color:"#444" }} />
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"#555" }}>
            {isMobile ? "320 × 50" : "728 × 90"}
          </span>
        </div>
        <div style={{ width:1, height:divH, background:"#2a2a2a", flexShrink:0 }} />
        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:isMobile?9:10, color:"#555" }}>
            {isMobile ? "Mobile banner — insert ad tag here" : "Leaderboard — insert ad tag here"}
          </span>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:"#3a3a3a" }}>
            Responsive · switches format by breakpoint
          </span>
        </div>
      </div>
    </div>
  );
}

function InlineAdUnit() {
  const isMobile = useIsMobile();
  const [hover, setHover] = useState(false);
  const slotH = isMobile ? 58 : 90;
  const divH  = isMobile ? 26 : 40;
  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{ width:"100%", border:`1.5px solid ${hover ? "#2a2a2a" : "#1a1a1a"}`, borderRadius:6,
        background:"#0f0f0f", overflow:"hidden", cursor:"pointer",
        transition:"border-color .2s", marginTop:8 }}
      title="Responsive ad slot — replace with your ad tag"
    >
      <div style={{ fontSize:9, letterSpacing:".1em", color:"#555", textTransform:"uppercase",
        textAlign:"center", padding:"5px 0 0", fontFamily:"'IBM Plex Mono',monospace" }}>
        Advertisement
      </div>
      <div style={{ width:"100%", height:slotH, display:"flex", alignItems:"center",
        justifyContent:"center", gap:isMobile?10:14, padding:`0 ${isMobile?14:24}px`,
        position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
          background:`linear-gradient(90deg,transparent,#E8A020 40%,#E8A020 60%,transparent)`,
          opacity: hover ? .25 : .12, transition:"opacity .2s" }} />
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flexShrink:0 }}>
          <i className="ti ti-ad-2" style={{ fontSize:isMobile?14:18, color:"#444" }} />
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"#555" }}>
            {isMobile ? "320 × 50" : "728 × 90"}
          </span>
        </div>
        <div style={{ width:1, height:divH, background:"#2a2a2a", flexShrink:0 }} />
        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:isMobile?9:10, color:"#555" }}>
            {isMobile ? "Mobile banner — insert ad tag here" : "Leaderboard — insert ad tag here"}
          </span>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:"#3a3a3a" }}>
            Responsive · switches format by breakpoint
          </span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────── SIDEBAR AD UNIT (300×250) ── */
function AdUnit() {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ padding:"12px", borderTop:"1px solid #1a1a1a", marginTop:8 }}>
      <div style={{ fontSize:9, letterSpacing:".1em", color:"#333", textTransform:"uppercase",
        marginBottom:6, textAlign:"center", fontFamily:"IBM Plex Mono,monospace" }}>Advertisement</div>
      <div
        onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
        style={{ width:300, height:250, background:hover?"#161616":"#111",
          border:`1px solid ${hover?"#2a2a2a":"#1a1a1a"}`, borderRadius:4,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          cursor:"pointer", transition:"all .2s", position:"relative", overflow:"hidden", margin:"0 auto" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
          background:"#E8A020", opacity:hover?1:0.3, transition:"opacity .2s" }} />
        <i className="ti ti-ad-2" style={{ fontSize:28, color:"#2a2a2a", marginBottom:10 }} />
        <div style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:11, color:"#2a2a2a",
          letterSpacing:".06em", marginBottom:4 }}>300 × 250</div>
        <div style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:10, color:"#222" }}>AD PLACEMENT</div>
        <div style={{ position:"absolute", bottom:8, fontSize:9, color:"#222",
          fontFamily:"IBM Plex Mono,monospace" }}>Insert ad tag here</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────── STATIC PAGES ── */


function AdStackAdvertisingPage({ onBack }) {
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:ACCENT,fontFamily:"IBM Plex Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Advertising</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#e8e8e0",marginBottom:12,lineHeight:1.3}}>Reach the people who run paid media</h1>
        <p style={{fontSize:15,color:"#666",lineHeight:1.8}}>ADSTACK is used by digital marketers, paid media managers, PPC specialists, and agency teams across the UK. These are professionals who make daily decisions about ad spend, tools, and platforms — a high-intent, commercially active audience.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:28}}>
        {[
          {label:"Primary Audience",value:"Digital marketers & PPC managers"},
          {label:"Secondary Audience",value:"Agency teams & freelance consultants"},
          {label:"Geography",value:"Primarily UK-based"},
          {label:"Ad Formats",value:"728×90 leaderboard, 320×50 mobile, 300×250 sidebar"},
        ].map(item=>(
          <div key={item.label} className="card" style={{padding:"14px 16px"}}>
            <div style={{fontSize:10,color:"#555",letterSpacing:".08em",textTransform:"uppercase",fontFamily:"IBM Plex Mono,monospace",marginBottom:6}}>{item.label}</div>
            <div style={{fontSize:13,color:"#c8c8c0",lineHeight:1.5}}>{item.value}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{borderColor:"#2a2a2a",marginBottom:20}}>
        <div style={{fontSize:11,color:ACCENT,fontFamily:"IBM Plex Mono,monospace",letterSpacing:".08em",marginBottom:12,textTransform:"uppercase"}}>Get in touch</div>
        <p style={{fontSize:14,color:"#888",lineHeight:1.8,marginBottom:16}}>
          We offer direct advertising placements across ADSTACK — a great fit for martech vendors, SaaS tools, agencies, training providers, and anyone whose product serves the paid media community. All enquiries are handled personally and quickly.
        </p>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"#0a0a0a",border:`1px solid ${ACCENT}`,borderRadius:4,padding:"10px 18px"}}>
          <i className="ti ti-mail" style={{fontSize:15,color:ACCENT}}/>
          <a href="mailto:contact.adstack@gmail.com" style={{fontFamily:"IBM Plex Mono,monospace",fontSize:13,color:ACCENT,textDecoration:"none",letterSpacing:".03em"}}>contact.adstack@gmail.com</a>
        </div>
        <p style={{fontSize:12,color:"#444",marginTop:12,fontStyle:"italic"}}>Contact us directly for rates, formats and availability.</p>
      </div>
    </div>
  );
}

function AdStackAboutPage({ onBack }) {
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:ACCENT,fontFamily:"IBM Plex Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>About Us</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#e8e8e0",marginBottom:12,lineHeight:1.3}}>Built by practitioners, for practitioners</h1>
      </div>
      <div className="card" style={{marginBottom:16,lineHeight:1.9}}>
        <p style={{fontSize:14,color:"#888",marginBottom:16}}>
          Between us, our team brings over a decade of hands-on experience in web development and digital media — working across industries from retail and finance to healthcare and e-commerce, and everything in between. We've sat on both sides of the table: building the platforms and running the campaigns.
        </p>
        <p style={{fontSize:14,color:"#888",marginBottom:16}}>
          Over those years, one thing became consistently clear: the people doing the actual work — the paid media managers, the PPC specialists, the agency account leads — were patching together a dozen different tools to handle tasks that should be simple. UTM parameters built in spreadsheets. Campaign names documented in a shared Google Doc nobody could find. Ad copy reviewed by gut feel with no structured feedback.
        </p>
        <p style={{fontSize:14,color:"#888",marginBottom:16}}>
          So in 2026, we decided to do something about it. Our goal was straightforward: build the toolkit we always wished existed. AI-powered where it adds genuine value, fast and frictionless everywhere else, and completely free to use. No sign-up walls. No feature-gating. Just tools that work.
        </p>
        <p style={{fontSize:14,color:"#888"}}>
          ADSTACK is the result of that. We're continuing to build, iterate, and add new tools based on what the community actually needs. If you've got a suggestion, we genuinely want to hear it.
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
        {[
          {icon:"ti-calendar",label:"Founded",value:"2026"},
          {icon:"ti-map-pin",label:"Based in",value:"United Kingdom"},
          {icon:"ti-tool",label:"Tools available",value:"9 and growing"},
          {icon:"ti-users",label:"Built for",value:"Paid media professionals"},
        ].map(item=>(
          <div key={item.label} className="card" style={{padding:"12px 14px",textAlign:"center"}}>
            <i className={`ti ${item.icon}`} style={{fontSize:20,color:ACCENT,display:"block",marginBottom:8}}/>
            <div style={{fontSize:10,color:"#444",letterSpacing:".08em",textTransform:"uppercase",fontFamily:"IBM Plex Mono,monospace",marginBottom:4}}>{item.label}</div>
            <div style={{fontSize:13,color:"#c8c8c0"}}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdStackSubscribePage({ onBack }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:ACCENT,fontFamily:"IBM Plex Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Subscribe</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#e8e8e0",marginBottom:12,lineHeight:1.3}}>Stay sharp every week</h1>
        <p style={{fontSize:15,color:"#666",lineHeight:1.8}}>We send out a monthly email packed with paid media hints, tips, and practical advice — from campaign structure best practices to GA4 deep dives, keyword strategy, and the latest in adtech. No fluff, no filler. Just useful stuff you can apply straight away.</p>
      </div>
      {!submitted ? (
        <div className="card" style={{maxWidth:480}}>
          <div style={{fontSize:13,color:"#888",marginBottom:20,lineHeight:1.7}}>Enter your email below and we'll send you our monthly roundup on the first Monday of each month — free, forever.</div>
          <div style={{marginBottom:12}}>
            <label>Your email address</label>
            <input type="email" placeholder="you@yourcompany.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <button className="btn btn-full" onClick={()=>{ if(email.includes("@")) setSubmitted(true); }} disabled={!email.includes("@")}>
            <i className="ti ti-mail"/> Subscribe — it's free
          </button>
          <p style={{fontSize:11,color:"#333",marginTop:10,textAlign:"center",fontFamily:"IBM Plex Mono,monospace"}}>No spam. Unsubscribe any time.</p>
        </div>
      ) : (
        <div className="card" style={{textAlign:"center",padding:"32px 24px",maxWidth:480}}>
          <i className="ti ti-circle-check" style={{fontSize:36,color:ACCENT,display:"block",marginBottom:12}}/>
          <div style={{fontSize:16,fontWeight:500,color:"#e8e8e0",marginBottom:8}}>You're in!</div>
          <div style={{fontSize:13,color:"#666"}}>Thanks for subscribing. Your first edition lands next Monday.</div>
        </div>
      )}
    </div>
  );
}

function AdStackBlogPage({ onBack, onNavigate }) {
  const [article, setArticle] = useState(null);
  usePushState(article ? `/blog/${article}` : '/blog');
  useEffect(() => {
    if (article) {
      const post = posts.find(p => p.slug === article);
      if (post) {
        document.title = post.title + ' | ADSTACK';
        let m = document.querySelector('meta[name="description"]');
        if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
        m.content = post.intro;
        let c = document.querySelector('link[rel="canonical"]');
        if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c); }
        c.href = 'https://adstack.co.uk/blog/' + article;
      }
    }
  }, [article]);
  const posts = [
    {
      slug:"why-utm-parameters-matter",
      title:"Why UTM Parameters Are Non-Negotiable in Paid Media",
      readTime:"6 min read",
      category:"Analytics & Tracking",
      intro:"If you're running paid campaigns without UTM parameters, you're essentially flying blind. Here's why proper UTM tracking is one of the highest-leverage habits any paid media professional can build.",
      body:`Every pound you spend on paid media should be traceable. Not approximately traceable — precisely, reliably, consistently traceable. And yet, for all the sophistication that modern advertising platforms offer, one of the most common failures in digital marketing remains surprisingly basic: campaigns running without proper UTM parameters.

UTM parameters — Urchin Tracking Module parameters, a naming convention inherited from a web analytics tool Google acquired back in 2005 — are small snippets of text appended to your landing page URLs. They tell Google Analytics (and GA4 specifically) exactly where a visitor came from, how they got there, and which specific campaign, ad group, or piece of creative drove that visit.

A properly tagged URL looks something like this:

https://yoursite.com/landing?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale_2026&utm_term=running+shoes+uk&utm_content=headline_a

Five parameters. Each one adds a layer of granularity that transforms your analytics from vague channel-level data into something you can actually make decisions with.

WHY IT MATTERS MORE THAN MOST PEOPLE REALISE

The problem with untagged traffic isn't that it disappears — it's that it gets misattributed. GA4 will still register the visit. It will still count the session. But without UTM data, it will often categorise paid traffic as "direct" or lump it into a generic "referral" bucket, stripping away the campaign context you need to evaluate performance.

This creates a specific and damaging failure mode: you see your direct traffic performing brilliantly, you congratulate yourself on brand strength, and you under-invest in the paid channels that were actually responsible. The budget decisions that follow are based on a fiction.

For agencies managing multiple clients across multiple channels, the stakes are higher still. A single missing UTM on a high-spend campaign can make an entire channel look like it's not working — leading to budget cuts, channel pivots, and difficult client conversations that were all entirely avoidable.

THE FIVE PARAMETERS AND WHEN TO USE THEM

utm_source identifies where the traffic originated. Google, Facebook, LinkedIn, a newsletter — this should always be present, no exceptions.

utm_medium describes the marketing channel type. The most important thing here is consistency. If you use "cpc" for Google Search, use "cpc" every time — not "paid", not "PPC", not "google-cpc". Inconsistent medium values fragment your data and make channel-level reporting a headache.

utm_campaign maps to your campaign name. This is where a solid naming convention pays dividends — if your campaign names are structured and consistent, your GA4 reports become readable at a glance. If they're not, you'll spend more time deciphering your own data than acting on it.

utm_term is for paid search specifically — it captures the keyword that triggered the ad. Particularly useful when you're analysing which search terms are driving conversions versus which are burning budget.

utm_content is your A/B testing parameter. Use it to differentiate between ad variants, creative versions, or placements within the same campaign. It's the parameter most people ignore and the one that unlocks genuine creative testing discipline.

BUILDING A SUSTAINABLE UTM HABIT

The single biggest barrier to consistent UTM usage isn't knowledge — most marketers know they should be tagging their URLs. The barrier is friction. Manually constructing UTM strings is tedious, error-prone, and inconsistent across teams.

The solution is twofold: standardise your naming conventions (decide once what your sources, mediums, and campaign naming structure will be, document it, and enforce it) and use a builder tool that removes the manual construction step entirely.

When UTM tagging becomes a one-click operation rather than a manual string-building exercise, compliance goes up dramatically. And when compliance goes up, your analytics data becomes the reliable foundation it should always have been — and your paid media decisions get sharper as a result.`,
    },
    {
      slug:"campaign-naming-conventions-google-ads",
      title:"The Complete Guide to Campaign Naming Conventions in Google Ads",
      readTime:"7 min read",
      category:"Campaign Management",
      intro:"A consistent campaign naming convention is one of the most unglamorous — and most valuable — habits in paid media. Here is how to build one that scales across clients, channels and teams.",
      body:`Ask any paid media manager what their Google Ads account looks like after twelve months of multiple people making changes and you will get a similar answer. A graveyard of campaign names that made sense at the time, created by different people, following different logic, with nothing to tie them together.

Campaign_2024_brand_new. Google - Search - NB. SEARCH | Non-Brand | UK | Exact. March_Promo_v3_FINAL.

These are all real naming patterns that exist in real accounts right now. And the problem is not just aesthetic — it is operational. When campaign names are inconsistent, reporting becomes slow, automation breaks, and onboarding new team members takes three times longer than it should.

A naming convention solves all of this. The goal is simple: anyone looking at a campaign name should immediately understand what it is, where it runs, who it targets, and what it is trying to achieve — without having to open it.

THE ANATOMY OF A GOOD CAMPAIGN NAME

A well-structured campaign name is built from a fixed set of segments, separated by a consistent delimiter, always in the same order. A reliable structure for Google Search looks like this:

BRAND_CHANNEL_TYPE_GEO_OBJECTIVE_YYYYMM

Breaking that down: BRAND is the client or product name. CHANNEL is the platform (GSEARCH, GDISPLAY, PMAX, META, LI). TYPE is the campaign category (BRAND, NONBRAND, RLSA, RETARGETING, COMPETITOR). GEO is the geographic target (UK, US, LONDON, GB-ENG). OBJECTIVE is the goal (CONV, LEADS, AWARE, ROAS). YYYYMM is the launch date.

So a non-brand UK conversions campaign for a client called Pearl Studio launching in June 2026 becomes: PEARLSTUDIO_GSEARCH_NONBRAND_UK_CONV_202606

At a glance, from a campaign list, you know everything you need to know.

CHOOSING YOUR DELIMITER

Underscores are the most practical choice. They are readable, they survive export to spreadsheets without breaking, and they are safe in scripts and automated rules. Hyphens are acceptable but can cause issues in some automation tools. Spaces are never appropriate — they break in URLs, APIs, and scripts.

Whatever you choose, the rule is absolute consistency. A mix of underscores and hyphens in the same account is worse than using either one exclusively, because it defeats the purpose of having a system at all.

AD GROUP NAMING

The same logic applies one level down. A clean ad group name follows: BRAND_THEME_MATCHTYPE

Where THEME is the keyword cluster or audience segment, and MATCHTYPE is EXACT, PHRASE, or BROAD. So: PEARLSTUDIO_PEARL-EARRINGS_EXACT

MAKING IT STICK ACROSS A TEAM

A naming convention only works if everyone follows it, every time. The practical steps are straightforward: document it in a shared place everyone actually uses, build a naming generator tool into your workflow so the format is applied automatically rather than remembered manually, and audit existing campaigns before they get renamed — a half-migrated account is more confusing than a consistently bad one.

The investment in getting this right is small. The compounding return in reporting clarity, automation reliability, and team efficiency is significant. It is one of those rare things in paid media that costs almost nothing to do well and a great deal to undo when done badly.`,
    },
    {
      slug:"ga4-vs-universal-analytics-paid-media",
      title:"GA4 vs Universal Analytics — What Paid Media Managers Actually Need to Know",
      readTime:"6 min read",
      category:"Analytics & Tracking",
      intro:"Universal Analytics is gone. GA4 is here and it works very differently. For paid media managers, the shift is more significant than most realise — here is what has genuinely changed and what it means for your campaigns.",
      body:`If you have been putting off properly learning GA4 because you were comfortable with Universal Analytics, the grace period is over. Universal Analytics stopped processing hits in mid-2023 and historical data access has since been sunset. GA4 is not just an upgrade — it is a fundamentally different approach to web analytics, and the differences matter considerably for how paid media is measured and optimised.

THE CORE DIFFERENCE: EVENTS REPLACE SESSIONS

Universal Analytics was built around sessions and pageviews. A session was the fundamental unit of measurement — a container of interactions from a single visit, bucketed into neat channel groupings that were relatively predictable.

GA4 is built around events. Every interaction — a pageview, a scroll, a click, a video play, a form submission — is an event with attached parameters. There are no pageviews in the traditional sense. There are page_view events. This sounds like a semantic difference but it changes how almost everything is measured, attributed, and reported.

For paid media managers, the most immediately relevant change is in conversion tracking. What were called Goals in Universal Analytics are called Key Events in GA4. The mechanics are similar but the configuration is different, and the attribution models available have changed significantly.

ATTRIBUTION MODELS IN GA4

Universal Analytics offered a range of attribution models — last click, first click, linear, time decay, position-based — that you could apply in the Multi-Channel Funnels reports. GA4 has simplified this considerably. The default attribution model is data-driven attribution, which uses machine learning to distribute credit across touchpoints based on their actual contribution to conversions.

For most paid media accounts this is a positive change — data-driven attribution is generally more accurate than last-click and avoids the chronic under-crediting of upper-funnel channels that plagued Universal Analytics reporting. However, it also means that the numbers you see in GA4 will rarely match what you saw in Universal Analytics, and direct comparisons between the two are not meaningful.

CONNECTING GA4 TO GOOGLE ADS

The GA4 and Google Ads integration is where things get practically important. Linking the two accounts allows you to import Key Events as Google Ads conversions, use GA4 audiences for remarketing, and see GA4 metrics directly in Google Ads reports.

The setup is straightforward but requires admin access to both accounts and a few specific configurations to ensure data is flowing correctly. One common issue is duplicate conversion counting — where both the Google Ads conversion tag and the GA4-imported conversion are active simultaneously, inflating reported conversion numbers. Auditing your conversion actions when migrating is not optional.

WHAT HAS NOT CHANGED

UTM parameter tracking works the same way. Campaign, source, medium, term and content all populate in GA4 exactly as they did in Universal Analytics, and the Traffic Acquisition report is the closest equivalent to the old Acquisition reports. The main practical difference is that GA4 requires slightly more navigation to get to the same data, and the Explorations feature — GA4s free-form analysis tool — is where most of the deeper channel analysis now lives.

The fundamentals of what good analytics looks like have not changed. Clean UTM tagging, consistent naming, properly configured conversions, and regular auditing still form the foundation of reliable paid media measurement. GA4 just requires relearning where to find the outputs.`,
    },
    {
      slug:"how-to-structure-google-ads-account",
      title:"How to Structure a Google Ads Account for Maximum Performance",
      readTime:"8 min read",
      category:"Paid Search",
      intro:"Account structure is the foundation that everything else in Google Ads is built on. Get it right and optimisation becomes straightforward. Get it wrong and no amount of bid adjustments or ad copy tweaks will fix it.",
      body:`Google Ads account structure is one of those topics that experienced paid media managers feel strongly about and beginners underestimate. It is easy to get campaigns live. It is considerably harder to build an account architecture that supports long-term performance, clean reporting, and efficient budget management across months and years of activity.

This is not a guide to the basics. This is a framework for thinking about structure the way experienced practitioners do.

THE HIERARCHY AND WHY IT MATTERS

A Google Ads account has four levels: Account, Campaign, Ad Group, and Ad. Each level controls different things. Campaigns control budget, geographic targeting, bidding strategy, and network settings. Ad groups control keyword groupings and the ads that serve against them. Getting confused about which lever lives at which level is one of the most common sources of structural problems.

The most important structural principle is that campaigns should be segmented in a way that reflects how you want to control budget and bidding. If you need to allocate budget separately between brand and non-brand terms, they must be in separate campaigns. If you want different bidding strategies for different product categories, those categories need their own campaigns. Ad groups should then be tightly themed — clusters of closely related keywords that share a clear intent and can be served by the same ads.

BRAND VS NON-BRAND SEPARATION

Always separate brand and non-brand keywords into different campaigns. This is non-negotiable for any account managing meaningful spend. Brand campaigns typically have much higher conversion rates, lower CPCs, and better Quality Scores than non-brand. If they share a campaign, the budget and bidding dynamics of one will constantly interfere with the other, and your reporting will blur two fundamentally different traffic types into a single view.

Brand campaigns also serve a defensive purpose — preventing competitors from capturing branded search traffic — and should almost always be running regardless of budget pressure elsewhere. Keeping them structurally separate makes it easier to protect them.

SINGLE THEME AD GROUPS

The STAG — Single Theme Ad Group — approach has largely supplanted the older SKAG (Single Keyword Ad Group) model as Google has moved toward broader matching and smart bidding. The principle is that each ad group should contain keywords that share a clear, specific intent theme, with ads written to speak directly to that intent.

Tight ad groups produce better Quality Scores because ad relevance is higher. Better Quality Scores produce lower CPCs. Lower CPCs mean more clicks for the same budget. The compounding effect of good ad group structure on account efficiency over time is substantial.

PERFORMANCE MAX AND CAMPAIGN STRUCTURE

Performance Max has introduced structural complexity that did not exist previously. PMax campaigns access all Google inventory and use asset groups rather than traditional ad groups. The structural question with PMax is primarily about asset group organisation and audience signals rather than keyword clustering.

The practical recommendation for most accounts is to run PMax alongside traditional Search campaigns rather than replacing them entirely. Brand terms in particular should be protected in dedicated Search campaigns with exact match keywords to prevent PMax from cannibalising branded traffic at a higher cost.

NEGATIVE KEYWORDS AS STRUCTURAL TOOLS

Negative keywords are not just a hygiene task — they are a structural tool. Campaign-level negatives define the boundaries of what each campaign can and cannot match. A well-maintained negative keyword list at campaign level, combined with a shared negative list at account level, is what prevents your brand campaign from matching non-brand queries and your non-brand campaign from matching irrelevant traffic.

Structural clarity in an account is ultimately about control. The cleaner the structure, the more precisely you can control where budget goes, how bids are set, and what the reporting tells you. Accounts that start with a clear structure and maintain it consistently will always outperform accounts that accumulate structural complexity over time.`,
    }
,
    {
      slug:"how-to-set-up-scroll-depth-tracking-gtm",
      title:"How to Set Up Scroll Depth Tracking in Google Tag Manager",
      readTime:"6 min read",
      category:"Google Tag Manager",
      intro:"Scroll depth tracking is one of the most underused insights in digital analytics. Here is a step-by-step guide to setting it up properly in GTM so you can understand how far users actually read your content.",
      body:`Pageviews tell you someone visited. Time on page tells you roughly how long they stayed. But neither tells you what they actually did while they were there. Scroll depth tracking fills that gap — it tells you how far down a page a user scrolled, which is one of the most direct signals of genuine content engagement available in GA4.

The good news is that Google Tag Manager makes scroll depth tracking straightforward with its built-in Scroll Depth trigger. The less good news is that the default configuration is often set up in a way that produces noisy, misleading data. Here is how to do it properly.

WHAT SCROLL DEPTH TRACKING ACTUALLY MEASURES

A scroll depth event fires when a user scrolls past a defined threshold on a page — typically expressed as a percentage of total page height. Common thresholds are 25%, 50%, 75%, and 90%. When a user scrolls past each threshold, GTM fires a trigger that you can capture as a GA4 event.

The key insight is that 90% scroll depth is a strong signal of genuine engagement — someone who scrolls 90% of the way through a long article almost certainly read it, or at least engaged with it seriously. This makes scroll depth a far better proxy for content quality than pageviews or average session duration.

SETTING UP THE TRIGGER IN GTM

Open Google Tag Manager and navigate to Triggers, then create a new trigger. Select Scroll Depth as the trigger type. You will see options for Vertical Scroll Depths and Horizontal Scroll Depths — for most content tracking purposes you want Vertical.

Set the trigger to fire on Percentages and enter your thresholds: 25, 50, 75, 90. Enable the option to fire this trigger on all pages, or specify a page path pattern if you only want to track specific content types such as blog posts.

One important setting that is frequently overlooked: enable the option to fire this trigger only once per page. Without this, if a user scrolls down and then back up and down again, the trigger will fire multiple times for the same threshold, inflating your event counts.

CREATING THE GA4 TAG

With your trigger set up, create a new tag of type Google Analytics: GA4 Event. Connect it to your GA4 Measurement ID and give the event a clear name — scroll_depth is the standard convention.

Add event parameters to capture the useful data: {{Scroll Depth Threshold}} as a parameter named percent_scrolled, and {{Page Path}} as a parameter named page_path. This gives you the ability to segment scroll depth data by page in GA4 Explorations, which is where the real insight lives.

INTERPRETING THE DATA IN GA4

In GA4, navigate to Explorations and create a free-form report. Use percent_scrolled as a dimension and event_count as a metric, with page_path as a breakdown. This shows you which pages have strong read-through rates and which are losing readers early — exactly the insight you need to make informed decisions about content structure and length.

A page where 80% of users hit the 90% threshold is performing well. A page where only 20% make it past 50% has a problem — either the content is not delivering on the headline promise, the page loads slowly, or the layout is creating friction. Scroll depth data turns that from a guess into a diagnosis.`,
    },
    {
      slug:"gtm-vs-hardcoded-tags",
      title:"GTM vs Hardcoded Tags — Which Should You Use and When?",
      readTime:"5 min read",
      category:"Google Tag Manager",
      intro:"The debate between Google Tag Manager and hardcoded tracking tags has a clear answer — but it depends on what you are tracking, who is doing it, and how your development workflow is structured.",
      body:`Every digital analytics implementation eventually faces the same question: should this tag go through GTM or be hardcoded directly into the page? The answer is not always GTM, and understanding when each approach is appropriate will save you from a category of tracking problems that are surprisingly common and surprisingly painful to diagnose.

THE CASE FOR GTM

Google Tag Manager exists to solve a specific problem: the bottleneck between marketing teams who need tracking changes and development teams who control the codebase. Before tag management systems existed, every new pixel, every conversion tag, every analytics event required a code deployment. In fast-moving marketing environments, that was a serious constraint.

GTM removes that bottleneck for the majority of tracking needs. A paid media manager can add a new conversion event, test it in GTM's preview mode, and publish it without a single line going through a development sprint. For organisations where marketing and development move at different speeds — which is most organisations — this is a substantial operational advantage.

GTM is also excellent for tracking that needs to be flexible and iterable. If you are experimenting with different event structures in GA4, testing different attribution approaches, or managing tracking across multiple environments, GTM's container model and version history make that significantly easier than maintaining hardcoded implementations.

THE CASE FOR HARDCODED TAGS

The argument for hardcoded tags comes down to performance, reliability, and complexity. GTM adds a JavaScript library to every page load. For most sites the performance impact is negligible, but for high-performance applications where every millisecond of load time matters — e-commerce sites with significant revenue per second, for instance — the additional request and execution overhead of GTM is a legitimate concern.

More importantly, hardcoded implementations are more reliable for tracking that is truly critical. GTM tags can be blocked by ad blockers, browser extensions, and content security policies in ways that hardcoded implementations sometimes are not. For tracking that drives significant business decisions — primary conversion events, revenue attribution — a hardcoded implementation with a GTM layer on top is a defensible belt-and-braces approach.

THE PRACTICAL RECOMMENDATION

For most digital marketing tracking needs, GTM is the right answer. Page view events, scroll depth, click tracking, form submissions, and campaign conversion events all belong in GTM where they can be managed, tested, and updated without developer involvement.

For business-critical conversion tracking — purchases, lead form submissions that drive direct revenue attribution — implement both. Hardcode the primary conversion event and use GTM for additional tracking layers. This ensures your core measurement is never disrupted by GTM loading failures or blocking, while preserving the flexibility GTM provides for everything else.

The golden rule is straightforward: if a tracking failure would cause you to make a wrong business decision, hardcode it. If a tracking failure would be an inconvenience, GTM is fine.`,
    },
    {
      slug:"best-session-recording-tools-compared",
      title:"Best Session Recording Tools Compared: Hotjar vs Microsoft Clarity vs Others",
      readTime:"7 min read",
      category:"Analytics & Tracking",
      intro:"Session recording tools show you exactly how real users interact with your site — where they click, where they hesitate, and where they leave. Here is an honest comparison of the main options available in 2026.",
      body:`Quantitative analytics tells you what is happening on your site. Session recording tools tell you why. Watching a real user struggle to find your contact form, or repeatedly clicking on something that is not a link, or abandoning a checkout flow at a specific step — these observations produce insights that no amount of GA4 data can surface on its own.

The market for session recording tools has consolidated considerably over the past few years. Here is a clear-eyed comparison of the main options.

MICROSOFT CLARITY

Microsoft Clarity has become the default recommendation for most sites that do not have specific enterprise requirements, for one simple reason: it is completely free with no session or traffic limits. For a tool that would otherwise cost hundreds of pounds per month on competing platforms, this is a remarkable offer.

Clarity provides heatmaps, session recordings, and a dashboard of engagement metrics including rage clicks, dead clicks, and excessive scrolling — all automatically flagged without any configuration required. The interface is clean and the insights surface quickly.

The limitations are real but manageable. Data retention is 30 days. Export options are limited. The filtering and segmentation capabilities are less sophisticated than paid alternatives. For most small to mid-size sites and marketing teams, none of these limitations will matter. For enterprise use cases requiring deep segmentation, long data retention, or integration with other tools, Clarity will feel constrained.

HOTJAR

Hotjar was the category pioneer and remains the most widely used paid session recording tool. Its core offering — heatmaps, session recordings, and feedback surveys — is polished and well-integrated. The funnel analysis feature, which shows where users drop off across a defined sequence of pages, is particularly useful for e-commerce and lead generation sites.

The pricing structure has become a point of friction. Hotjar's free tier is genuinely limited, and the paid tiers have increased significantly in recent years. For agencies managing multiple client sites, the per-site pricing model adds up quickly.

Where Hotjar continues to justify its cost is in the depth of its segmentation and filtering capabilities, the quality of its funnel analysis, and the maturity of its integration ecosystem. If you need to filter recordings by traffic source, device type, user behaviour, and custom attributes simultaneously, Hotjar is more capable than Clarity.

FULLSTORY AND LOGROCKET

FullStory and LogRocket occupy the enterprise and developer-focused end of the market respectively. FullStory is the more established enterprise tool, with deep data capture, robust search across sessions, and integrations with major analytics and data warehouse platforms.

LogRocket differentiates by combining session recording with performance monitoring and error tracking, making it particularly useful for product and engineering teams who want to correlate user experience issues with technical errors. For SaaS products where user experience and application performance are tightly connected, LogRocket is a strong choice.

Both are significantly more expensive than Hotjar and are overkill for most marketing-focused use cases.

THE PRACTICAL RECOMMENDATION

Start with Microsoft Clarity. It is free, easy to implement via GTM, and will answer the majority of qualitative analytics questions for most sites. If you outgrow it — specifically if you need longer data retention, deeper segmentation, or funnel analysis — move to Hotjar. If you are running a SaaS product and need session recording tied to error monitoring, consider LogRocket.

Implementation for all of these tools follows the same pattern: a single JavaScript snippet that can be added via GTM without any developer involvement.`,
    },
    {
      slug:"how-to-debug-ga4-events-in-gtm",
      title:"How to Debug GA4 Events in Google Tag Manager",
      readTime:"6 min read",
      category:"Google Tag Manager",
      intro:"Debugging GA4 events is one of those skills that separates confident analytics practitioners from people who deploy tracking and hope for the best. Here is a systematic approach to verifying your implementation is working correctly.",
      body:`There is a specific kind of anxiety that comes with deploying a new GA4 tracking implementation and not being certain whether it is working correctly. Data starts appearing in GA4 after 24-48 hours, but by then you have lost the ability to catch problems early. Proper debugging before you publish eliminates that uncertainty entirely.

GTM AND GA4 BOTH PROVIDE DEBUGGING TOOLS — use both.

GTM PREVIEW MODE

GTM's built-in Preview mode is the first line of debugging. Before publishing any container changes, click Preview in the top right of the GTM interface. This opens a debug session in your browser where you can see every trigger that fires, every tag that executes, and every variable value in real time as you interact with your site.

The most useful view in GTM Preview is the Tags panel. When you perform an action on your site — clicking a button, submitting a form, scrolling — you can see immediately which tags fired, which fired but failed, and which did not fire at all. A tag showing as Fired confirms GTM executed it. A tag showing as Not Fired means your trigger conditions were not met.

For diagnosing trigger issues, click on any event in the left panel to see the exact state of all variables at that moment. If your trigger is supposed to fire when a button with a specific CSS class is clicked, you can verify exactly what class value GTM captured and compare it against your trigger condition.

GA4 DEBUGVIEW

GTM Preview confirms that tags are firing. GA4 DebugView confirms that events are arriving in GA4 with the correct parameters. These are two separate checks and both are necessary — a tag can fire in GTM but fail to send data to GA4 for several reasons.

To activate DebugView, install the Google Analytics Debugger Chrome extension and enable it. Navigate to GA4, go to Configure, then DebugView. Your device will appear in the panel and you will see events arriving in real time as you interact with your site.

In DebugView, click on any event to expand it and see all the parameters that arrived with it. This is where you verify that your event parameters are populated correctly — that utm_source is capturing the right value, that your conversion event is firing on the right page, that your custom dimensions are sending the expected data.

COMMON ISSUES AND HOW TO FIX THEM

The most frequent debugging issue is a tag that fires in GTM but shows no data in DebugView. This is almost always caused by an incorrect Measurement ID — double-check that your GA4 tag in GTM is pointing to the right property.

The second most common issue is trigger conditions that are too specific. If your trigger is set to fire on a click with a specific element ID and the developer has changed that ID, the trigger will silently stop working. Regularly auditing your trigger conditions against the current state of your site prevents this class of problem.

Variable values that are undefined or null in GTM Preview indicate that the data layer is not being populated correctly, or that your variable configuration is referencing the wrong key. Work with your development team to ensure the data layer push is happening at the right moment and with the correct structure.

PUBLISHING WITH CONFIDENCE

The correct workflow is: make changes in GTM, test in Preview mode, verify in DebugView, then publish. Skipping either of the testing steps because you are in a hurry is how tracking gaps that go unnoticed for months are created. The twenty minutes spent on proper debugging before publishing is always worth it.`,
    },
    {
      slug:"what-is-a-data-layer",
      title:"What Is a Data Layer and Do You Actually Need One?",
      readTime:"6 min read",
      category:"Google Tag Manager",
      intro:"The data layer is one of the most powerful concepts in modern web analytics — and one of the most frequently misunderstood. Here is a clear explanation of what it is, what it enables, and when you genuinely need one.",
      body:`If you have spent any time configuring Google Tag Manager for anything beyond basic pageview tracking, you will have encountered the data layer. It is referenced in GTM documentation, recommended in analytics guides, and implemented by varying degrees of correctness across most professional web analytics setups. But what it actually is, and why it matters, is often explained poorly.

THE SIMPLE EXPLANATION

The data layer is a JavaScript array that lives on your website and acts as a communication channel between your website and GTM. It is a structured container for information about what is happening on the page — information that GTM can then read and pass to your analytics and marketing tags.

In code, it looks like this: window.dataLayer = window.dataLayer || []; followed by dataLayer.push() calls that add information at specific moments.

The key word is structured. Without a data layer, GTM has to scrape information from the page — reading text from DOM elements, parsing URLs, inferring values from CSS classes. This works, but it is fragile. A developer changes a button label or a page layout, and your tracking breaks silently.

With a data layer, your developers explicitly push the information GTM needs at exactly the right moments, in a consistent structure that GTM can reliably read. The tracking becomes decoupled from the page's visual structure.

WHAT THE DATA LAYER ENABLES

The practical difference becomes clear with a concrete example. Suppose you want to track e-commerce transactions in GA4 — specifically, what products were purchased, at what price, in what quantity. Without a data layer, you would need GTM to somehow extract this information from the order confirmation page's HTML. This is fragile and often impossible if the page does not display all the required fields visually.

With a data layer, your developers push a purchase event at the moment the transaction completes, containing the complete order data in a structured format. GTM reads it reliably every time, regardless of what the page looks like.

The same principle applies to user properties, product impressions, form field values, and any other information that exists in your application logic but may not be visible in the page's HTML.

DO YOU ACTUALLY NEED ONE?

For basic tracking — pageviews, scroll depth, click events on visible elements, form submissions — a data layer is not strictly necessary. GTM's built-in variables and DOM-scraping capabilities are sufficient and the implementation is simpler.

For anything involving transactional data, user account information, product data, or events that happen in JavaScript without a corresponding DOM change, a data layer is not optional — it is the only reliable way to get that information into GTM.

The practical test is this: is the information you need to track visible somewhere on the page in a stable, predictable location? If yes, GTM can probably get it without a data layer. If the information exists in your application's backend or JavaScript logic but is not rendered to the page in a stable way, you need a data layer push.

IMPLEMENTING A DATA LAYER CORRECTLY

The data layer should be initialised — window.dataLayer = window.dataLayer || [] — in the page's head section, before the GTM snippet. This ensures GTM loads into an existing data layer rather than creating a new one.

Data layer pushes should happen at meaningful moments: page load for page-level data, user interactions for event data, and asynchronous operations for data that arrives after the initial page load. Work with your development team to define a data layer specification before implementation begins — retrofitting a data layer onto an existing site is significantly harder than designing it in from the start.`,
    }
  ];

  if (article) {
    const post = posts.find(p=>p.slug===article);
    return (
      <div>
        <div style={{marginBottom:8}}>
          <span style={{fontSize:11,color:ACCENT,fontFamily:"IBM Plex Mono,monospace",letterSpacing:".08em"}}>{post.category}</span>
        </div>
        <h1 style={{fontSize:22,fontWeight:600,color:"#e8e8e0",marginBottom:12,lineHeight:1.4}}>{post.title}</h1>
        <div style={{display:"flex",gap:16,marginBottom:28}}>          <span style={{fontSize:12,color:"#333",fontFamily:"IBM Plex Mono,monospace"}}>{post.readTime}</span>
        </div>
        <p style={{fontSize:15,color:"#888",lineHeight:1.9,marginBottom:24,borderLeft:`2px solid ${ACCENT}`,paddingLeft:16,fontStyle:"italic"}}>{post.intro}</p>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {post.body.split("\n\n").map((para,i)=>(
            para.trim() === para.trim().toUpperCase() && para.length < 80
              ? <h3 key={i} style={{fontSize:13,fontWeight:600,color:ACCENT,letterSpacing:".08em",fontFamily:"IBM Plex Mono,monospace",marginTop:8}}>{para}</h3>
              : <p key={i} style={{fontSize:14,color:"#888",lineHeight:1.9}}>{para}</p>
          ))}
        </div>
        <BottomAdUnit />
        <SiteFooter onNavigate={(p) => { if(p === "blog") { setArticle(null); setTimeout(()=>{ const el=document.querySelector(".main-scroll"); if(el) el.scrollTop=0; window.scrollTo(0,0); },0); } else if(onNavigate) onNavigate(p); }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:ACCENT,fontFamily:"IBM Plex Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Blog</div>
        <h1 style={{fontSize:26,fontWeight:600,color:"#e8e8e0",marginBottom:8}}>Paid media insights</h1>
        <p style={{fontSize:14,color:"#555"}}>Practical guides, strategy deep dives, and adtech explainers for digital marketing professionals.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {posts.map(post=>(
          <div key={post.slug} className="card" style={{cursor:"pointer",transition:"border-color .15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=ACCENT}
            onMouseLeave={e=>e.currentTarget.style.borderColor="#1e1e1e"}
            onClick={()=>{ setArticle(post.slug); setTimeout(()=>{ const el=document.querySelector(".main-scroll"); if(el) el.scrollTop=0; window.scrollTo(0,0); },0); }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1}}>
                <span style={{fontSize:10,color:ACCENT,fontFamily:"IBM Plex Mono,monospace",letterSpacing:".08em",display:"block",marginBottom:6}}>{post.category}</span>
                <h2 style={{fontSize:15,fontWeight:500,color:"#e8e8e0",marginBottom:8,lineHeight:1.4}}>{post.title}</h2>
                <p style={{fontSize:13,color:"#555",lineHeight:1.7}}>{post.intro}</p>
              </div>
            </div>
            <div style={{display:"flex",gap:16,marginTop:12,paddingTop:12,borderTop:"1px solid #1a1a1a",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:12}}>                <span style={{fontSize:11,color:"#333",fontFamily:"IBM Plex Mono,monospace"}}>{post.readTime}</span>
              </div>
              <span style={{fontSize:11,color:ACCENT,fontFamily:"IBM Plex Mono,monospace"}}>Read article →</span>
            </div>
          </div>
        ))}
      </div>
      <BottomAdUnit />
      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}


/* ──────────────────────────────────── PRIVACY POLICY PAGE ── */
function AdStackPrivacyPage({ onBack }) {
  const sections = [
    {
      title: "Overview",
      body: `This Privacy Policy explains how ADSTACK ("we", "us", "our") collects, uses and protects information when you visit adstack.co.uk (the "Site"). By using the Site you agree to the practices described in this policy. If you do not agree, please discontinue use of the Site.

We are committed to ensuring your privacy is protected. This policy is effective from June 2026 and may be updated periodically. We will notify you of significant changes by updating the date at the top of this page.`
    },
    {
      title: "Information We Collect",
      body: `We do not require you to create an account or provide personal information to use ADSTACK. However, the following information may be collected:

Automatically collected data: When you visit the Site, standard web server logs and analytics tools may record your IP address, browser type, operating system, referring URLs, pages visited and time spent on the Site. This data is used in aggregate form to understand how the Site is used and to improve it.

Tool inputs: ADSTACK provides AI-powered paid media tools including ad creative analyzer, keyword generator, UTM builder, campaign naming convention generator, ad copy generator and audience planner. Any text you enter into these tools is sent to the Anthropic API to generate a response and is not stored on our servers. We do not retain, log or analyse the content of your tool inputs.

Email address: If you choose to subscribe to our newsletter, we collect your email address for the sole purpose of sending you that newsletter. We do not share your email address with third parties.`
    },
    {
      title: "How We Use Your Information",
      body: `We use the information collected in the following ways:

To operate and improve the Site and its tools. To understand aggregate usage patterns and optimise the user experience. To send you our newsletter if you have subscribed. To serve relevant advertising through third-party ad networks including Google AdSense.

We do not sell, trade or rent your personal information to third parties. We do not use your tool inputs for any purpose other than generating the requested output via the Anthropic API.`
    },
    {
      title: "Third-Party Services",
      body: `ADSTACK uses the following third-party services which may collect data independently under their own privacy policies:

Anthropic API: Tool inputs are processed by Anthropic's Claude API to generate AI responses. Anthropic's privacy policy applies to this processing. Please review Anthropic's privacy policy at anthropic.com/privacy.

Google AdSense: We display advertisements served by Google AdSense. Google may use cookies and similar technologies to serve ads based on your prior visits to this or other websites. You can opt out of personalised advertising by visiting Google's Ad Settings at adssettings.google.com.

Google Analytics: We may use Google Analytics to understand site usage. Google Analytics collects anonymised usage data. You can opt out using the Google Analytics Opt-out Browser Add-on.

Vercel: The Site is hosted on Vercel's infrastructure. Vercel may collect standard server logs. Please review Vercel's privacy policy at vercel.com/legal/privacy-policy.`
    },
    {
      title: "Cookies",
      body: `The Site uses cookies in the following ways:

Essential cookies: Required for the Site to function correctly. These cannot be disabled.

Analytics cookies: Used to collect anonymised information about how visitors use the Site. You can disable these in your browser settings.

Advertising cookies: Google AdSense may set cookies to serve personalised advertisements. You can manage your ad personalisation preferences at adssettings.google.com.

You can control cookie settings through your browser. Note that disabling certain cookies may affect the functionality of the Site.`
    },
    {
      title: "Data Retention",
      body: `We retain data only for as long as necessary for the purposes described in this policy. Newsletter subscriber email addresses are retained until you unsubscribe. Aggregate analytics data may be retained for up to 26 months. Tool input data is not retained — it is processed in real time and discarded.`
    },
    {
      title: "Your Rights",
      body: `Under UK data protection law (UK GDPR) you have the following rights:

The right to access personal data we hold about you. The right to correct inaccurate personal data. The right to erasure of your personal data. The right to restrict processing of your personal data. The right to data portability. The right to object to processing.

To exercise any of these rights, please contact us at contact.adstack@gmail.com. We will respond to all requests within 30 days.`
    },
    {
      title: "Children's Privacy",
      body: `ADSTACK is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will take steps to delete it promptly.`
    },
    {
      title: "Changes to This Policy",
      body: `We may update this Privacy Policy from time to time. We will post any changes on this page with an updated effective date. We encourage you to review this policy periodically. Your continued use of the Site after any changes constitutes your acceptance of the revised policy.`
    },
    {
      title: "Contact Us",
      body: `If you have any questions about this Privacy Policy or our data practices, please contact us at contact.adstack@gmail.com. We are based in the United Kingdom.`
    },
  ];

  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:11,color:ACCENT,fontFamily:"IBM Plex Mono,monospace",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Privacy Policy</div>
        <h1 style={{fontSize:26,fontWeight:500,color:"#e8e8e0",marginBottom:8,lineHeight:1.3}}>Privacy Policy</h1>
        <p style={{fontSize:13,color:"#555"}}>Effective date: June 2026 · adstack.co.uk</p>
      </div>
      {sections.map((sec, i) => (
        <div key={i} className="card" style={{marginBottom:12,borderColor:"#1e1e1e"}}>
          <div style={{fontSize:13,fontWeight:600,color:ACCENT,fontFamily:"IBM Plex Mono,monospace",letterSpacing:".04em",marginBottom:10,textTransform:"uppercase"}}>{"0" + (i+1).toString().slice(-2)} — {sec.title}</div>
          {sec.body.split("\n\n").map((para, j) => (
            <p key={j} style={{fontSize:14,color:"#888",lineHeight:1.85,marginBottom: j < sec.body.split("\n\n").length-1 ? 10 : 0}}>{para}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────── SITE FOOTER ── */
function SiteFooter({ onNavigate }) {
  const links = [
    { label:"Blog",        icon:"ti-pencil",      page:"blog" },
    { label:"Advertising", icon:"ti-ad-2",         page:"advertising" },
    { label:"Subscribe",   icon:"ti-mail",         page:"subscribe" },
    { label:"About Us",    icon:"ti-info-circle",  page:"about" },
    { label:"Privacy Policy", icon:"ti-shield",       page:"privacy" },
  ];
  return (
    <div style={{ marginTop:40, paddingTop:20, borderTop:"1px solid #1a1a1a" }}>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, marginBottom:16 }}>
        {links.map(l => (
          <button key={l.label} onClick={()=>onNavigate(l.page)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 16px", background:"#141414", border:"1px solid #1e1e1e", borderRadius:4, color:"#555", fontSize:12, fontFamily:"IBM Plex Mono,monospace", cursor:"pointer", transition:"all .15s", letterSpacing:".04em" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.color=ACCENT; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#1e1e1e"; e.currentTarget.style.color="#555"; }}>
            <i className={`ti ${l.icon}`} style={{ fontSize:13 }} />
            {l.label}
          </button>
        ))}
      </div>
      <div style={{ textAlign:"center", fontFamily:"IBM Plex Mono,monospace", fontSize:10, color:"#2a2a2a", paddingBottom:20, letterSpacing:".06em" }}>
        © {new Date().getFullYear()} ADSTACK · adstack.co.uk
      </div>
    </div>
  );
}


/* ──────────────────────────────────── SIDEBAR CONTENTS ── */
function SidebarContents({ activeTool, setActiveTool, savedCount, onClose }) {
  return (
    <>
      {/* Logo block — only shown in mobile drawer, hidden on desktop sidebar */}
      {onClose && (
        <div style={{ padding:"16px 16px 10px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:26,height:26,background:ACCENT,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <svg width="14" height="12" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="0.5" width="14" height="3" rx="1" fill="#0d0d0d"/>
                <rect x="1" y="5.5" width="10" height="3" rx="1" fill="#0d0d0d"/>
                <rect x="1" y="10.5" width="6" height="3" rx="1" fill="#0d0d0d"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:"IBM Plex Mono",fontSize:13,fontWeight:500,color:"#e8e8e0",letterSpacing:".04em" }}>ADSTACK</div>
              <div style={{ fontSize:9,color:"#444",letterSpacing:".08em" }}>PAID MEDIA TOOLKIT</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:18,padding:"4px",lineHeight:1 }}>×</button>
        </div>
      )}
      <div style={{ padding:"10px 16px 8px",fontSize:10,letterSpacing:".1em",color:"#333",textTransform:"uppercase" }}>Tools</div>
      {TOOLS.map(tool=>(
        <button key={tool.id} className="sidebar-tool-btn"
          onClick={()=>{ setActiveTool(tool.id); onClose&&onClose(); }}
          style={{ borderLeft:`2px solid ${activeTool===tool.id?ACCENT:"transparent"}`, background:activeTool===tool.id?"#141414":"transparent" }}>
          <i className={`ti ${tool.icon}`} style={{ fontSize:15, color:activeTool===tool.id?ACCENT:"#444", flexShrink:0 }} />
          <div>
            <div style={{ fontSize:12,color:activeTool===tool.id?"#e8e8e0":"#666",fontWeight:activeTool===tool.id?500:400 }}>
              {tool.label}
              {tool.id==="workspace"&&savedCount>0&&(
                <span style={{ marginLeft:6,fontSize:9,fontFamily:"IBM Plex Mono",color:ACCENT,background:"#1a1200",padding:"1px 5px",borderRadius:2 }}>{savedCount}</span>
              )}
            </div>
            <div style={{ fontSize:10,color:"#2a2a2a",marginTop:1 }}>{tool.desc}</div>
          </div>
        </button>
      ))}
      <div style={{ margin:"16px 16px 0",paddingTop:14,borderTop:"1px solid #1a1a1a" }}>
        <div style={{ fontSize:10,letterSpacing:".08em",color:"#2a2a2a",marginBottom:6,textTransform:"uppercase" }}>Powered by</div>
        <div style={{ fontFamily:"IBM Plex Mono",fontSize:11,color:"#333" }}>Claude Sonnet 4</div>
      </div>
      <AdUnit />
    </>
  );
}

/* ──────────────────────────────────── MAIN APP ── */
export default function App() {
  const [activeTool, setActiveTool]  = useState("analyzer");
  const [savedConventions, setSaved] = useState([]);
  const [drawerOpen, setDrawerOpen]  = useState(false);
  const [page, setPage]              = useState(null); // null = tools view
  const isMobile                     = useIsMobile();

  const handleSave   = conv => setSaved(p=>[...p,conv]);
  const handleDelete = idx  => setSaved(p=>p.filter((_,i)=>i!==idx));
  const handleNav    = p   => { setPage(p); setDrawerOpen(false); };
  const handleBack   = ()  => setPage(null);

  // ── Dynamic meta tags & URLs ──
  const toolMeta = TOOL_META[activeTool] || {};
  const pageMeta = page ? PAGE_META[page] : null;
  const currentMeta = pageMeta || (page ? SITE_DEFAULT : toolMeta);
  useDocumentMeta(currentMeta.title || SITE_DEFAULT.title, currentMeta.desc || SITE_DEFAULT.desc);
  usePushState(pageMeta ? pageMeta.path : (toolMeta.path || "/"));

  // Scroll to top whenever page or tool changes
  useEffect(() => {
    const el = document.querySelector('.main-scroll');
    if (el) el.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [page, activeTool]);

  const activeMeta = TOOLS.find(t=>t.id===activeTool);

  const toolComponents = {
    analyzer:  <CreativeAnalyzer />,
    abtest:    <ABHeadlineScorer />,
    keywords:  <KeywordGenerator />,
    naming:    <CampaignNaming onSave={handleSave} />,
    workspace: <ClientWorkspace conventions={savedConventions} onDelete={handleDelete} />,
    utm:       <UTMBuilder />,
    bulkutm:   <BulkUTMBuilder />,
    adcopy:    <AdCopyGenerator />,
    audience:  <AudiencePlanner />,
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", flexDirection:"column" }}>

        {/* ── Desktop header ── */}
        {!isMobile && (
          <div style={{ borderBottom:"1px solid #1a1a1a",padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0a0a0a",flexShrink:0 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12,cursor:"pointer" }} onClick={handleBack}>
              <div style={{ width:28,height:28,background:ACCENT,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="0.5" width="14" height="3" rx="1" fill="#0d0d0d"/>
                  <rect x="1" y="5.5" width="10" height="3" rx="1" fill="#0d0d0d"/>
                  <rect x="1" y="10.5" width="6" height="3" rx="1" fill="#0d0d0d"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily:"IBM Plex Mono",fontSize:15,fontWeight:500,color:"#e8e8e0",letterSpacing:".04em" }}>ADSTACK</div>
                <div style={{ fontSize:10,color:"#555",letterSpacing:".08em" }}>PAID MEDIA TOOLKIT</div>
              </div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:16 }}>
              {!page && activeTool==="workspace"&&savedConventions.length>0&&(
                <span style={{ fontFamily:"IBM Plex Mono",fontSize:11,color:ACCENT }}>{savedConventions.length} saved</span>
              )}
              <div style={{ fontFamily:"IBM Plex Mono",fontSize:11,color:"#333",letterSpacing:".06em" }}>
                {page ? page.toUpperCase() : activeMeta?.label.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile header ── */}
        {isMobile && (
          <div className="mobile-header" style={{ borderBottom:"1px solid #1a1a1a",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0a0a0a",flexShrink:0 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }} onClick={handleBack}>
              <div style={{ width:26,height:26,background:ACCENT,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <svg width="14" height="12" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="0.5" width="14" height="3" rx="1" fill="#0d0d0d"/>
                  <rect x="1" y="5.5" width="10" height="3" rx="1" fill="#0d0d0d"/>
                  <rect x="1" y="10.5" width="6" height="3" rx="1" fill="#0d0d0d"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily:"IBM Plex Mono",fontSize:13,fontWeight:500,color:"#e8e8e0",letterSpacing:".04em" }}>ADSTACK</div>
              </div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <span style={{ fontSize:12,color:"#555" }}>{page || activeMeta?.label}</span>
              <button onClick={()=>setDrawerOpen(true)} style={{ background:"none",border:"1px solid #2a2a2a",borderRadius:4,color:"#888",cursor:"pointer",padding:"6px 10px",display:"flex",alignItems:"center",gap:6,fontSize:12 }}>
                <i className="ti ti-menu-2" style={{ fontSize:14 }} /> Tools
              </button>
            </div>
          </div>
        )}

        {/* ── Mobile drawer ── */}
        {drawerOpen && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-overlay" onClick={()=>setDrawerOpen(false)} />
            <div className="mobile-drawer-panel">
              <SidebarContents
                activeTool={activeTool}
                setActiveTool={t=>{setActiveTool(t);setPage(null);}}
                savedCount={savedConventions.length}
                onClose={()=>setDrawerOpen(false)}
              />
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          {/* Desktop sidebar */}
          {!isMobile && (
            <div className="sidebar">
              <SidebarContents
                activeTool={activeTool}
                setActiveTool={t=>{setActiveTool(t);setPage(null);}}
                savedCount={savedConventions.length}
                onClose={null}
              />
            </div>
          )}

          {/* Main content */}
          <div className="main-scroll">
            <div className="main-inner">
              {page ? (
                <>
                  <InlineAdUnit />
                  <div style={{ marginTop:24 }}>
                    {page==="blog"        && <AdStackBlogPage key={page} onBack={handleBack} onNavigate={handleNav} />}
                    {page==="advertising" && <AdStackAdvertisingPage onBack={handleBack} />}
                    {page==="subscribe"   && <AdStackSubscribePage onBack={handleBack} />}
                    {page==="about"       && <AdStackAboutPage onBack={handleBack} />}
                    {page==="privacy"     && <AdStackPrivacyPage onBack={handleBack} />}
                  </div>
                  {page !== "blog" && <BottomAdUnit />}
                  {page !== "blog" && <SiteFooter onNavigate={handleNav} />}
                  {isMobile && <div style={{ height:32 }} />}
                </>
              ) : (
                <>
                  <div style={{ marginBottom:22 }}>
                    <h1 className="tool-title" style={{ fontSize:18,fontWeight:500,color:"#e8e8e0",marginBottom:4 }}>{activeMeta?.label}</h1>
                    <p style={{ fontSize:13,color:"#555" }}>{activeMeta?.desc}</p>
                  </div>
                  <InlineAdUnit />
                  <div style={{ marginTop:24 }}>
                  {toolComponents[activeTool]}
                  </div>
                  <BottomAdUnit />
                  <SiteFooter onNavigate={handleNav} />
                  {/* Mobile bottom padding so content clears thumb zone */}
                  {isMobile && <div style={{ height:32 }} />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}