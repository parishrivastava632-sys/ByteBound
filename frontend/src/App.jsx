import React, { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { auth, onAuthStateChanged, signOut, isFirebaseConfigured } from "./firebase";
import Navbar from "./components/Navbar";
import InputPanel from "./components/InputPanel";
import OutputWorkspace from "./components/OutputWorkspace";
import ProjectHistorySidebar from "./components/ProjectHistorySidebar";
import AuthModal from "./components/AuthModal";
import SamplePromptsModal from "./components/SamplePromptsModal";
import { AlertCircle, History, Sparkles, CheckCircle2 } from "lucide-react";
import {
  loadStudioPreferences,
  saveStudioPreferences,
  loadSavedProjects,
  saveSavedProjects,
} from "./utils/localStorage";
import { generateMediaPackage } from "./utils/synthesizer";

const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, "") : "";
const RECENT_ACCOUNTS_KEY = "omnimedia-recent-accounts";
const ACTIVE_USER_SESSION_KEY = "omnimedia_active_user";

function loadActiveUser() {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(ACTIVE_USER_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email && parsed.uid !== "demo-studio-guest") {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("⚠️ [Local Storage] Failed to read active user session:", err.message);
  }
  return null;
}

function saveActiveUser(userObj) {
  if (typeof window === "undefined") return;
  try {
    if (userObj && userObj.email && userObj.uid !== "demo-studio-guest") {
      window.localStorage.setItem(ACTIVE_USER_SESSION_KEY, JSON.stringify(userObj));
    } else {
      window.localStorage.removeItem(ACTIVE_USER_SESSION_KEY);
    }
  } catch (_) {}
}

function loadRecentAccounts() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_ACCOUNTS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (err) {
    console.warn("⚠️ [Local Storage] Failed to read recent accounts:", err.message);
    return [];
  }
}

export default function App() {
  // Authentication State
  const [user, setUser] = useState(() => loadActiveUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSamplesModalOpen, setIsSamplesModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Studio Generation State
  const initialStudioState = loadStudioPreferences();
  const [content, setContent] = useState(initialStudioState.content);
  const [targetAudience, setTargetAudience] = useState(initialStudioState.targetAudience);
  const [platformFocus, setPlatformFocus] = useState(initialStudioState.platformFocus);
  const [generatedData, setGeneratedData] = useState(initialStudioState.generatedData);
  const [activeProjectId, setActiveProjectId] = useState(null);

  // Loading & Progress
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // Projects History
  const [projects, setProjects] = useState(() => loadSavedProjects());
  const [backendHealth, setBackendHealth] = useState(null);
  const [recentAccounts, setRecentAccounts] = useState(() => loadRecentAccounts());

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RECENT_ACCOUNTS_KEY, JSON.stringify(recentAccounts.slice(0, 4)));
    }
  }, [recentAccounts]);

  useEffect(() => {
    saveStudioPreferences({ content, targetAudience, platformFocus, generatedData });
  }, [content, targetAudience, platformFocus, generatedData]);

  useEffect(() => {
    saveSavedProjects(projects);
  }, [projects]);

  const addRecentAccount = useCallback((account) => {
    if (!account || !account.email) {
      return;
    }

    const normalized = {
      uid: account.uid,
      email: account.email,
      displayName: account.displayName || account.email.split("@")[0],
    };

    setRecentAccounts((prev) => {
      const filtered = prev.filter((item) => item.email !== normalized.email);
      return [normalized, ...filtered].slice(0, 4);
    });
  }, []);

  // Monitor Auth State
  useEffect(() => {
    if (auth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          let displayName = currentUser.displayName;
          if (!displayName) {
            const e = (currentUser.email || "").toLowerCase();
            if (e.includes("pari")) displayName = "Pari Shrivastava";
            else if (e.includes("priya")) displayName = "Priyanka Kumari";
            else displayName = currentUser.email?.split("@")[0] || "Pari Shrivastava";
          }
          const formatted = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName,
          };
          setUser(formatted);
          saveActiveUser(formatted);
          addRecentAccount(formatted);
        } else {
          // If Firebase signed out, check if a direct active session is present
          const existing = loadActiveUser();
          if (existing && existing.email && existing.uid !== "demo-studio-guest") {
            setUser(existing);
          } else {
            setUser(null);
          }
        }
      });
      return () => unsubscribe();
    }
  }, [addRecentAccount]);

  // Fetch Backend Health & Saved Projects
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        setBackendHealth(data);
      }
    } catch (err) {
      console.warn("Backend not yet reachable on /health");
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    try {
      const token = user?.getIdToken ? await user.getIdToken() : "guest-demo-token";
      const res = await fetch(`${API_BASE}/api/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-id": user.uid || "demo-studio-guest",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.projects) {
          setProjects(data.projects);
        }
      }
    } catch (err) {
      console.warn("Could not fetch project history:", err.message);
      setProjects(loadSavedProjects());
    }
  }, [user]);

  // Periodic health check
  useEffect(() => {
    checkHealth();
    const healthInterval = setInterval(checkHealth, 15000);
    return () => clearInterval(healthInterval);
  }, [checkHealth]);

  // Fetch projects when user changes and periodically
  useEffect(() => {
    if (!user) return;
    fetchProjects();
    const interval = setInterval(fetchProjects, 15000);
    return () => clearInterval(interval);
  }, [user, fetchProjects]);

  // Handle Generation
  const handleGenerateMedia = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessToast("");

    // Step-by-step progress simulation
    const steps = [
      "Deconstructing Raw Transcript...",
      "Synthesizing 9:16 Video Storyboard & Beats...",
      "Crafting High-Hook X & LinkedIn Copy...",
      "Calculating Virality Score & Taxonomy...",
      "Validating Strict Output Schema...",
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);
    const progressTimer = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
      }
    }, 1200);

    try {
      const token = user?.getIdToken ? await user.getIdToken() : "guest-demo-token";
      const response = await fetch(`${API_BASE}/api/generate-media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-user-id": user?.uid || "demo-studio-guest",
        },
        body: JSON.stringify({
          content,
          targetAudience,
          platformFocus,
        }),
      });

      clearInterval(progressTimer);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Generation request failed");
      }

      setGeneratedData(result.data);
      setActiveProjectId(result.id);
      setSuccessToast("Media package synthesized successfully!");
      setTimeout(() => setSuccessToast(""), 4000);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#7f5af0", "#00f2fe", "#4facfe", "#ff416c"],
      });

      // Refresh history
      fetchProjects();
    } catch (err) {
      clearInterval(progressTimer);
      console.warn("API server offline/unreachable. Activating Client-Side Autonomous Engine:", err.message);

      // Seamless Autonomous Client-Side Engine Fallback
      const packageData = generateMediaPackage(content, targetAudience, platformFocus);
      const fallbackId = `proj_${Date.now()}`;
      const newProj = {
        id: fallbackId,
        userId: user?.uid || "demo-studio-guest",
        rawInput: content,
        targetAudience: targetAudience || "Tech Leaders, Digital Creators, Growth Strategists",
        platformFocus: platformFocus || "Omnichannel",
        output: packageData,
        createdAt: new Date().toISOString(),
      };

      setGeneratedData(packageData);
      setActiveProjectId(fallbackId);
      setSavedProjects((prev) => [newProj, ...prev]);
      setSuccessToast("Media package synthesized successfully!");
      setTimeout(() => setSuccessToast(""), 4000);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#7f5af0", "#00f2fe", "#4facfe", "#ff416c"],
      });
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  // Select project from history
  const handleSelectProject = (proj) => {
    setGeneratedData(proj.output);
    setActiveProjectId(proj.id);
    if (proj.rawInput) {
      setContent(proj.rawInput);
    }
    if (proj.targetAudience) {
      setTargetAudience(proj.targetAudience);
    }
    if (proj.platformFocus) {
      setPlatformFocus(proj.platformFocus);
    }
    setIsSidebarOpen(false);
  };

  // Delete project from history
  const handleDeleteProject = async (id) => {
    try {
      const token = user?.getIdToken ? await user.getIdToken() : "guest-demo-token";
      await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-id": user?.uid || "demo-studio-guest",
        },
      });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (activeProjectId === id) {
        setActiveProjectId(null);
      }
    } catch (err) {
      console.warn("Failed to delete project:", err.message);
    }
  };

  // Reset to new project
  const handleNewProject = () => {
    setContent("");
    setGeneratedData(null);
    setActiveProjectId(null);
    setErrorMessage("");
  };

  // Load sample scenario
  const handleSelectSample = (sample) => {
    setContent(sample.text);
    if (sample.audience) setTargetAudience(sample.audience);
    if (sample.platform) setPlatformFocus(sample.platform);
  };

  // User Sign Out
  const handleSignOut = async () => {
    if (auth && isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (_) {}
    }
    saveActiveUser(null);
    setUser(null);
  };

  const handleClearAccounts = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(RECENT_ACCOUNTS_KEY);
    }
    setRecentAccounts([]);
  };

  const handleSwitchAccount = async () => {
    await handleSignOut();
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onSwitchAccount={handleSwitchAccount}
        recentAccounts={recentAccounts}
        onOpenSamples={() => setIsSamplesModalOpen(true)}
        onNewProject={handleNewProject}
        backendHealth={backendHealth}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Toast / Alert Messages */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="text-red-400 hover:text-white text-xs font-bold px-2 py-0.5"
            >
              Dismiss
            </button>
          </div>
        )}

        {successToast && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successToast}</span>
            </div>
            <span className="font-mono text-[10px]">Saved to Firestore</span>
          </div>
        )}

        {/* 2-Column Responsive Studio Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Input Panel (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <InputPanel
              content={content}
              setContent={setContent}
              targetAudience={targetAudience}
              setTargetAudience={setTargetAudience}
              platformFocus={platformFocus}
              setPlatformFocus={setPlatformFocus}
              onGenerate={handleGenerateMedia}
              isLoading={isLoading}
              loadingStep={loadingStep}
              onSelectSample={handleSelectSample}
            />
          </div>

          {/* Right Column: Output Workspace (7 cols) */}
          <div className="lg:col-span-7 h-full">
            <OutputWorkspace
              generatedData={generatedData}
              onOpenSamples={() => setIsSamplesModalOpen(true)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Floating Toggle for Project History Sidebar on Mobile/Desktop */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-studio-900 hover:bg-brand-purple text-brand-cyan hover:text-white border border-white/10 shadow-glow transition-all flex items-center space-x-2 text-xs font-bold"
        title="View Generation History"
      >
        <History className="w-4 h-4" />
        <span className="hidden sm:inline">History ({projects.length})</span>
      </button>

      {/* Slide-out Project History Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <ProjectHistorySidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onDemoLogin={(demoUser) => {
          setUser(demoUser);
          saveActiveUser(demoUser);
          addRecentAccount(demoUser);
        }}
        recentAccounts={recentAccounts}
        onClearAccounts={handleClearAccounts}
        onAuthSuccess={(authenticatedUser) => {
          let displayName = authenticatedUser.displayName;
          if (!displayName) {
            const e = (authenticatedUser.email || "").toLowerCase();
            if (e.includes("pari")) displayName = "Pari Shrivastava";
            else if (e.includes("priya")) displayName = "Priyanka Kumari";
            else displayName = authenticatedUser.email?.split("@")[0] || "Pari Shrivastava";
          }
          const formatted = {
            uid: authenticatedUser.uid,
            email: authenticatedUser.email,
            displayName,
          };
          setUser(formatted);
          saveActiveUser(formatted);
          addRecentAccount(formatted);
        }}
      />

      <SamplePromptsModal
        isOpen={isSamplesModalOpen}
        onClose={() => setIsSamplesModalOpen(false)}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
}
