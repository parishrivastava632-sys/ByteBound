import React from "react";
import { Sparkles, Video, User, LogOut, Github, Cpu, Cloud, Database, FileText, ArrowRightLeft } from "lucide-react";

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
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
            backendHealth?.status === "ok" 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}>
            <span className={`w-2 h-2 rounded-full ${backendHealth?.status === "ok" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
            <span>{backendHealth?.status === "ok" ? (backendHealth?.geminiConfigured ? "API Online" : "Demo Mode") : "API Connecting"}</span>
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

          {/* User Auth Info */}
          {user && user.email && user.email !== "guest@omnimedia.studio" && user.uid !== "demo-studio-guest" ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
              <div className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-studio-900 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan flex items-center justify-center text-[11px] font-bold text-white uppercase">
                  {user.displayName ? user.displayName[0] : (user.email ? user.email[0] : "U")}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                    {user.displayName || user.email?.split("@")[0] || "Studio User"}
                  </div>
                  <div className="text-[10px] text-brand-cyan font-mono">Active Session</div>
                </div>
              </div>
              {recentAccounts.length > 0 && (
                <button
                  onClick={onSwitchAccount}
                  title="Switch account"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-brand-cyan hover:bg-brand-cyan/10 transition-colors"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onSignOut}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
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
            href="https://github.com/GoogleCloudPlatform"
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
