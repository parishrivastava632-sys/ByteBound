import React, { useState } from "react";
import { Share2, Copy, Check, Twitter, Linkedin } from "lucide-react";
import { copyToClipboard } from "../utils/clipboard";

export default function SocialThreadsTab({ socialPackage, title }) {
  const [copiedTweetIdx, setCopiedTweetIdx] = useState(null);
  const [copiedAllX, setCopiedAllX] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);

  if (!socialPackage) {
    return (
      <div className="p-8 text-center text-slate-400">
        No social assets generated yet.
      </div>
    );
  }

  const rawX = socialPackage.xThread;
  const xThread = Array.isArray(rawX) ? rawX : (typeof rawX === "string" ? [rawX] : []);
  const linkedInPost = typeof socialPackage.linkedInPost === "string" ? socialPackage.linkedInPost : "";

  const handleCopyTweet = async (tweet, idx) => {
    const success = await copyToClipboard(tweet);
    if (success) {
      setCopiedTweetIdx(idx);
      setTimeout(() => setCopiedTweetIdx(null), 2000);
    }
  };

  const handleCopyAllX = async () => {
    const success = await copyToClipboard(xThread.join("\n\n---\n\n"));
    if (success) {
      setCopiedAllX(true);
      setTimeout(() => setCopiedAllX(false), 2000);
    }
  };

  const handleCopyLinkedIn = async () => {
    const success = await copyToClipboard(linkedInPost);
    if (success) {
      setCopiedLinkedIn(true);
      setTimeout(() => setCopiedLinkedIn(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: X (Twitter) Viral Thread (6 cols) */}
      <div className="lg:col-span-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-studio-900 border border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Twitter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">X (Twitter) Viral Thread</h3>
              <p className="text-[11px] text-slate-400">{xThread.length} Connected Tweets</p>
            </div>
          </div>

          <button
            onClick={handleCopyAllX}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-studio-800 hover:bg-studio-700 text-slate-200 hover:text-white transition-all border border-white/5"
          >
            {copiedAllX ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Thread!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Thread</span>
              </>
            )}
          </button>
        </div>

        {/* Thread items */}
        <div className="space-y-3 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
          {xThread.map((tweet, idx) => {
            const charCount = tweet.length;
            const isOverLimit = charCount > 280;

            return (
              <div
                key={idx}
                className="group relative ml-8 glass-panel rounded-xl p-4 border border-white/10 hover:border-sky-500/40 transition-all shadow-sm"
              >
                {/* Connecting avatar node */}
                <div className="absolute -left-8 top-3.5 w-6 h-6 rounded-full bg-studio-900 border border-sky-500/50 flex items-center justify-center text-[10px] font-bold text-sky-400">
                  {idx + 1}
                </div>

                {/* Tweet Body */}
                <p className="text-xs sm:text-sm text-slate-100 whitespace-pre-line leading-relaxed font-sans">
                  {tweet}
                </p>

                {/* Footer bar */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-mono ${
                      isOverLimit ? "text-red-400 font-bold" : "text-slate-400"
                    }`}
                  >
                    {charCount} / 280 chars
                  </span>

                  <button
                    onClick={() => handleCopyTweet(tweet, idx)}
                    className="flex items-center space-x-1 text-slate-400 hover:text-white bg-studio-800 px-2 py-1 rounded transition-colors"
                  >
                    {copiedTweetIdx === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: LinkedIn Thought-Leadership Post (6 cols) */}
      <div className="lg:col-span-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-studio-900 border border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
              <Linkedin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">LinkedIn Executive Post</h3>
              <p className="text-[11px] text-slate-400">Thought-leadership formatting</p>
            </div>
          </div>

          <button
            onClick={handleCopyLinkedIn}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-purple hover:bg-brand-violet text-white transition-all shadow-sm"
          >
            {copiedLinkedIn ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied Post!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Post</span>
              </>
            )}
          </button>
        </div>

        {/* Mock LinkedIn Feed Card */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
          {/* Author Mockup */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center font-bold text-white text-sm shadow-sm">
              OM
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center space-x-1">
                <span>OmniMedia Studio Executive</span>
                <span className="text-slate-400 font-normal">• 1st</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Autonomous Media Lead | AI Systems
              </div>
              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                <span>Just now</span>
                <span>•</span>
                <span>🌐</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4 rounded-xl bg-studio-900/90 border border-white/5 text-slate-100 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-sans max-h-[500px] overflow-y-auto">
            {linkedInPost}
          </div>

          {/* Social Reactions Mock */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-1">
              <span className="flex -space-x-1">
                <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">👍</span>
                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white">💡</span>
                <span className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-[8px] text-white">❤️</span>
              </span>
              <span className="text-[11px] ml-1 text-slate-400">1,482 reactions</span>
            </div>
            <span className="text-[11px] text-slate-400">89 comments • 42 reposts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
