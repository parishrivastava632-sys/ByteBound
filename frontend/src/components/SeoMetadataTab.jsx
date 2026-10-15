import React, { useState } from "react";
import { Hash, Key, TrendingUp, Users, Target, Check, Copy } from "lucide-react";
import { copyToClipboard } from "../utils/clipboard";

export default function SeoMetadataTab({ seoAndTaxonomy, productionSummary }) {
  const [copiedItem, setCopiedItem] = useState(null);

  if (!seoAndTaxonomy) {
    return (
      <div className="p-8 text-center text-slate-400">
        No SEO metadata generated yet.
      </div>
    );
  }

  const rawKeywords = seoAndTaxonomy.primaryKeywords;
  const primaryKeywords = Array.isArray(rawKeywords) ? rawKeywords : [];
  const rawHashtags = seoAndTaxonomy.hashtags;
  const hashtags = Array.isArray(rawHashtags) ? rawHashtags : [];
  const viralityScore = Number(productionSummary?.predictedViralityScore) || 85;

  const handleCopy = async (text, key) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItem(key);
      setTimeout(() => setCopiedItem(null), 1800);
    }
  };

  const handleCopyAllHashtags = async () => {
    const success = await copyToClipboard(hashtags.join(" "));
    if (success) {
      setCopiedItem("all-hashtags");
      setTimeout(() => setCopiedItem(null), 1800);
    }
  };

  // Color determination based on virality score
  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-400 stroke-emerald-400";
    if (score >= 75) return "text-brand-cyan stroke-brand-cyan";
    if (score >= 60) return "text-amber-400 stroke-amber-400";
    return "text-red-400 stroke-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Top Grid: Virality Gauge + Core Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Virality Score Gauge (5 cols) */}
        <div className="md:col-span-5 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-cyan/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
            <TrendingUp className="w-4 h-4 text-brand-cyan" />
            <span>Predicted Virality Index</span>
          </div>

          {/* Radial Gauge SVG */}
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-studio-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`${getScoreColor(viralityScore)} transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - viralityScore / 100)}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-4xl font-extrabold tracking-tight ${getScoreColor(viralityScore)}`}>
                {viralityScore}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">out of 100</span>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-300 max-w-xs leading-relaxed">
            {viralityScore >= 85 ? (
              <span className="text-emerald-400 font-medium">
                🔥 High algorithmic velocity potential. Strong narrative hook and high engagement pacing.
              </span>
            ) : (
              <span className="text-slate-300 font-medium">
                ⚡ Good baseline reach. Optimized for core community and long-tail organic search.
              </span>
            )}
          </div>
        </div>

        {/* Audience & Strategic Thesis (7 cols) */}
        <div className="md:col-span-7 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-brand-purple" />
              <span>Target Audience Demographic</span>
            </div>
            <div className="p-3 rounded-xl bg-studio-900 border border-white/5 text-sm text-slate-100 font-medium">
              {productionSummary?.targetAudience || "Tech Leaders, Creators, and Digital Strategists"}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Core Content Thesis</span>
            </div>
            <div className="p-3 rounded-xl bg-studio-900 border border-white/5 text-xs text-slate-300 leading-relaxed italic">
              &ldquo;{productionSummary?.coreThesis || 'Autonomous media engine transforms raw input into structured omnichannel packages.'}&rdquo;
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
            <div className="p-2.5 rounded-lg bg-studio-900/60 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Distribution Matrix</span>
              <span className="text-xs font-bold text-white mt-0.5 block">Shorts • X • LinkedIn</span>
            </div>
            <div className="p-2.5 rounded-lg bg-studio-900/60 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Inference Engine</span>
              <span className="text-xs font-bold text-brand-cyan mt-0.5 block">Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Keywords Card */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Primary SEO & Discovery Keywords
              </h4>
              <p className="text-[11px] text-slate-400">
                High-intent search terms for algorithmic tagging and metadata indexing
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 bg-studio-900 px-2 py-1 rounded border border-white/5">
            {primaryKeywords.length} Keywords
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {primaryKeywords.map((kw, idx) => (
            <button
              key={idx}
              onClick={() => handleCopy(kw, `kw-${idx}`)}
              className="group flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-studio-900 hover:bg-studio-800 border border-white/10 hover:border-emerald-400/40 text-slate-200 hover:text-white text-xs font-medium transition-all"
            >
              <span>{kw}</span>
              {copiedItem === `kw-${idx}` ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Viral Hashtags Card */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Platform Hashtag Taxonomy
              </h4>
              <p className="text-[11px] text-slate-400">
                Click any tag to copy, or copy all at once for quick social publishing
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyAllHashtags}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-studio-900 hover:bg-studio-800 text-slate-200 hover:text-white transition-all border border-white/10"
          >
            {copiedItem === "all-hashtags" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied All Tags!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Hashtags</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {hashtags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handleCopy(tag, `tag-${idx}`)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-purple/20 to-pink-500/20 hover:from-brand-purple/30 hover:to-pink-500/30 border border-brand-purple/30 text-brand-purple hover:text-pink-300 text-xs font-bold font-mono transition-all hover:scale-105"
            >
              <span>{tag.startsWith("#") ? tag : `#${tag}`}</span>
              {copiedItem === `tag-${idx}` && (
                <Check className="w-3 h-3 text-emerald-400 ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
