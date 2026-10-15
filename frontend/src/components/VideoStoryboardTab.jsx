import React, { useState, useEffect } from "react";
import { Clock, Film, Eye, Volume2, VolumeX, Copy, Check, Smartphone } from "lucide-react";
import { copyToClipboard } from "../utils/clipboard";

export default function VideoStoryboardTab({ shortFormVideo, title }) {
  const [playingIndex, setPlayingIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Clean up any playing SpeechSynthesis when unmounting or switching tabs
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const scenes = Array.isArray(shortFormVideo?.scenes) ? shortFormVideo.scenes : [];
  const estimatedDurationSeconds = shortFormVideo?.estimatedDurationSeconds || 45;

  if (scenes.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        No storyboard scenes generated yet.
      </div>
    );
  }

  // Live text-to-speech simulation using native browser SpeechSynthesis
  const handlePlayVoiceover = (text, idx) => {
    if ("speechSynthesis" in window) {
      if (playingIndex === idx) {
        window.speechSynthesis.cancel();
        setPlayingIndex(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text || "");
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingIndex(null);
      utterance.onerror = () => setPlayingIndex(null);
      setPlayingIndex(idx);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported in this browser.");
    }
  };

  const handleCopyScene = async (scene, idx) => {
    const text = `Timecode: ${scene.timecode || ""}\nAudio: ${scene.audioScript || ""}\nVisual: ${scene.visualCue || ""}\nOn-Screen Text: ${scene.onScreenText || ""}`;
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Storyboard Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-studio-900/90 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-brand-purple/20 text-brand-purple">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              9:16 Short-Form Storyboard & Audio Script
            </h3>
            <p className="text-xs text-slate-400">
              Pacing engineered for TikTok, YouTube Shorts, & Instagram Reels
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-studio-800 text-slate-200 border border-white/5">
            <Clock className="w-4 h-4 text-brand-cyan" />
            <span className="font-semibold">{estimatedDurationSeconds || 45}s Duration</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-studio-800 text-slate-200 border border-white/5">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{scenes.length} Scene Beats</span>
          </div>
        </div>
      </div>

      {/* Scene Cards Grid */}
      <div className="space-y-4">
        {scenes.map((scene, idx) => (
          <div
            key={idx}
            className="group glass-panel rounded-xl p-5 border border-white/10 hover:border-brand-purple/40 transition-all shadow-md relative overflow-hidden"
          >
            {/* Top row: Beat number, timecode, actions */}
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-purple/20 text-brand-purple font-mono font-bold text-xs">
                  {idx + 1}
                </span>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-studio-800 text-brand-cyan border border-brand-cyan/20">
                  {scene.timecode || `Beat ${idx + 1}`}
                </span>
                {idx === 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                    Viral Hook (0-3s)
                  </span>
                )}
                {idx === scenes.length - 1 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                    Call To Action
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePlayVoiceover(scene.audioScript, idx)}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                    playingIndex === idx
                      ? "bg-brand-cyan text-studio-950 font-bold"
                      : "bg-studio-800 text-slate-300 hover:text-white hover:bg-studio-700"
                  }`}
                  title={playingIndex === idx ? "Stop Voiceover" : "Listen to Voiceover"}
                >
                  {playingIndex === idx ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-brand-cyan" />
                      <span className="text-[11px]">Listen</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopyScene(scene, idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-studio-800 hover:bg-studio-700 transition-colors"
                  title="Copy Scene"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Spoken Audio Script (7 cols) */}
              <div className="md:col-span-7 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <Volume2 className="w-3 h-3 text-brand-cyan" />
                  <span>Spoken Audio Narration</span>
                </div>
                <div className="p-3 rounded-lg bg-studio-900/90 border border-white/5 text-slate-100 text-xs sm:text-sm leading-relaxed font-sans">
                  &ldquo;{scene.audioScript}&rdquo;
                </div>
              </div>

              {/* Visual Cue & On-Screen Overlay (5 cols) */}
              <div className="md:col-span-5 space-y-3">
                {/* Visual Cue */}
                <div>
                  <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <Eye className="w-3 h-3 text-purple-400" />
                    <span>Visual & Camera Cue</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-studio-900/60 border border-white/5 text-slate-300 text-xs italic">
                    {scene.visualCue}
                  </div>
                </div>

                {/* On-Screen Text Overlay Mockup */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    On-Screen Text Overlay:
                  </div>
                  <div className="px-3 py-1.5 rounded-md bg-gradient-to-r from-brand-purple/20 to-brand-cyan/20 border border-brand-purple/30 text-white font-black text-xs uppercase tracking-wide text-center shadow-sm">
                    {scene.onScreenText || "KEY MOMENT"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
