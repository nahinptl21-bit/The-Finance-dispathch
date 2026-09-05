import React from "react";
import {
  Globe,
  Briefcase,
  TrendingUp,
  Rocket,
  Scale,
  FileText,
  Sparkles,
  MapPin,
} from "lucide-react";
import type { NewsCategory, NewsRegion } from "../types.js";

export type ExtendedCategory = NewsCategory | "classifieds" | "for_you";

interface Props {
  selectedCategory: ExtendedCategory;
  onSelectCategory: (cat: ExtendedCategory) => void;
  selectedRegion: NewsRegion;
  onSelectRegion: (reg: NewsRegion) => void;
  totalArticlesCount: number;
}

export const FilterBar: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  totalArticlesCount,
}) => {
  const categories: { id: ExtendedCategory; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All Intelligence", icon: <Globe className="w-3.5 h-3.5" /> },
    { id: "for_you", label: "For You (AI Match)", icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
    { id: "business", label: "Business & Corporate", icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: "investment", label: "Investment & Stocks", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: "startup", label: "Startups & VC", icon: <Rocket className="w-3.5 h-3.5" /> },
    { id: "policy", label: "Policy & Central Bank", icon: <Scale className="w-3.5 h-3.5" /> },
    { id: "classifieds", label: "Gazette & Classifieds", icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div id="news-filter-navigation" className="bg-[#f5f1e9] border-b border-[#e2dad0] sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 py-2">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`filter-cat-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#181614] text-white shadow-xs"
                      : "text-[#4d463d] hover:bg-[#eae3d5] hover:text-[#181614]"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Region Toggle Pill (Hidden if on Classifieds) */}
          {selectedCategory !== "classifieds" && (
            <div className="flex items-center gap-1 bg-[#eae3d5] p-0.5 rounded text-xs shrink-0 self-start md:self-auto">
              <span className="text-[11px] font-medium text-neutral-500 px-2 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                Region:
              </span>
              <button
                id="filter-region-all"
                onClick={() => onSelectRegion("all")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  selectedRegion === "all"
                    ? "bg-white text-neutral-900 shadow-xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                All
              </button>
              <button
                id="filter-region-bangladesh"
                onClick={() => onSelectRegion("bangladesh")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                  selectedRegion === "bangladesh"
                    ? "bg-emerald-800 text-white shadow-xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                Bangladesh
              </button>
              <button
                id="filter-region-global"
                onClick={() => onSelectRegion("global")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  selectedRegion === "global"
                    ? "bg-blue-800 text-white shadow-xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Global
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
