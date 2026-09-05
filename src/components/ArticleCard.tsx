import React from "react";
import { Sparkles, Clock, Bookmark, ExternalLink } from "lucide-react";
import type { NewsArticle } from "../types.js";

interface Props {
  article: NewsArticle;
  onSelect: (article: NewsArticle) => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onQuickSummarize: (article: NewsArticle) => void;
  matchScore?: number;
}

export const ArticleCard: React.FC<Props> = ({
  article,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  onQuickSummarize,
  matchScore,
}) => {
  const isBd = article.sourceCategory === "bangladesh";

  // Calculate human friendly relative time
  const getRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return "recently";
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "startup":
        return "bg-purple-100 text-purple-900 border-purple-200";
      case "investment":
        return "bg-emerald-100 text-emerald-900 border-emerald-200";
      case "policy":
        return "bg-amber-100 text-amber-900 border-amber-200";
      case "business":
      default:
        return "bg-blue-100 text-blue-900 border-blue-200";
    }
  };

  return (
    <article
      id={`article-card-${article.id}`}
      className="bg-white border border-[#e5dfd4] rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200 group"
    >
      <div>
        {/* Optional Thumbnail */}
        {article.imageUrl && (
          <div
            onClick={() => onSelect(article)}
            className="relative h-44 w-full bg-neutral-100 overflow-hidden cursor-pointer"
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-xs ${
                  isBd ? "bg-emerald-800" : "bg-blue-900"
                }`}
              >
                {isBd ? "🇧🇩 BD" : "🌐 Global"}
              </span>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shadow-xs ${getCategoryColor(
                  article.category
                )}`}
              >
                {article.category}
              </span>

              {article.isBreaking && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white animate-pulse">
                  Flash
                </span>
              )}
            </div>

            {matchScore !== undefined && matchScore > 30 && (
              <div className="absolute top-3 right-3 bg-amber-500 text-neutral-900 font-bold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{Math.min(99, Math.round(matchScore))}% Match</span>
              </div>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Metadata strip */}
          <div className="flex items-center justify-between gap-2 text-xs text-[#70685e] mb-2">
            <span className="font-semibold text-neutral-800 truncate max-w-[180px]">
              {article.source}
            </span>
            <div className="flex items-center gap-2 shrink-0 text-[11px]">
              <span>{getRelativeTime(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {article.readTimeMinutes}m
              </span>
            </div>
          </div>

          <h3
            onClick={() => onSelect(article)}
            className="font-serif-editorial text-lg font-bold text-[#1b1816] leading-snug hover:text-amber-900 cursor-pointer transition-colors line-clamp-3 mb-2"
          >
            {article.title}
          </h3>

          <p className="text-[#51493f] text-xs leading-relaxed line-clamp-3 mb-3">
            {article.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded bg-[#f4ede3] text-[#554d43] text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="px-4 py-3 bg-[#fdfcf9] border-t border-[#eee7dc] flex items-center justify-between gap-2">
        <button
          id={`ai-briefing-btn-${article.id}`}
          onClick={() => onQuickSummarize(article)}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-amber-800 bg-[#f4ece0] hover:bg-[#ede3d3] px-2.5 py-1.5 rounded transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>AI Summary</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleBookmark(article)}
            title={isBookmarked ? "Remove Bookmark" : "Save to Briefings"}
            className={`p-1.5 rounded border transition-colors ${
              isBookmarked
                ? "bg-amber-100 border-amber-300 text-amber-900"
                : "border-[#ded6c9] text-neutral-500 hover:bg-[#f2ece1]"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-700 text-amber-700" : ""}`} />
          </button>

          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            title="Read full article on original publisher"
            className="p-1.5 rounded border border-[#ded6c9] text-neutral-500 hover:text-neutral-900 hover:bg-[#f2ece1] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
