import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Globe2,
  FileEdit,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Layers,
} from "lucide-react";
import type { StockQuote, MarketOverview } from "../types.js";

interface Props {
  stocks: StockQuote[];
  overviews: MarketOverview[];
  onAddStockNote: (stock: StockQuote) => void;
  onRefreshStocks: () => void;
  isRefreshing?: boolean;
}

export const StockExchange: React.FC<Props> = ({
  stocks: initialStocks,
  overviews: initialOverviews,
  onAddStockNote,
  onRefreshStocks,
  isRefreshing = false,
}) => {
  const [selectedExchange, setSelectedExchange] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [liveTicksEnabled, setLiveTicksEnabled] = useState<boolean>(true);
  const [stocks, setStocks] = useState<StockQuote[]>(initialStocks);
  const [lastTickTime, setLastTickTime] = useState<string>(new Date().toLocaleTimeString());

  // Keep internal state in sync with props
  useEffect(() => {
    setStocks(initialStocks);
  }, [initialStocks]);

  // Real-time micro price tick simulation
  useEffect(() => {
    if (!liveTicksEnabled) return;

    const interval = setInterval(() => {
      setStocks((prevStocks) => {
        // Pick 2 random stocks to fluctuate slightly
        if (prevStocks.length === 0) return prevStocks;
        const targetIdx = Math.floor(Math.random() * prevStocks.length);
        const targetIdx2 = (targetIdx + 3) % prevStocks.length;

        return prevStocks.map((stock, idx) => {
          if (idx !== targetIdx && idx !== targetIdx2) return stock;

          const deltaPercent = (Math.random() * 0.4 - 0.2); // -0.2% to +0.2%
          const deltaPrice = Number(((stock.price * deltaPercent) / 100).toFixed(2));
          const newPrice = Math.max(1, Number((stock.price + deltaPrice).toFixed(2)));
          const newChange = Number((stock.change + deltaPrice).toFixed(2));
          const newChangePercent = Number((stock.changePercent + deltaPercent).toFixed(2));

          const spark = stock.sparkline ? [...stock.sparkline.slice(1), newPrice] : [newPrice];

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            isPositive: newChange >= 0,
            sparkline: spark,
          };
        });
      });

      setLastTickTime(new Date().toLocaleTimeString());
    }, 4000);

    return () => clearInterval(interval);
  }, [liveTicksEnabled]);

  // Filter stocks
  const filteredStocks = stocks.filter((stock) => {
    const matchesExchange =
      selectedExchange === "ALL" ||
      (selectedExchange === "INDIA" && (stock.exchange === "BSE" || stock.exchange === "NSE")) ||
      stock.exchange === selectedExchange;

    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.exchange.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesExchange && matchesSearch;
  });

  const exchangeTabs = [
    { id: "ALL", label: "All South Asia", flag: "🌏" },
    { id: "DSE", label: "Dhaka (DSE)", flag: "🇧🇩" },
    { id: "INDIA", label: "India (BSE / NSE)", flag: "🇮🇳" },
    { id: "PSX", label: "Pakistan (PSX)", flag: "🇵🇰" },
    { id: "CSE", label: "Sri Lanka (CSE)", flag: "🇱🇰" },
    { id: "NEPSE", label: "Nepal (NEPSE)", flag: "🇳🇵" },
  ];

  return (
    <div id="stock-exchange-dashboard" className="space-y-6">
      {/* Top Banner: Realtime Status & Live Controls */}
      <div className="bg-[#181614] text-white rounded-lg p-5 border border-neutral-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Live South Asian Financial Markets Gateway
              </span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-tight text-neutral-100">
              Real-Time Stock Exchanges
            </h2>
            <p className="text-xs text-neutral-400 mt-1 font-serif-editorial italic">
              Official equity indices and multi-currency securities pricing across Dhaka, Mumbai, Karachi, Colombo & Kathmandu.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Live Ticks Toggle */}
            <button
              onClick={() => setLiveTicksEnabled(!liveTicksEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
                liveTicksEnabled
                  ? "bg-emerald-950/80 border-emerald-600 text-emerald-300"
                  : "bg-neutral-800 border-neutral-700 text-neutral-400"
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${liveTicksEnabled ? "animate-spin" : ""}`} />
              <span>{liveTicksEnabled ? "Live Ticks Active" : "Ticks Paused"}</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={onRefreshStocks}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 border border-neutral-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <span className="text-[11px] font-mono text-neutral-500">
              Synced: {lastTickTime}
            </span>
          </div>
        </div>

        {/* Major Exchange Index Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
          {initialOverviews.map((ov) => (
            <div
              key={ov.code}
              className="bg-neutral-900/90 rounded-md p-3 border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-neutral-200">
                  <span className="text-base">{ov.countryFlag}</span>
                  <span>{ov.exchange}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">({ov.code})</span>
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    ov.status === "OPEN"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {ov.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans truncate max-w-[150px]">
                    {ov.indexName}
                  </span>
                  <span className="font-mono text-lg font-bold text-white tracking-tight">
                    {ov.indexValue}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-mono font-bold ${
                    ov.isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {ov.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{ov.change}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 mt-2 border-t border-neutral-800/80">
                <span>Vol: {ov.turnover}</span>
                <span className="font-mono">{ov.tradingHours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#fbf9f5] border border-[#ded7cb] rounded-lg p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Exchange Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {exchangeTabs.map((tab) => {
              const isActive = selectedExchange === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedExchange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "bg-white text-neutral-700 border border-[#ded7cb] hover:bg-[#eae3d5]"
                  }`}
                >
                  <span>{tab.flag}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Securities Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search ticker, company or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#ded7cb] rounded text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-800"
            />
          </div>
        </div>
      </div>

      {/* Securities Equities Table / Grid */}
      <div className="bg-white border border-[#ded7cb] rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#ded7cb] bg-[#f8f6f0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-700" />
            <h3 className="font-serif-editorial text-sm font-bold text-neutral-900">
              Equities Watchlist & Market Depths ({filteredStocks.length} Securities)
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500 font-sans hidden sm:inline">
            Click Note to attach quotation to research memo
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#eae4da] bg-[#faf8f3] text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">
                <th className="py-2.5 px-4">Symbol / Name</th>
                <th className="py-2.5 px-3">Exchange</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">24h Change</th>
                <th className="py-2.5 px-3 text-right">Day High / Low</th>
                <th className="py-2.5 px-3 text-right">Volume</th>
                <th className="py-2.5 px-4 text-center">Trend (5D)</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae4da] text-xs">
              {filteredStocks.map((stock) => {
                const isPos = stock.change >= 0;
                return (
                  <tr
                    key={`${stock.exchange}-${stock.symbol}`}
                    className="hover:bg-[#faf8f3] transition-colors group"
                  >
                    {/* Symbol & Name */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-neutral-900 group-hover:text-amber-900 transition-colors flex items-center gap-1.5">
                        <span>{stock.symbol}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-[180px] font-sans">
                        {stock.name}
                      </div>
                    </td>

                    {/* Exchange */}
                    <td className="py-3 px-3">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-[#f0eae0] text-neutral-800 font-mono text-[10px] font-bold">
                        {stock.exchange}
                      </span>
                    </td>

                    {/* Sector */}
                    <td className="py-3 px-3 text-neutral-600 font-sans">
                      <span className="truncate block max-w-[130px] text-[11px]">
                        {stock.sector}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900">
                      <span className="text-[10px] text-neutral-400 font-normal mr-1">
                        {stock.currency}
                      </span>
                      {stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Change */}
                    <td className="py-3 px-3 text-right font-mono font-semibold">
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] ${
                          isPos
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {isPos ? "+" : ""}
                        {stock.change.toFixed(2)} ({isPos ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%)
                      </span>
                    </td>

                    {/* Day Range */}
                    <td className="py-3 px-3 text-right font-mono text-[11px] text-neutral-600">
                      <div className="text-neutral-800">{stock.high?.toFixed(2) || "-"}</div>
                      <div className="text-neutral-400 text-[10px]">{stock.low?.toFixed(2) || "-"}</div>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right font-mono text-neutral-600">
                      {stock.volume}
                    </td>

                    {/* Sparkline Visual */}
                    <td className="py-3 px-4 text-center">
                      {stock.sparkline && stock.sparkline.length > 1 ? (
                        <div className="inline-block w-20 h-6">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 80 24">
                            {(() => {
                              const min = Math.min(...stock.sparkline);
                              const max = Math.max(...stock.sparkline);
                              const range = max - min || 1;
                              const points = stock.sparkline
                                .map((val, i) => {
                                  const x = (i / (stock.sparkline!.length - 1)) * 80;
                                  const y = 20 - ((val - min) / range) * 16;
                                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                                })
                                .join(" ");
                              return (
                                <polyline
                                  fill="none"
                                  stroke={isPos ? "#047857" : "#be123c"}
                                  strokeWidth="1.75"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={points}
                                />
                              );
                            })()}
                          </svg>
                        </div>
                      ) : (
                        <span className="text-neutral-300 text-[10px] font-mono">—</span>
                      )}
                    </td>

                    {/* Action Note */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onAddStockNote(stock)}
                        title={`Create Research Note on ${stock.symbol}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#f5f1e9] hover:bg-neutral-900 hover:text-white text-neutral-700 text-[11px] font-semibold transition-all border border-[#ded7cb]"
                      >
                        <FileEdit className="w-3 h-3" />
                        <span>Note</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
