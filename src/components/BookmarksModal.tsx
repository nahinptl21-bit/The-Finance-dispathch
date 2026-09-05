import React from "react";
import { Bookmark, X, ExternalLink, Trash2, Clock, Sparkles } from "lucide-react";
import type { NewsArticle } from "../types.js";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (article: NewsArticle) => void;
}

export const BookmarksModal: React.FC<Props> = ({
  isOpen,
  onClose,
  bookmarkedArticles,
  onSelectArticle,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="bookmarks-drawer-modal"
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end"
    >
      <div className="bg-[#fbf9f5] w-full max-w-md h-full shadow-2xl border-l border-[#ded7cb] flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 bg-[#1b1916] text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider">
              Saved Intelligence Briefings
            </h3>
            <span className="bg-amber-500 text-neutral-950 font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {bookmarkedArticles.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Bookmarks */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarkedArticles.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No saved briefings yet</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Click the bookmark icon on any news report or policy circular to store it here for future executive reference.
              </p>
            </div>
          ) : (
            bookmarkedArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white border border-[#ded7cb] p-4 rounded-lg shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5">
                    <span className="font-bold text-amber-900 uppercase tracking-wider">
                      {article.source} • {article.category}
                    </span>
                    <button
                      onClick={() => onRemoveBookmark(article)}
                      title="Remove from saved"
                      className="text-neutral-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="font-serif-editorial text-sm font-bold text-neutral-900 hover:text-amber-900 cursor-pointer leading-snug mb-2"
                  >
                    {article.title}
                  </h4>

                  <p className="text-xs text-neutral-600 line-clamp-2 mb-3">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-amber-800 font-semibold hover:underline text-[11px]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>View AI Briefing</span>
                  </button>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-neutral-800"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f4ece0] border-t border-[#ded7cb] text-center text-xs text-neutral-600">
          Saved intelligence persists locally on your device
        </div>
      </div>
    </div>
  );
};
