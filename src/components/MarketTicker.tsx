import React from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import type { MarketTicker as MarketTickerType } from "../types.js";

interface Props {
  markets: MarketTickerType[];
  isLoading?: boolean;
}

export const MarketTicker: React.FC<Props> = ({ markets, isLoading }) => {
  return (
    <div
      id="financial-market-ticker"
      className="bg-[#151c24] text-white border-y border-neutral-800 text-xs py-2 overflow-x-auto whitespace-nowrap scrollbar-none"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6">
        <div className="flex items-center gap-2 text-amber-400 font-semibold uppercase tracking-wider text-[11px] shrink-0">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>Live Ticker:</span>
        </div>

        <div className="flex items-center gap-6 divide-x divide-neutral-700">
          {markets.map((m) => (
            <div key={m.symbol} className="flex items-center gap-2 pl-4 first:pl-0 shrink-0">
              <span className="font-bold text-neutral-200">{m.symbol}</span>
              <span className="text-neutral-400 text-[11px] hidden sm:inline">{m.name}</span>
              <span className="font-mono font-medium text-neutral-100">{m.value}</span>
              <span
                className={`flex items-center text-[11px] font-mono px-1 rounded ${
                  m.isPositive
                    ? "text-emerald-400 bg-emerald-950/60"
                    : "text-rose-400 bg-rose-950/60"
                }`}
              >
                {m.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {m.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
