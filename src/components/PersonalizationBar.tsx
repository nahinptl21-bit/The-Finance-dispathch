import React from "react";
import { Sparkles, Check, Plus, Sliders } from "lucide-react";

export const AVAILABLE_TOPICS = [
  "Fintech",
  "RMG & Apparel",
  "Bangladesh Bank",
  "Monetary Policy",
  "Series A & Venture",
  "Dhaka Stock Exchange (DSE)",
  "AI & Semiconductors",
  "Foreign Direct Investment",
  "Maritime Logistics",
  "Renewable Energy",
  "NBR Tax Reform",
  "Global Markets & Fed",
];

interface Props {
  followedTopics: string[];
  onToggleTopic: (topic: string) => void;
  readArticlesCount: number;
}

export const PersonalizationBar: React.FC<Props> = ({
  followedTopics,
  onToggleTopic,
  readArticlesCount,
}) => {
  return (
    <div
      id="personalization-recommendation-bar"
      className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/80 px-4 py-3 text-xs"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="font-bold text-neutral-900 text-sm">
              Personalized Intelligence Feed
            </span>
            <span className="text-neutral-500 text-xs hidden md:inline">
              • AI-driven content ranking tailored to your portfolio & regulatory interests
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-neutral-600">
            <span>Reading History: <strong>{readArticlesCount}</strong> analyzed</span>
            <span>•</span>
            <span>Active Topics: <strong>{followedTopics.length}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-neutral-700 mr-1 flex items-center gap-1">
            <Sliders className="w-3 h-3" />
            Select Your Focus Areas:
          </span>
          {AVAILABLE_TOPICS.map((topic) => {
            const isSelected = followedTopics.includes(topic);
            return (
              <button
                key={topic}
                onClick={() => onToggleTopic(topic)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                  isSelected
                    ? "bg-amber-900 text-white shadow-xs font-semibold"
                    : "bg-white text-neutral-700 border border-neutral-300 hover:border-amber-400 hover:bg-amber-100/50"
                }`}
              >
                {isSelected ? <Check className="w-3 h-3 text-amber-300" /> : <Plus className="w-3 h-3 text-neutral-400" />}
                <span>{topic}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
