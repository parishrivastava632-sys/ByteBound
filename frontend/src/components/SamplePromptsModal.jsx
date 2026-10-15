import React from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";

export default function SamplePromptsModal({ isOpen, onClose, onSelectSample }) {
  if (!isOpen) return null;

  const samples = [
    {
      title: "🎙️ Tech Podcast: Autonomous AI Multi-Agent Architectures",
      category: "Podcast Excerpt",
      audience: "Software Engineers, Tech Leads, AI Researchers",
      platform: "Omnichannel",
      text: `Host: Welcome back to the Distributed Intelligence podcast. Today we're breaking down why sequential prompting is completely hitting a wall in production media pipelines.
Guest: Exactly. When you look at high-volume content operations, asking an LLM to generate a single script in one pass leads to generic hallucinations. The breakthrough comes when you decompose media creation into deterministic stages: first, extracting the semantic core thesis and emotional hook; second, calculating frame-by-frame B-roll visual cues with strict duration budgets; and third, generating platform-native social threads that match character limits and algorithmic engagement hooks.
Host: And this has to happen in seconds, not days. If you can take a 60-minute raw studio transcript and turn it into 5 high-retention vertical video storyboards, an executive X thread, and SEO taxonomy simultaneously, content teams 10x their organic reach without expanding headcount.`,
    },
    {
      title: "🚀 Keynote: The Shift from Content Creators to Media Engineers",
      category: "Keynote Address",
      audience: "Digital Creators, Founders, Media Executives",
      platform: "Shorts & Reels",
      text: `Let me tell you about the creative bottleneck killing modern brands. Every company knows they need to publish 20 vertical videos a week on TikTok, Reels, and Shorts. But the actual friction isn't recording—it's the grueling 15 hours spent scrubbing waveforms, identifying viral clips, writing captions, and converting audio into readable on-screen typography.
With Gemini 2.5 Flash deployed on Google Cloud Run, we are witnessing the birth of autonomous pre-production. You feed in the raw footage transcript, and in under 3 seconds, the engine outputs exact timecodes, audio pacing, visual cues, and virality scores. You don't guess what will perform; the system engineers the retention curve before you even open your video editor.`,
    },
    {
      title: "📈 Growth Masterclass: The 1-to-10 Omnichannel Content Multiplier",
      category: "Marketing Strategy",
      audience: "Growth Marketers, CMOs, Startup Founders",
      platform: "X Thread",
      text: `Here is the mathematical reality of content distribution in 2026: 95% of your audience will never read your 3,000-word blog post or watch your 45-minute YouTube video. They live on mobile feeds scrolling at 200 words per minute.
To win, you must implement an omnichannel fanout architecture. Take your single foundational asset, extract the 3 sharpest contrarian claims, and fan them out into:
1. A 45-second high-energy short with kinetic typography.
2. A 5-part tactical breakdown thread on X.
3. An executive-level reflection on LinkedIn for B2B buyers.
4. Comprehensive search taxonomy so your archive continues to rank organically.
When you automate this pipeline, your distribution velocity compounds exponentially.`,
    },
    {
      title: "💡 AI Product Launch: Autonomous Pre-Production Engine",
      category: "Product Launch",
      audience: "Product Designers, Developers, Creative Agencies",
      platform: "LinkedIn",
      text: `Today we are officially unveiling OmniMedia AI Studio—an autonomous pre-production microservice designed specifically for the AI Builder Cup 2026.
Powered by Google GenAI's Gemini 2.5 Flash with strict JSON schema enforcement and Cloud Firestore real-time state synchronization, OmniMedia eliminates the manual friction between raw ideation and multi-channel publication.
Simply drop in meeting recordings, video transcripts, or technical articles, and OmniMedia synthesizes synchronized video storyboards, platform-tailored social threads, and algorithmic virality metrics in a single pass. Welcome to the future of digital media production.`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow ambient background */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-brand-cyan/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-purple">
            <Sparkles className="w-4 h-4" />
            <span>AI Builder Cup 2026 Evaluation Scenarios</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Sample Pre-Production Transcripts
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select any scenario below to automatically load the transcript and configuration into the Studio.
          </p>
        </div>

        {/* Sample List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {samples.map((s, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectSample(s);
                onClose();
              }}
              className="group p-4 rounded-xl bg-studio-900/80 hover:bg-studio-900 border border-white/10 hover:border-brand-purple/40 cursor-pointer transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                    {s.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5 group-hover:text-brand-cyan transition-colors">
                    {s.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-1 text-xs text-brand-cyan font-semibold shrink-0 group-hover:translate-x-1 transition-transform">
                  <span>Load</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 italic leading-relaxed">
                &ldquo;{s.text}&rdquo;
              </p>

              <div className="flex items-center space-x-4 mt-3 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                <span>Audience: <strong className="text-slate-200">{s.audience}</strong></span>
                <span>Platform: <strong className="text-brand-cyan">{s.platform}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
