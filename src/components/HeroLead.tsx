import React from "react";
import { Sparkles, Clock, Bookmark, ExternalLink, ShieldCheck } from "lucide-react";
import type { NewsArticle } from "../types.js";

interface Props {
  article: NewsArticle;
  onSelect: (article: NewsArticle) => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onQuickSummarize: (article: NewsArticle) => void;
}

export const HeroLead: React.FC<Props> = ({
  article,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  onQuickSummarize,
}) => {
  const isBd = article.sourceCategory === "bangladesh";

  return (
    <div
      id="lead-editorial-story"
      className="bg-white border border-[#ded7cb] rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow mb-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left / Top: Hero Image with Editorial Overlays */}
        <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[300px] bg-neutral-900 overflow-hidden group">
          <img
            src={article.imageUrl || "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1200&q=80"}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider text-white shadow-xs ${
                isBd ? "bg-emerald-700" : "bg-blue-800"
              }`}
            >
              {isBd ? "🇧🇩 Bangladesh Lead" : "🌐 Global Macro"}
            </span>

            <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-neutral-900 shadow-xs">
              {article.category}
            </span>

            {article.isBreaking && (
              <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white animate-pulse">
                Breaking
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs font-medium text-neutral-300">
              Reporting by <span className="font-semibold text-white">{article.source}</span>
            </p>
          </div>
        </div>

        {/* Right: Authoritative Lead Typography & AI Briefing Trigger */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#fffefb]">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-[#71695f] mb-3">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Featured Intelligence
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3" />
                {article.readTimeMinutes} min read
              </span>
            </div>

            <h2
              onClick={() => onSelect(article)}
              className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1a1715] leading-snug hover:text-amber-900 cursor-pointer transition-colors mb-4"
            >
              {article.title}
            </h2>

            <p className="text-[#4a433a] text-sm leading-relaxed mb-6">
              {article.summary}
            </p>

            {/* Tags strip */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-[#f3ece2] text-[#554d43] text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#eee7dc] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                id="hero-ai-briefing-btn"
                onClick={() => onQuickSummarize(article)}
                className="flex items-center gap-2 bg-[#1b1916] hover:bg-neutral-800 text-white px-4 py-2 rounded text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive AI Summary</span>
              </button>

              <button
                onClick={() => onSelect(article)}
                className="px-3 py-2 rounded border border-[#d5ccbe] text-[#332e29] hover:bg-[#f6efe4] text-xs font-medium transition-colors"
              >
                Full Intel
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleBookmark(article)}
                title={isBookmarked ? "Remove Bookmark" : "Bookmark Story"}
                className={`p-2 rounded border transition-colors ${
                  isBookmarked
                    ? "bg-amber-100 border-amber-300 text-amber-900"
                    : "border-[#d5ccbe] text-neutral-600 hover:bg-[#f6efe4]"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-700 text-amber-700" : ""}`} />
              </button>

              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                title="View original article at publisher"
                className="p-2 rounded border border-[#d5ccbe] text-neutral-500 hover:text-neutral-900 hover:bg-[#f6efe4] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
