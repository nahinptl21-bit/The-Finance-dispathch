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
  LineChart,
} from "lucide-react";
import type { NewsCategory, NewsRegion } from "../types.js";

export type ExtendedCategory = NewsCategory | "classifieds" | "for_you" | "stocks";

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
  const categories: { id: ExtendedCategory; label: string; icon: React.ReactNode; isNew?: boolean }[] = [
    { id: "all", label: "All Intelligence", icon: <Globe className="w-3.5 h-3.5" /> },
    { id: "for_you", label: "For You (AI Match)", icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
    { id: "stocks", label: "Stock Exchange", icon: <LineChart className="w-3.5 h-3.5 text-emerald-600" />, isNew: true },
    { id: "business", label: "Business & Corporate", icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: "investment", label: "Investment & Stocks", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: "startup", label: "Startups & VC", icon: <Rocket className="w-3.5 h-3.5" /> },
    { id: "policy", label: "Policy & Central Bank", icon: <Scale className="w-3.5 h-3.5" /> },
    { id: "classifieds", label: "Gazette & Classifieds", icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  const regions: { id: NewsRegion; label: string; flag: string }[] = [
    { id: "all", label: "All Regions", flag: "🌐" },
    { id: "bangladesh", label: "Bangladesh", flag: "🇧🇩" },
    { id: "south_asia", label: "South Asia", flag: "🌏" },
    { id: "india", label: "India", flag: "🇮🇳" },
    { id: "pakistan", label: "Pakistan", flag: "🇵🇰" },
    { id: "sri_lanka", label: "Sri Lanka", flag: "🇱🇰" },
    { id: "nepal", label: "Nepal", flag: "🇳🇵" },
    { id: "global", label: "Global", flag: "🌍" },
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
                  {cat.isNew && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Region Toggle Pill (Hidden if on Classifieds or Stocks) */}
          {selectedCategory !== "classifieds" && selectedCategory !== "stocks" && (
            <div className="flex items-center gap-1 bg-[#eae3d5] p-0.5 rounded text-xs shrink-0 self-start md:self-auto overflow-x-auto max-w-full scrollbar-none">
              <span className="text-[11px] font-medium text-neutral-500 px-1.5 flex items-center gap-1 shrink-0">
                <MapPin className="w-3 h-3 text-neutral-400" />
                Region:
              </span>
              {regions.map((reg) => {
                const isSelected = selectedRegion === reg.id;
                return (
                  <button
                    key={reg.id}
                    id={`filter-region-${reg.id}`}
                    onClick={() => onSelectRegion(reg.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all shrink-0 flex items-center gap-1 ${
                      isSelected
                        ? "bg-[#181614] text-white shadow-xs font-semibold"
                        : "text-neutral-700 hover:text-neutral-900 hover:bg-[#ded7cb]"
                    }`}
                  >
                    <span>{reg.flag}</span>
                    <span>{reg.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

