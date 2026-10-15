import React, { useState } from "react";
import {
  Film,
  Share2,
  TrendingUp,
  Code2,
  Copy,
  Download,
  Check,
  Sparkles,
  ArrowRight,
  FileCheck,
} from "lucide-react";
import { copyToClipboard } from "../utils/clipboard";
import VideoStoryboardTab from "./VideoStoryboardTab";
import SocialThreadsTab from "./SocialThreadsTab";
import SeoMetadataTab from "./SeoMetadataTab";

export default function OutputWorkspace({
  generatedData,
  onOpenSamples,
  isLoading,
}) {
  const [activeTab, setActiveTab] = useState("storyboard");
  const [copiedAll, setCopiedAll] = useState(false);

  // If loading, show nice skeleton / generation state
  if (isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px] border border-white/10 text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-purple via-brand-violet to-brand-cyan flex items-center justify-center animate-spin-slow shadow-glow mb-6">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Gemini 2.5 Flash Generating Media Engine Package
        </h3>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
          Deconstructing transcripts into narrative arcs, timecoded video beats, viral social hooks, and SEO taxonomy...
        </p>
        <div className="w-full max-w-sm bg-studio-900 rounded-full h-2 border border-white/5 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-blue h-full w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // If no output yet, show empty welcome state
  if (!generatedData) {
    return (
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px] border border-white/10 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-studio-900 border border-white/10 flex items-center justify-center text-brand-purple mb-4 shadow-inner">
          <Film className="w-8 h-8 opacity-80" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          Autonomous Pre-Production Workspace
        </h3>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
          Paste a raw podcast transcript, keynote, or article on the left, or choose a ready-made sample to synthesize a complete omnichannel media package.
        </p>

        <button
          onClick={onOpenSamples}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-violet hover:from-brand-violet hover:to-brand-blue text-white text-xs font-semibold shadow-glow hover:shadow-glow-cyan transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore Ready-to-Test Transcripts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="grid grid-cols-3 gap-3 mt-10 max-w-lg w-full text-left">
          <div className="p-3 rounded-xl bg-studio-900/60 border border-white/5">
            <span className="text-[10px] font-bold text-brand-cyan uppercase">Phase 1</span>
            <p className="text-xs font-semibold text-slate-200 mt-1">9:16 Video Storyboard</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Timecodes & scripts</p>
          </div>
          <div className="p-3 rounded-xl bg-studio-900/60 border border-white/5">
            <span className="text-[10px] font-bold text-brand-purple uppercase">Phase 2</span>
            <p className="text-xs font-semibold text-slate-200 mt-1">Viral Social Threads</p>
            <p className="text-[11px] text-slate-400 mt-0.5">X & LinkedIn copy</p>
          </div>
          <div className="p-3 rounded-xl bg-studio-900/60 border border-white/5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Phase 3</span>
            <p className="text-xs font-semibold text-slate-200 mt-1">SEO & Virality Score</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Taxonomy & discovery</p>
          </div>
        </div>
      </div>
    );
  }

  const { productionSummary, shortFormVideo, socialPackage, seoAndTaxonomy } = generatedData;

  const handleCopyFullJSON = async () => {
    const success = await copyToClipboard(JSON.stringify(generatedData, null, 2));
    if (success) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedData, null, 2));
    const cleanTitle = (productionSummary?.title || "package")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 50);

    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `omnimedia_${cleanTitle || "package"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const tabs = [
    {
      id: "storyboard",
      label: "Video Storyboard",
      icon: Film,
      count: shortFormVideo?.scenes?.length || 0,
    },
    {
      id: "social",
      label: "Social Threads",
      icon: Share2,
      count: (socialPackage?.xThread?.length || 0) + 1,
    },
    {
      id: "seo",
      label: "SEO & Virality",
      icon: TrendingUp,
      badge: `${productionSummary?.predictedViralityScore || 88}/100`,
    },
    {
      id: "json",
      label: "Raw JSON",
      icon: Code2,
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col h-full shadow-2xl space-y-5">
      {/* Top Banner: Project Title, Virality, and Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <FileCheck className="w-3 h-3" />
              <span>Production Ready</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Score: {productionSummary?.predictedViralityScore || 88}/100
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {productionSummary?.title || "OmniMedia AI Media Package"}
          </h2>
          <p className="text-xs text-slate-300 line-clamp-2">
            {productionSummary?.coreThesis}
          </p>
        </div>

        {/* Global Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyFullJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-studio-900 hover:bg-studio-800 text-slate-200 hover:text-white border border-white/10 transition-all shadow-sm"
            title="Copy full JSON payload to clipboard"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-purple hover:bg-brand-violet text-white transition-all shadow-glow"
            title="Download package as JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-brand-purple text-white shadow-glow"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-studio-900 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? "bg-brand-cyan text-studio-950" : "bg-brand-cyan/20 text-brand-cyan"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panes */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === "storyboard" && (
          <VideoStoryboardTab
            shortFormVideo={shortFormVideo}
            title={productionSummary?.title}
          />
        )}

        {activeTab === "social" && (
          <SocialThreadsTab
            socialPackage={socialPackage}
            title={productionSummary?.title}
          />
        )}

        {activeTab === "seo" && (
          <SeoMetadataTab
            seoAndTaxonomy={seoAndTaxonomy}
            productionSummary={productionSummary}
          />
        )}

        {activeTab === "json" && (
          <div className="relative rounded-xl bg-studio-900 border border-white/10 p-4">
            <button
              onClick={handleCopyFullJSON}
              className="absolute top-3 right-3 text-xs flex items-center space-x-1 px-2.5 py-1 rounded bg-studio-800 text-slate-300 hover:text-white"
            >
              {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto p-2 leading-relaxed">
              {JSON.stringify(generatedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
