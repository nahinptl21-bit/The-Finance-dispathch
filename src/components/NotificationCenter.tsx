import React from "react";
import {
  Bell,
  X,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  Sparkles,
} from "lucide-react";
import type { NotificationItem, NewsArticle, UserPreferences } from "../types.js";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onSelectNotification: (articleId: string) => void;
  onClearAll: () => void;
  preferences: UserPreferences;
  onToggleSound: () => void;
  onRequestPushPermission: () => void;
  pushPermissionState: NotificationPermission | "unsupported";
  onSendSimulationPush: () => void;
}

export const NotificationCenter: React.FC<Props> = ({
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onClearAll,
  preferences,
  onToggleSound,
  onRequestPushPermission,
  pushPermissionState,
  onSendSimulationPush,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="notification-center-drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end"
    >
      <div className="bg-[#fbf9f5] w-full max-w-md h-full shadow-2xl border-l border-[#ded7cb] flex flex-col justify-between">
        {/* Top Header */}
        <div className="p-4 bg-[#1b1916] text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider">
              Breaking Intelligence Wire
            </h3>
            <span className="bg-rose-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full">
              {notifications.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Notification Controls & Diagnostics */}
        <div className="p-4 bg-[#f4ece0] border-b border-[#e5dfd4] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-800">Browser Web Push</span>
            <div className="flex items-center gap-1.5">
              {pushPermissionState === "granted" ? (
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Authorized
                </span>
              ) : pushPermissionState === "denied" ? (
                <span className="flex items-center gap-1 text-rose-700 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Blocked in browser
                </span>
              ) : (
                <button
                  onClick={onRequestPushPermission}
                  className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                >
                  <Radio className="w-3 h-3 text-amber-400" />
                  Enable Push
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#ded7cb]">
            <span className="text-neutral-700">Audio Wire Chime</span>
            <button
              onClick={onToggleSound}
              className={`flex items-center gap-1 px-2 py-0.5 rounded font-medium ${
                preferences.soundEnabled
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {preferences.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{preferences.soundEnabled ? "Active" : "Muted"}</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              id="test-breaking-push-btn"
              onClick={onSendSimulationPush}
              className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Real-time Breaking Push Alert</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No unread notifications</p>
              <p className="text-xs text-neutral-500 mt-1">
                You will be alerted instantly when market-moving news or central bank notices break.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNotification(n.articleId)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all hover:shadow-xs ${
                  n.read
                    ? "bg-white border-[#ded7cb] text-neutral-700 opacity-80"
                    : "bg-amber-50/60 border-amber-300 text-neutral-950 font-medium"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                  <span className="font-bold text-amber-800 uppercase tracking-wider">
                    {n.source} • {n.category}
                  </span>
                  <span>{n.time}</span>
                </div>
                <h4 className="font-serif-editorial text-sm font-bold leading-snug">
                  {n.title}
                </h4>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 bg-[#f4ece0] border-t border-[#ded7cb] flex justify-between items-center text-xs">
            <span className="text-neutral-600">{notifications.length} total alerts</span>
            <button
              onClick={onClearAll}
              className="text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
