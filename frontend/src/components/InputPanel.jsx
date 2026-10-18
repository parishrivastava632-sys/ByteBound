import React from "react";
import { Sparkles, Wand2, RefreshCw, Target, Share2, Layers, CheckCircle2 } from "lucide-react";

export default function InputPanel({
  content,
  setContent,
  targetAudience,
  setTargetAudience,
  platformFocus,
  setPlatformFocus,
  onGenerate,
  isLoading,
  loadingStep,
  onSelectSample,
}) {
  const safeContent = content || "";
  const wordCount = safeContent.trim() ? safeContent.trim().split(/\s+/).length : 0;
  const charCount = safeContent.length;

  const quickSamples = [
    {
      title: "🎙️ AI Podcast Excerpt",
      audience: "Software Engineers, Tech Leads, AI Researchers",
      platform: "Omnichannel",
      text: "The transition from prompt engineering to autonomous agents represents a fundamental architecture evolution. Instead of humans chaining together brittle sequential queries, an agent orchestrates tools, reasons over multimodal inputs, and self-corrects execution traces. In the next 24 months, media production will undergo the same shift: raw audio transcripts will automatically compile into camera-ready short-form video storyboards, cross-platform social threads, and search-indexed taxonomy without a single human timeline cut.",
    },
    {
      title: "🚀 Startup Pitch",
      audience: "Founders, Tech Creators, Investors",
      platform: "Shorts & Reels",
      text: "Every high-growth company is now a media company, but 90% of content dies after the initial live stream or podcast recording. Creative teams spend 30 hours per week manually clipping videos, rewriting posts for LinkedIn, and writing tweets. OmniMedia AI Studio solves this with an end-to-end autonomous pre-production pipeline running on Google Cloud Run and Gemini 2.5 Flash, reducing 30 hours of tedious manual repurposing into a 3-second synthesis.",
    },
    {
      title: "🧠 Tech Keynote",
      audience: "Developers, Cloud Architects, CTOs",
      platform: "X Thread",
      text: "Foundation models are no longer just text predictors; they are multi-tiered reasoning engines. By combining multimodal understanding with strict structured JSON output schemas, developers can build deterministic digital media workflows that guarantee frame-by-frame storyboard timings, viral hook retention curves, and high-CTR social copy in one unified generation pass.",
    },
  ];

  const platforms = [
    { id: "Omnichannel", label: "Omnichannel (All)", icon: Layers },
    { id: "Shorts & Reels", label: "9:16 Shorts/TikTok", icon: Target },
    { id: "Instagram", label: "Instagram Reels", icon: Target },
    { id: "Facebook", label: "Facebook Post", icon: Share2 },
    { id: "YouTube", label: "YouTube Video", icon: Wand2 },
    { id: "X Thread", label: "X (Twitter) Thread", icon: Share2 },
    { id: "LinkedIn", label: "LinkedIn Article", icon: Wand2 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-full shadow-2xl relative overflow-hidden border border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
            <span>Raw Input & Transcript</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste long-form transcripts, audio transcripts, or articles
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-400 bg-studio-900 px-2 py-0.5 rounded-md border border-white/5">
            {wordCount} words / {charCount} chars
          </span>
        </div>
      </div>

      {/* Quick Load Sample Buttons */}
      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
          Quick-Start Templates:
        </label>
        <div className="flex flex-wrap gap-2">
          {quickSamples.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setContent(s.text);
                if (onSelectSample) onSelectSample(s);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-studio-900/90 hover:bg-brand-purple/20 border border-white/10 hover:border-brand-purple/40 text-slate-300 hover:text-white transition-all text-left"
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative flex-1 min-h-[220px] mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your video transcript, interview notes, or blog draft here... (e.g. 'Welcome back to episode 42 of the podcast where we discuss autonomous AI pipelines...')"
          className="w-full h-full p-4 rounded-xl bg-studio-900/80 border border-white/10 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-slate-100 placeholder:text-slate-500 text-sm leading-relaxed resize-none transition-all outline-none font-mono"
        />
        {content && (
          <button
            onClick={() => setContent("")}
            className="absolute top-3 right-3 text-[11px] text-slate-400 hover:text-white bg-studio-800/80 hover:bg-studio-700 px-2 py-1 rounded-md transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Target Audience */}
        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1">
            <Target className="w-3 h-3 text-brand-cyan" />
            <span>Target Audience</span>
          </label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g. Founders, Tech Creators, Devs"
            className="w-full px-3 py-2 text-xs rounded-xl bg-studio-900/80 border border-white/10 focus:border-brand-purple text-slate-100 placeholder:text-slate-500 outline-none transition-all"
          />
        </div>

        {/* Platform Focus */}
        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1">
            <Layers className="w-3 h-3 text-brand-purple" />
            <span>Platform Target</span>
          </label>
          <select
            value={platformFocus}
            onChange={(e) => setPlatformFocus(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-studio-900/80 border border-white/10 focus:border-brand-purple text-slate-100 outline-none transition-all cursor-pointer"
          >
            {platforms.map((p) => (
              <option key={p.id} value={p.id} className="bg-studio-900 text-white">
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* High-Visibility Action CTA */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !safeContent.trim()}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center space-x-2.5 transition-all shadow-xl ${
          isLoading || !safeContent.trim()
            ? "bg-studio-800 text-slate-500 cursor-not-allowed border border-white/5"
            : "bg-gradient-to-r from-brand-purple via-brand-violet to-brand-blue hover:from-brand-violet hover:to-brand-cyan text-white shadow-glow hover:shadow-glow-cyan hover:scale-[1.01] active:scale-[0.99] border border-white/20"
        }`}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-brand-cyan" />
            <span className="bg-gradient-to-r from-white to-brand-cyan bg-clip-text text-transparent">
              {loadingStep || "Synthesizing OmniMedia Package..."}
            </span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-brand-cyan animate-bounce" />
            <span>Generate Omni-Media Assets</span>
          </>
        )}
      </button>

      {/* Engine Status Line */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Strict JSON Schema Enforced</span>
        </span>
        <span className="text-slate-400 font-mono">Gemini 2.5 Flash</span>
      </div>
    </div>
  );
}
