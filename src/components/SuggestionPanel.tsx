import React from "react";
import {
  Sparkles,
  TrendingUp,
  Flame,
  ArrowRight,
  Compass,
  Bookmark,
  Share2,
  ExternalLink,
} from "lucide-react";
import type { NewsArticle, NewsRegion } from "../types.js";

interface Props {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onFilterByTag: (tag: string) => void;
  onSelectRegion: (region: NewsRegion) => void;
  currentRegion: NewsRegion;
  followedTopics: string[];
  className?: string;
}

export const SuggestionPanel: React.FC<Props> = ({
  articles,
  onSelectArticle,
  onFilterByTag,
  onSelectRegion,
  currentRegion,
  followedTopics,
  className = "",
}) => {
  // Top recommended articles based on AI summary or breaking status
  const recommendedArticles = articles
    .filter((a) => a.aiSummary || a.isBreaking)
    .slice(0, 4);

  // Trending regional themes
  const trendingTopics = [
    { label: "Bangladesh Bank Exposure Limit", region: "bangladesh" as NewsRegion, tag: "Banking Reform" },
    { label: "RBI Repo Rate 6.5% Hold", region: "india" as NewsRegion, tag: "RBI" },
    { label: "Pakistan PSX KSE-100 Milestone", region: "pakistan" as NewsRegion, tag: "PSX" },
    { label: "Sri Lanka Sovereign Restructuring", region: "sri_lanka" as NewsRegion, tag: "Debt Restructuring" },
    { label: "Nepal Cross-Border UPI Gateway", region: "nepal" as NewsRegion, tag: "Cross-Border UPI" },
    { label: "South Asian Venture Seed Funds", region: "south_asia" as NewsRegion, tag: "VC " },
  ];

  // Quick regional media directory
  const regionalMedia = [
    { name: "Bangladesh Wires", count: "FE BD, Daily Star, TBS", region: "bangladesh" as NewsRegion, flag: "🇧🇩" },
    { name: "Indian Markets", count: "LiveMint, ET Markets, BS", region: "india" as NewsRegion, flag: "🇮🇳" },
    { name: "Pakistan Business", count: "Express Tribune, BRecorder", region: "pakistan" as NewsRegion, flag: "🇵🇰" },
    { name: "Sri Lanka Economy", count: "The Island Business", region: "sri_lanka" as NewsRegion, flag: "🇱🇰" },
    { name: "Nepal Commerce", count: "OnlineKhabar Business", region: "nepal" as NewsRegion, flag: "🇳🇵" },
  ];

  return (
    <aside
      id="side-suggestion-panel"
      className={`bg-[#fbf9f5] border border-[#e2dad0] rounded-lg p-4 space-y-6 shadow-xs ${className}`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[#eae4da] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-100 flex items-center justify-center text-amber-800">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-base font-bold text-neutral-900 leading-tight">
              Editorial Suggestions
            </h3>
            <p className="text-[11px] text-neutral-500 font-sans">
              Algorithmic recommendations & regional pulses
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Intelligence Briefings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-700 font-semibold tracking-wider uppercase">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            Top Recommended
          </span>
          <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded font-mono">
            {recommendedArticles.length} Briefs
          </span>
        </div>

        <div className="space-y-2.5">
          {recommendedArticles.map((art) => (
            <div
              key={`sugg-${art.id}`}
              onClick={() => onSelectArticle(art)}
              className="group p-2.5 rounded-md bg-white border border-[#eae3d5] hover:border-neutral-800 hover:shadow-xs transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                <span className="font-semibold text-neutral-800 uppercase tracking-wider">
                  {art.country || (art.sourceCategory === "bangladesh" ? "Bangladesh" : "Global")}
                </span>
                <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium">
                  {art.category.toUpperCase()}
                </span>
              </div>
              <h4 className="font-serif-editorial text-xs font-semibold text-neutral-900 group-hover:text-amber-900 line-clamp-2 leading-snug transition-colors">
                {art.title}
              </h4>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-neutral-100 text-[10px] text-neutral-400">
                <span className="truncate max-w-[140px]">{art.source}</span>
                <span className="flex items-center gap-0.5 text-neutral-600 group-hover:text-neutral-900 font-medium">
                  Read Brief <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Regional Topics */}
      <div className="space-y-2.5 pt-2 border-t border-[#eae4da]">
        <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-semibold tracking-wider uppercase">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
          <span>Hot Regional Topics</span>
        </div>
        <p className="text-[11px] text-neutral-500">
          High-velocity market themes driving South Asian capital allocation:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {trendingTopics.map((topic, idx) => (
            <button
              key={`topic-${idx}`}
              onClick={() => {
                onSelectRegion(topic.region);
                onFilterByTag(topic.tag);
              }}
              className="px-2 py-1 rounded bg-white hover:bg-neutral-900 hover:text-white border border-[#ded7cc] text-[11px] text-neutral-700 font-medium transition-all text-left flex items-center gap-1"
            >
              <span>{topic.label}</span>
              <ArrowRight className="w-2.5 h-2.5 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Regional Media Wire Quick Jump */}
      <div className="space-y-2.5 pt-2 border-t border-[#eae4da]">
        <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-semibold tracking-wider uppercase">
          <Compass className="w-3.5 h-3.5 text-blue-700" />
          <span>South Asian Coverage</span>
        </div>
        <div className="space-y-1.5">
          {regionalMedia.map((media) => {
            const isActive = currentRegion === media.region;
            return (
              <button
                key={media.region}
                onClick={() => onSelectRegion(media.region)}
                className={`w-full flex items-center justify-between p-2 rounded text-xs text-left transition-all ${
                  isActive
                    ? "bg-neutral-900 text-white font-medium shadow-xs"
                    : "bg-white hover:bg-[#eae3d5] text-neutral-800 border border-[#eae3d5]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{media.flag}</span>
                  <div>
                    <span className="font-semibold block">{media.name}</span>
                    <span className={`text-[10px] block ${isActive ? "text-neutral-300" : "text-neutral-500"}`}>
                      {media.count}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-600"}`}>
                  Filter
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Intelligence Research Tip */}
      <div className="p-3 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
        <p className="font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-700" />
          Gemini Intelligence Tip
        </p>
        <p className="text-amber-800 leading-relaxed">
          Click any headline to generate on-demand AI executive summaries, risk assessment matrixes, and sectoral impact breakdowns.
        </p>
      </div>
    </aside>
  );
};
