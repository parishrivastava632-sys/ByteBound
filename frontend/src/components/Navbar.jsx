import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Video, User, LogOut, Github, Cpu, Cloud, Database, FileText, ChevronDown, RefreshCw } from "lucide-react";

export default function Navbar({
  user,
  onOpenAuth,
  onSignOut,
  onSwitchAccount,
  recentAccounts = [],
  onOpenSamples,
  onNewProject,
  backendHealth,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-studio-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewProject}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple via-brand-violet to-brand-blue shadow-glow">
            <Video className="w-5 h-5 text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-cyan"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-cyan bg-clip-text text-transparent">
                OmniMedia AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Autonomous Omnichannel Pre-Production Engine
            </p>
          </div>
        </div>

        {/* Center Architecture Badges */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-300">
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-studio-900 border border-white/5">
            <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{backendHealth?.model || "Gemini 2.5 Flash"}</span>
          </div>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-studio-900 border border-white/5">
            <Cloud className="w-3.5 h-3.5 text-blue-400" />
            <span>{backendHealth?.status === "ok" && backendHealth?.geminiConfigured ? "Cloud Run" : "Local Demo"}</span>
          </div>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-studio-900 border border-white/5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>{backendHealth?.firestoreReady ? "Firestore Live" : "Local Storage"}</span>
          </div>
          {/* Live API Health Indicator */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{backendHealth?.status === "ok" ? (backendHealth?.geminiConfigured ? "Cloud Run API" : "Studio API") : "Studio Engine (Active)"}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSamples}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-studio-900 hover:bg-studio-800 border border-white/10 hover:border-brand-purple/40 transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-brand-purple" />
            <span>Load Samples</span>
          </button>

          <button
            onClick={onNewProject}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-brand-purple to-brand-violet hover:from-brand-violet hover:to-brand-blue shadow-glow hover:shadow-glow-cyan transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Generation</span>
          </button>

          {/* User Auth Profile & Account Controls */}
          {user && user.email && user.email !== "guest@omnimedia.studio" && user.uid !== "demo-studio-guest" ? (
            <div className="relative pl-2 border-l border-white/10" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-studio-900/90 hover:bg-studio-800 border border-white/10 hover:border-brand-cyan/40 transition-all shadow-sm text-left group"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center text-[11px] font-bold text-white uppercase shadow-sm shrink-0">
                  {user.displayName ? user.displayName[0] : (user.email ? user.email[0] : "P")}
                </div>
                <div className="hidden sm:flex flex-col justify-center max-w-[120px]">
                  <div className="text-xs font-semibold text-slate-100 truncate group-hover:text-brand-cyan transition-colors">
                    {user.displayName || user.email?.split("@")[0] || "Pari Shrivastava"}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span>Signed In</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              {/* Account Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl p-3 border border-white/15 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 mb-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-xs font-bold text-white">
                      {user.displayName || "Pari Shrivastava"}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      {user.email}
                    </div>
                    <div className="mt-1 text-[9px] uppercase tracking-wider text-brand-cyan font-bold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Google Verified Account</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (onSwitchAccount) onSwitchAccount();
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl text-slate-200 hover:text-white hover:bg-brand-purple/20 flex items-center space-x-2 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Switch / Change Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (onSignOut) onSignOut();
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/15 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-cyan hover:text-white bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/30 transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </button>
            </div>
          )}

          {/* GitHub Repo */}
          <a
            href="https://github.com/parishrivastava632-sys/ByteBound"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
