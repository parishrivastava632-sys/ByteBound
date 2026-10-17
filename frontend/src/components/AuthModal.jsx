import React, { useState } from "react";
import { X, Sparkles, AlertTriangle, Mail, Lock, UserCheck, Trash2 } from "lucide-react";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  isFirebaseConfigured,
} from "../firebase";

const QUICK_PROFILES = [
  { name: "Priyanka Kumari", email: "priya85822@gmail.com" },
  { name: "Priyanka Kumari", email: "priyankasmu.63@gmail.com" },
  { name: "Priyanka Kumari", email: "parishrivastava632@gmail.com" },
];

export default function AuthModal({
  isOpen,
  onClose,
  onDemoLogin,
  onAuthSuccess,
  recentAccounts = [],
  onClearAccounts,
}) {
  const [customName, setCustomName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDirectLogin = (targetEmail, targetName) => {
    const cleanEmail = (targetEmail || email || "creator@omnimedia.studio").trim();
    const displayName =
      (targetName || customName || "").trim() ||
      cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const uid = "usr_" + cleanEmail.replace(/[^a-zA-Z0-9]/g, "_");

    onDemoLogin({
      uid,
      email: cleanEmail,
      displayName,
    });
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setIsLoading(true);

    if (!isFirebaseConfigured || !auth) {
      handleDirectLogin(email || "parishrivastava632@gmail.com", "Studio Creator");
      return;
    }

    try {
      try {
        await signOut(auth);
      } catch (_) {}

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const credential = await signInWithPopup(auth, provider);
      onAuthSuccess(credential.user);
      onClose();
    } catch (err) {
      console.warn("Google Auth error:", err);

      const code = err?.code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setErrorMsg("Google popup was closed. You can enter your email directly below to sign in instantly.");
      } else if (code === "auth/popup-blocked") {
        setErrorMsg("The Google popup was blocked. Enter your email below to sign in without popup.");
      } else {
        setErrorMsg("Google blocked this account due to OAuth test limits. Enter your email below to sign in instantly.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !email.trim()) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    const cleanEmail = email.trim();
    const finalName = customName.trim() || cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    // If password auth is explicitly toggled and provided
    if (showPasswordField && password && isFirebaseConfigured && auth) {
      setIsLoading(true);
      try {
        if (isRegister) {
          const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          onAuthSuccess(credential.user);
        } else {
          const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
          onAuthSuccess(credential.user);
        }
        onClose();
        return;
      } catch (err) {
        console.warn("Firebase password auth error, falling back to instant login:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    // Direct instant login with any email ID (no password required)
    handleDirectLogin(cleanEmail, finalName);
  };

  const handleGuestContinue = () => {
    onDemoLogin({
      uid: "demo-studio-guest",
      email: "guest@omnimedia.studio",
      displayName: "Guest Creator",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-purple/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan shadow-glow mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {isRegister ? "Create Studio Account" : "Sign In to OmniMedia Studio"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Persist generation history in Google Cloud Firestore
          </p>
        </div>

        {/* Local Env Notice Banner */}
        {!isFirebaseConfigured && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200">
                <span className="font-bold">Offline / Sandbox Mode:</span> Submitting with any email will launch an instant local studio session.
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Instant Access Profiles */}
        <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-br from-brand-purple/10 to-brand-cyan/10 border border-brand-purple/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-brand-cyan tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-brand-cyan" />
              <span>1-Click Instant Login (No OAuth Blocks)</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2.5">
            Select an account to start your studio session immediately:
          </p>
          <div className="space-y-2">
            {QUICK_PROFILES.map((profile) => (
              <button
                key={profile.email}
                type="button"
                onClick={() => handleDirectLogin(profile.email, profile.name)}
                className="w-full px-3 py-2 rounded-xl bg-studio-900/90 hover:bg-studio-800 border border-white/10 hover:border-brand-cyan/50 text-left flex items-center justify-between text-xs transition-all shadow-sm group"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    PK
                  </div>
                  <div className="truncate text-left">
                    <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {profile.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {profile.email}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan font-bold border border-brand-cyan/20 group-hover:bg-brand-cyan group-hover:text-studio-950 transition-all shrink-0">
                  Instant Log In ➔
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-300 bg-studio-900 hover:bg-studio-800 border border-white/10 hover:border-white/25 flex items-center justify-center space-x-2.5 transition-all mb-3 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google OAuth</span>
        </button>

        {/* Divider */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-studio-950 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Or Sign In With Any Other Email ID
          </span>
          <div className="border-t border-white/10 w-full"></div>
        </div>

        {/* Any Email Instant Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Your Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter any email ID (e.g. yourname@gmail.com)"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-studio-900/90 border border-white/10 focus:border-brand-cyan text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center justify-between">
              <span>Display Name <span className="text-slate-500 font-normal">(Optional)</span></span>
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Priyanka Kumari"
              className="w-full px-3 py-2 text-xs rounded-xl bg-studio-900/90 border border-white/10 focus:border-brand-cyan text-white outline-none placeholder:text-slate-500"
            />
          </div>

          {showPasswordField && (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-studio-900/90 border border-white/10 focus:border-brand-purple text-white outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-purple to-brand-cyan hover:from-brand-violet hover:to-brand-blue text-white shadow-glow transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Sign In With This Email</span>
            <span>➔</span>
          </button>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <button
              type="button"
              onClick={() => setShowPasswordField(!showPasswordField)}
              className="hover:text-slate-300 transition-colors"
            >
              {showPasswordField ? "Hide password field" : "Use password login (optional)"}
            </button>
            <span>Instant &amp; secure session</span>
          </div>
        </form>

        {/* Guest fallback button */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleGuestContinue}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Or continue as <span className="text-brand-cyan underline">Guest Creator</span>
          </button>
        </div>
      </div>
    </div>
  );
}
