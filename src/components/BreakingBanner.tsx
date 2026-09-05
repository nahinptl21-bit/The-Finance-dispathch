import React from "react";
import { AlertCircle, Sparkles, ChevronRight, BellRing } from "lucide-react";
import type { NewsArticle } from "../types.js";

interface Props {
  breakingArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onSendTestPush?: (article: NewsArticle) => void;
}

export const BreakingBanner: React.FC<Props> = ({
  breakingArticles,
  onSelectArticle,
  onSendTestPush,
}) => {
  if (!breakingArticles || breakingArticles.length === 0) return null;

  const topBreaking = breakingArticles[0];

  return (
    <div
      id="breaking-intelligence-banner"
      className="bg-rose-900/90 text-rose-50 border-b border-rose-950 px-4 py-2 text-xs transition-all shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="flex items-center gap-1.5 bg-rose-700 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] shrink-0 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            Breaking Wire
          </span>

          <span className="text-rose-200 font-medium shrink-0 text-[11px] hidden sm:inline">
            [{topBreaking.source}]:
          </span>

          <button
            onClick={() => onSelectArticle(topBreaking)}
            className="text-left font-medium text-white hover:underline truncate flex-1 min-w-0"
          >
            {topBreaking.title}
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectArticle(topBreaking)}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-rose-100 px-2.5 py-1 rounded text-[11px] font-medium transition-colors border border-rose-300/30"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Briefing</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          {onSendTestPush && (
            <button
              onClick={() => onSendTestPush(topBreaking)}
              title="Trigger browser push alert for this headline"
              className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-neutral-900 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
            >
              <BellRing className="w-3 h-3 text-neutral-900" />
              <span className="hidden sm:inline">Push Alert</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
