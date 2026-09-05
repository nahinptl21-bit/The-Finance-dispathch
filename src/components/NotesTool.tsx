import React, { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Search,
  Download,
  Copy,
  Check,
  Tag,
  ExternalLink,
  X,
  Star,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import type { ResearchNote } from "../types.js";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notes: ResearchNote[];
  onSaveNote: (note: Omit<ResearchNote, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
  onDeleteNote: (id: string) => void;
  initialArticleContext?: { id: string; title: string; source: string; url: string };
  initialStockContext?: { symbol: string; exchange: string; price: number };
}

export const NotesTool: React.FC<Props> = ({
  isOpen,
  onClose,
  notes,
  onSaveNote,
  onDeleteNote,
  initialArticleContext,
  initialStockContext,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [sentiment, setSentiment] = useState<"bullish" | "bearish" | "neutral">("neutral");
  const [isPinned, setIsPinned] = useState(false);
  const [attachedArticle, setAttachedArticle] = useState<{ id: string; title: string; url?: string } | undefined>(
    initialArticleContext
      ? { id: initialArticleContext.id, title: initialArticleContext.title, url: initialArticleContext.url }
      : undefined
  );
  const [attachedStock, setAttachedStock] = useState<string | undefined>(
    initialStockContext ? `${initialStockContext.exchange}:${initialStockContext.symbol}` : undefined
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync initial context if passed
  React.useEffect(() => {
    if (initialArticleContext) {
      setTitle(`Analysis: ${initialArticleContext.title.slice(0, 60)}...`);
      setAttachedArticle({
        id: initialArticleContext.id,
        title: initialArticleContext.title,
        url: initialArticleContext.url,
      });
      setTagsInput("Intelligence, Macro");
      setIsEditing(true);
    }
  }, [initialArticleContext]);

  React.useEffect(() => {
    if (initialStockContext) {
      setTitle(`Equities Insight: ${initialStockContext.exchange}:${initialStockContext.symbol}`);
      setAttachedStock(`${initialStockContext.exchange}:${initialStockContext.symbol}`);
      setTagsInput("Equities, Stock Valuation");
      setIsEditing(true);
    }
  }, [initialStockContext]);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setEditingNoteId(null);
    setTitle("");
    setContent("");
    setTagsInput("");
    setSentiment("neutral");
    setIsPinned(false);
    setAttachedArticle(undefined);
    setAttachedStock(undefined);
    setIsEditing(true);
  };

  const handleStartEdit = (note: ResearchNote) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setTagsInput(note.tags.join(", "));
    setSentiment(note.sentiment || "neutral");
    setIsPinned(!!note.isPinned);
    setAttachedArticle(
      note.articleId
        ? { id: note.articleId, title: note.articleTitle || "Attached Article" }
        : undefined
    );
    setAttachedStock(note.stockSymbol);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSaveNote({
      ...(editingNoteId ? { id: editingNoteId } : {}),
      title: title.trim(),
      content: content.trim(),
      tags: parsedTags.length ? parsedTags : ["Research"],
      sentiment,
      isPinned,
      articleId: attachedArticle?.id,
      articleTitle: attachedArticle?.title,
      stockSymbol: attachedStock,
    });

    setIsEditing(false);
    setEditingNoteId(null);
    setTitle("");
    setContent("");
    setTagsInput("");
  };

  const handleCopyNote = (note: ResearchNote) => {
    const text = `# ${note.title}\n\n${note.content}\n\nTags: ${note.tags.join(", ")}${
      note.articleTitle ? `\nReference: ${note.articleTitle}` : ""
    }${note.stockSymbol ? `\nTicker: ${note.stockSymbol}` : ""}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAllNotes = () => {
    const markdown = notes
      .map(
        (n) =>
          `# ${n.title}\n*Created: ${new Date(n.createdAt).toLocaleDateString()}* | *Sentiment: ${
            n.sentiment || "neutral"
          }*\n\n${n.content}\n\n**Tags**: ${n.tags.join(", ")}${
            n.articleTitle ? `\n**Source Ref**: ${n.articleTitle}` : ""
          }${n.stockSymbol ? `\n**Ticker**: ${n.stockSymbol}` : ""}\n\n---\n`
      )
      .join("\n");

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FinancialDispatch_ResearchNotes_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Collect all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTagFilter === "all" || n.tags.includes(selectedTagFilter);

    return matchesSearch && matchesTag;
  });

  // Sort pinned first, then updated at desc
  filteredNotes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div
      id="notes-tool-overlay"
      className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={onClose}
    >
      <div
        id="notes-tool-drawer"
        className="w-full max-w-xl bg-[#fcfbf8] h-full shadow-2xl flex flex-col border-l border-[#ded7cb] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-[#f5f1e9] border-b border-[#ded7cb] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-editorial text-lg font-bold text-neutral-900 leading-tight">
                Analyst Research Desk
              </h2>
              <p className="text-xs text-neutral-500 font-sans">
                Due diligence dossiers, market theses & investment memos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && notes.length > 0 && (
              <button
                onClick={handleExportAllNotes}
                title="Export all notes as Markdown"
                className="p-1.5 rounded text-xs text-neutral-600 hover:text-neutral-900 hover:bg-[#eae3d5] transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-xs text-neutral-500 hover:text-neutral-900 hover:bg-[#eae3d5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action / Search Bar */}
        <div className="p-4 border-b border-[#eae4da] bg-white space-y-3">
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                id="notes-create-btn"
                onClick={handleStartCreate}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Research Note</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold transition-all"
              >
                <span>Cancel Editing</span>
              </button>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter notes by company, theme, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#fbf9f5] border border-[#d9d1c5] rounded text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                />
              </div>

              {allTags.length > 0 && (
                <select
                  value={selectedTagFilter}
                  onChange={(e) => setSelectedTagFilter(e.target.value)}
                  className="bg-[#fbf9f5] border border-[#d9d1c5] rounded py-1.5 px-2 text-xs text-neutral-700 focus:outline-none"
                >
                  <option value="all">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      #{tag}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Note Editor Form */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-white border border-[#ded7cb] rounded-lg p-4 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="font-serif-editorial text-sm font-bold text-neutral-800">
                  {editingNoteId ? "Edit Research Note" : "New Intelligence Note"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors ${
                    isPinned ? "bg-amber-100 text-amber-900 font-semibold" : "text-neutral-500 hover:bg-neutral-100"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isPinned ? "fill-amber-600 text-amber-600" : ""}`} />
                  <span>{isPinned ? "Pinned" : "Pin Note"}</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bangladesh Bank Liquidity Impact on Private Banks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#fcfbf8] border border-[#d9d1c5] rounded text-sm text-neutral-900 font-medium focus:outline-none focus:ring-1 focus:ring-neutral-800"
                />
              </div>

              {/* Context Attachments */}
              {(attachedArticle || attachedStock) && (
                <div className="p-2.5 rounded bg-[#f5f1e9] border border-[#ded7cb] text-xs space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-neutral-500 tracking-wider">
                    Attached Intelligence Anchor
                  </span>
                  {attachedArticle && (
                    <div className="flex items-center justify-between gap-2 text-neutral-800 font-medium">
                      <span className="truncate">📰 {attachedArticle.title}</span>
                      <button
                        type="button"
                        onClick={() => setAttachedArticle(undefined)}
                        className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {attachedStock && (
                    <div className="flex items-center justify-between gap-2 text-neutral-800 font-medium">
                      <span>📈 Equities: {attachedStock}</span>
                      <button
                        type="button"
                        onClick={() => setAttachedStock(undefined)}
                        className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Sentiment & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Market Sentiment
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-[#f5f1e9] p-1 rounded">
                    <button
                      type="button"
                      onClick={() => setSentiment("bullish")}
                      className={`py-1 text-xs font-semibold rounded flex items-center justify-center gap-1 transition-all ${
                        sentiment === "bullish" ? "bg-emerald-700 text-white shadow-xs" : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" /> Bullish
                    </button>
                    <button
                      type="button"
                      onClick={() => setSentiment("neutral")}
                      className={`py-1 text-xs font-semibold rounded flex items-center justify-center gap-1 transition-all ${
                        sentiment === "neutral" ? "bg-neutral-800 text-white shadow-xs" : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <Minus className="w-3 h-3" /> Neutral
                    </button>
                    <button
                      type="button"
                      onClick={() => setSentiment("bearish")}
                      className={`py-1 text-xs font-semibold rounded flex items-center justify-center gap-1 transition-all ${
                        sentiment === "bearish" ? "bg-rose-700 text-white shadow-xs" : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <TrendingDown className="w-3 h-3" /> Bearish
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Categorical Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Equities, Banking, Tax, FDI (comma separated)"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#fcfbf8] border border-[#d9d1c5] rounded text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                  />
                </div>
              </div>

              {/* Note Content */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Analysis & Findings
                </label>
                <textarea
                  rows={8}
                  placeholder="Record your financial assessment, key valuation triggers, policy impacts, or investment hypothesis..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#fcfbf8] border border-[#d9d1c5] rounded text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  {editingNoteId ? "Save Changes" : "Save Note"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#eae3d5] text-neutral-500 mx-auto flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-editorial text-base font-bold text-neutral-800">
                    No Research Notes Found
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Record your proprietary insights, valuation theses, or regulatory takeaways as you review South Asian and global business reports.
                  </p>
                  <button
                    onClick={handleStartCreate}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Your First Note</span>
                  </button>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white border border-[#ded7cb] rounded-lg p-4 space-y-2.5 shadow-xs hover:border-neutral-800 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {note.isPinned && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                              <Star className="w-3 h-3 fill-amber-600 text-amber-600" />
                              PINNED
                            </span>
                          )}
                          {note.sentiment && (
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                                note.sentiment === "bullish"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : note.sentiment === "bearish"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-neutral-100 text-neutral-700"
                              }`}
                            >
                              {note.sentiment}
                            </span>
                          )}
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {new Date(note.updatedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <h3 className="font-serif-editorial text-sm font-bold text-neutral-900 leading-snug">
                          {note.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyNote(note)}
                          title="Copy Note text"
                          className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                        >
                          {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleStartEdit(note)}
                          title="Edit Note"
                          className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          title="Delete Note"
                          className="p-1 rounded text-neutral-400 hover:text-rose-600 hover:bg-neutral-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line font-sans">
                      {note.content}
                    </p>

                    {/* Associated Context */}
                    {(note.articleTitle || note.stockSymbol) && (
                      <div className="pt-2 border-t border-neutral-100 flex items-center gap-3 text-[11px] text-neutral-500">
                        {note.articleTitle && (
                          <span className="truncate flex items-center gap-1 max-w-[280px]">
                            <span className="font-semibold text-neutral-700">Ref:</span>
                            {note.articleTitle}
                          </span>
                        )}
                        {note.stockSymbol && (
                          <span className="bg-[#f0eae0] text-neutral-800 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                            {note.stockSymbol}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {note.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#f5f1e9] text-neutral-600 px-1.5 py-0.5 rounded font-mono"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
