import React, { useState, useEffect } from "react";
import {
  Bell,
  Bookmark,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Radio,
  ExternalLink,
} from "lucide-react";
import type { UserPreferences } from "../types.js";

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNotifications: () => void;
  onOpenBookmarks: () => void;
  onRefreshFeeds: () => void;
  isRefreshing: boolean;
  unreadNotificationsCount: number;
  bookmarksCount: number;
  preferences: UserPreferences;
  onToggleSound: () => void;
  onRequestPushPermission: () => void;
  pushPermissionState: NotificationPermission | "unsupported";
}

export const Header: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  onOpenBookmarks,
  onRefreshFeeds,
  isRefreshing,
  unreadNotificationsCount,
  bookmarksCount,
  preferences,
  onToggleSound,
  onRequestPushPermission,
  pushPermissionState,
}) => {
  const [dhakaTime, setDhakaTime] = useState<string>("");
  const [gmtTime, setGmtTime] = useState<string>("");

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      // Dhaka is UTC+6
      setDhakaTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }) + " BST"
      );
      // London / GMT
      setGmtTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }) + " GMT"
      );
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header id="main-editorial-header" className="bg-[#fbf9f5] border-b border-[#e5dfd5]">
      {/* Top utility row: Timezones, Date, Volume, Audio Toggle */}
      <div className="border-b border-[#eae4da] text-xs text-[#5a544b] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="font-serif-editorial italic text-neutral-800 font-medium">
              {todayDateStr}
            </span>
            <span className="hidden md:inline text-neutral-300">•</span>
            <span className="hidden md:flex items-center gap-1 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              <span>Dhaka: {dhakaTime || "Loading..."}</span>
            </span>
            <span className="hidden lg:inline text-neutral-300">•</span>
            <span className="hidden lg:inline font-mono text-[11px] text-neutral-500">
              London: {gmtTime}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio alerts toggle */}
            <button
              id="header-toggle-sound-btn"
              onClick={onToggleSound}
              title={preferences.soundEnabled ? "Audio Chime Enabled" : "Audio Chime Muted"}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] hover:bg-[#efe9dd] transition-colors"
            >
              {preferences.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              )}
              <span className="hidden sm:inline">
                {preferences.soundEnabled ? "Chime On" : "Chime Muted"}
              </span>
            </button>

            {/* Push notification permission trigger */}
            {pushPermissionState !== "granted" && (
              <button
                id="header-push-permission-btn"
                onClick={onRequestPushPermission}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[11px] font-medium hover:bg-amber-200 transition-colors"
              >
                <Radio className="w-3 h-3 text-amber-700 animate-pulse" />
                <span>Enable Push Alerts</span>
              </button>
            )}

            {pushPermissionState === "granted" && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Push Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Masthead Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#23201c] pb-4">
          {/* Left: Edition details */}
          <div className="hidden md:block text-left text-[11px] text-[#71695f] leading-relaxed max-w-[210px]">
            <p className="font-semibold text-neutral-800 uppercase tracking-widest text-[10px]">
              Classified Gazette
            </p>
            <p>Independent real-time financial reporting connecting Dhaka to global capital centers.</p>
          </div>

          {/* Center: Authoritative Masthead Logo */}
          <div className="text-center">
            <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#161412] uppercase">
              The Financial Dispatch
            </h1>
            <p className="font-serif-editorial italic text-xs sm:text-sm text-[#665e53] mt-1 tracking-wide">
              Bangladesh & Global Business Intelligence • Venture • Investment • Policy Gazette
            </p>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2">
            {/* Sync Feeds Pipeline */}
            <button
              id="header-sync-feeds-btn"
              onClick={onRefreshFeeds}
              disabled={isRefreshing}
              title="Poll live RSS feeds from Bangladeshi and Global media"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#d9d1c5] bg-white hover:bg-[#f5f1e9] text-[#3c3731] text-xs font-medium transition-all shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-amber-600" : ""}`} />
              <span className="hidden sm:inline">{isRefreshing ? "Ingesting..." : "Sync Live Feeds"}</span>
            </button>

            {/* Bookmarks */}
            <button
              id="header-bookmarks-btn"
              onClick={onOpenBookmarks}
              title="Saved Intelligence Briefings"
              className="relative p-2 rounded border border-[#d9d1c5] bg-white hover:bg-[#f5f1e9] text-[#3c3731] transition-all shadow-xs"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-neutral-800 text-white font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Notification Center */}
            <button
              id="header-notification-center-btn"
              onClick={onOpenNotifications}
              title="Breaking News & Push Notification Center"
              className="relative p-2 rounded border border-[#d9d1c5] bg-white hover:bg-[#f5f1e9] text-[#3c3731] transition-all shadow-xs"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search and Quick Filters Strip */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              id="header-search-input"
              type="text"
              placeholder="Search companies, policy, DSEX, startups..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-[#d9d1c5] rounded text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto w-full sm:w-auto py-1">
            <span className="font-semibold text-neutral-700 text-[11px] shrink-0 uppercase tracking-wider">
              Connected Wires:
            </span>
            <span className="px-2 py-0.5 rounded bg-[#f0eae0] text-neutral-700 text-[11px] shrink-0 font-medium">
              The Daily Star
            </span>
            <span className="px-2 py-0.5 rounded bg-[#f0eae0] text-neutral-700 text-[11px] shrink-0 font-medium">
              Financial Express BD
            </span>
            <span className="px-2 py-0.5 rounded bg-[#f0eae0] text-neutral-700 text-[11px] shrink-0 font-medium">
              TBS News
            </span>
            <span className="px-2 py-0.5 rounded bg-[#f0eae0] text-neutral-700 text-[11px] shrink-0 font-medium">
              Dhaka Tribune
            </span>
            <span className="px-2 py-0.5 rounded bg-[#f0eae0] text-neutral-700 text-[11px] shrink-0 font-medium">
              Reuters & CNBC
            </span>
            <span className="px-2 py-0.5 rounded bg-[#f0eae0] text-neutral-700 text-[11px] shrink-0 font-medium">
              TechCrunch
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
