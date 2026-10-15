import React from "react";
import { History, Trash2, Clock, ChevronRight, Sparkles, X } from "lucide-react";

export default function ProjectHistorySidebar({
  projects = [],
  activeProjectId,
  onSelectProject,
  onDeleteProject,
  isOpen,
  onToggle,
}) {
  return (
    <aside
      className={`fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-studio-950/95 backdrop-blur-2xl border-l border-white/10 p-5 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-brand-cyan" />
          <h3 className="text-sm font-bold text-white">Generation History</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-studio-900 text-slate-400 border border-white/5">
            {projects.length} Saved
          </span>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close History Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {projects.length === 0 ? (
          <div className="p-6 text-center text-slate-400 border border-dashed border-white/10 rounded-xl my-4">
            <Sparkles className="w-6 h-6 text-slate-400 mx-auto mb-2 opacity-60" />
            <p className="text-xs font-semibold text-slate-300">No projects yet</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Generated media packages will automatically sync to Firestore here.
            </p>
          </div>
        ) : (
          projects.map((proj) => {
            const isSelected = activeProjectId === proj.id;
            const title =
              proj.output?.productionSummary?.title ||
              proj.rawInput?.substring(0, 45) ||
              "Untitled Generation";
            const virality =
              proj.output?.productionSummary?.predictedViralityScore || "--";
            
            let dateStr = "Recent";
            try {
              if (proj.createdAt) {
                const d = new Date(proj.createdAt);
                if (!isNaN(d.getTime())) {
                  dateStr = d.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }
              }
            } catch (e) {
              dateStr = "Recent";
            }

            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className={`group relative p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? "bg-brand-purple/20 border-brand-purple/60 shadow-glow"
                    : "bg-studio-900/70 hover:bg-studio-900 border-white/5 hover:border-white/15"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4
                    className={`text-xs font-bold line-clamp-1 ${
                      isSelected ? "text-white" : "text-slate-200 group-hover:text-white"
                    }`}
                  >
                    {title}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-brand-cyan bg-brand-cyan/10 px-1.5 py-0.5 rounded border border-brand-cyan/20 shrink-0">
                    {virality}/100
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-white/5">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{dateStr}</span>
                  </span>

                  <div className="flex items-center space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(proj.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <ChevronRight className="w-3 h-3 text-brand-purple" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cloud Sync Status Footer */}
      <div className="pt-3 border-t border-white/10 mt-auto text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Firestore Sync Active</span>
        </span>
        <span className="font-mono text-[10px]">Cloud Run</span>
      </div>
    </aside>
  );
}

