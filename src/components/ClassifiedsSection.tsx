import React, { useState } from "react";
import {
  FileText,
  DollarSign,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import type { ClassifiedItem } from "../types.js";

interface Props {
  items: ClassifiedItem[];
}

export const ClassifiedsSection: React.FC<Props> = ({ items }) => {
  const [filterType, setFilterType] = useState<string>("all");

  const filtered =
    filterType === "all" ? items : items.filter((item) => item.type === filterType);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "tender":
        return { label: "Procurement Tender", color: "bg-blue-100 text-blue-900 border-blue-200" };
      case "vc_funding":
        return { label: "Venture Capital Round", color: "bg-purple-100 text-purple-900 border-purple-200" };
      case "policy_gazette":
        return { label: "Official Bank Gazette", color: "bg-amber-100 text-amber-900 border-amber-200" };
      case "ipo_filing":
        return { label: "IPO Prospectus", color: "bg-emerald-100 text-emerald-900 border-emerald-200" };
      default:
        return { label: "Classified Notice", color: "bg-neutral-100 text-neutral-900 border-neutral-200" };
    }
  };

  return (
    <div id="classifieds-gazette-view" className="py-6">
      {/* Header Banner */}
      <div className="bg-[#1b1916] text-white p-6 sm:p-8 rounded-lg mb-8 shadow-xs border border-neutral-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="font-cinzel text-xs uppercase tracking-widest text-amber-400 font-bold">
              Official Intelligence Bulletin
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-neutral-100 mt-1">
              Classified Business & Regulatory Gazette
            </h2>
            <p className="font-serif-editorial italic text-neutral-300 text-sm mt-1 max-w-2xl">
              Verified public tenders, venture capital allocations, Central Bank circulars, and IPO prospectuses for institutional participants.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-800/80 p-1 rounded-md border border-neutral-700 text-xs shrink-0">
            <span className="text-neutral-400 px-2 flex items-center gap-1 font-medium">
              <Filter className="w-3 h-3" />
              Filter:
            </span>
            <button
              onClick={() => setFilterType("all")}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === "all" ? "bg-amber-400 text-neutral-950 font-bold" : "text-neutral-300 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("tender")}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === "tender" ? "bg-amber-400 text-neutral-950 font-bold" : "text-neutral-300 hover:text-white"
              }`}
            >
              Tenders
            </button>
            <button
              onClick={() => setFilterType("vc_funding")}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === "vc_funding" ? "bg-amber-400 text-neutral-950 font-bold" : "text-neutral-300 hover:text-white"
              }`}
            >
              VC Rounds
            </button>
            <button
              onClick={() => setFilterType("policy_gazette")}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === "policy_gazette" ? "bg-amber-400 text-neutral-950 font-bold" : "text-neutral-300 hover:text-white"
              }`}
            >
              Gazettes
            </button>
            <button
              onClick={() => setFilterType("ipo_filing")}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === "ipo_filing" ? "bg-amber-400 text-neutral-950 font-bold" : "text-neutral-300 hover:text-white"
              }`}
            >
              IPOs
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Classified Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const badge = getTypeBadge(item.type);
          return (
            <div
              key={item.id}
              className="bg-white border border-[#ded7cb] rounded-lg p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${badge.color}`}
                  >
                    {badge.label}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.status === "Open" || item.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="font-serif-editorial text-lg font-bold text-neutral-900 leading-snug mb-2">
                  {item.title}
                </h3>

                <div className="flex flex-col gap-1 text-xs text-neutral-600 mb-4">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                    <Building className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{item.entity}</span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-neutral-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {item.deadlineOrDate}
                    </span>
                    {item.amountOrSector && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <DollarSign className="w-3 h-3 text-emerald-600" />
                        {item.amountOrSector}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed bg-[#faf8f4] p-3 rounded border border-[#eae3d5]">
                  {item.details}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">Official Notice # {item.id}</span>
                <span className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                  Institutional Filing
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
