import React, { useState } from "react";
import { X, Sparkles, AlertTriangle, ShieldCheck, Mail, Lock } from "lucide-react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  isFirebaseConfigured,
} from "../firebase";

export default function AuthModal({ isOpen, onClose, onDemoLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setIsLoading(true);
    if (!isFirebaseConfigured || !auth) {
      // Graceful fallback to demo mode
      onDemoLogin({
        uid: "google_demo_creator",
        email: "google.creator@omnimedia.studio",
        displayName: "Google Creator",
      });
      onClose();
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err) {
      console.warn("Firebase Auth error:", err);
      setErrorMsg(err.message || "Google sign-in encountered an issue.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    if (!isFirebaseConfigured || !auth) {
      onDemoLogin({
        uid: `demo_user_${Date.now()}`,
        email: email || "creator@omnimedia.studio",
        displayName: email ? email.split("@")[0] : "Studio Creator",
      });
      onClose();
      return;
    }

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
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
                <span className="font-bold">Local Development Mode Active:</span> Firebase keys are unconfigured or using placeholders. You can use instant 1-click Demo Sign-In below!
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

        {/* Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-100 bg-studio-900 hover:bg-studio-800 border border-white/10 hover:border-white/25 flex items-center justify-center space-x-2.5 transition-all mb-4 shadow-sm"
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
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-studio-950 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Or with Email
          </span>
          <div className="border-t border-white/10 w-full"></div>
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@domain.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-studio-900/90 border border-white/10 focus:border-brand-purple text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-studio-900/90 border border-white/10 focus:border-brand-purple text-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-purple to-brand-violet hover:from-brand-violet hover:to-brand-blue text-white shadow-glow transition-all"
          >
            {isRegister ? "Create Account" : "Sign In with Email"}
          </button>
        </form>

        {/* Demo Fast Login Button */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              onDemoLogin({
                uid: "demo_guest_creator",
                email: "guest.creator@omnimedia.studio",
                displayName: "Guest Creator",
              });
              onClose();
            }}
            className="w-full py-2 rounded-xl text-xs font-semibold text-brand-cyan hover:text-white bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center space-x-1.5 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enter Studio as Demo Creator (Instant Access)</span>
          </button>
        </div>

        {/* Toggle sign in / register */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[11px] text-slate-400 hover:text-brand-purple transition-colors"
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
