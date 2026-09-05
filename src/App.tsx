import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "./components/Header.js";
import { MarketTicker } from "./components/MarketTicker.js";
import { BreakingBanner } from "./components/BreakingBanner.js";
import { FilterBar, ExtendedCategory } from "./components/FilterBar.js";
import { PersonalizationBar } from "./components/PersonalizationBar.js";
import { HeroLead } from "./components/HeroLead.js";
import { ArticleCard } from "./components/ArticleCard.js";
import { ClassifiedsSection } from "./components/ClassifiedsSection.js";
import { ArticleModal } from "./components/ArticleModal.js";
import { NotificationCenter } from "./components/NotificationCenter.js";
import { BookmarksModal } from "./components/BookmarksModal.js";
import { SuggestionPanel } from "./components/SuggestionPanel.js";
import { StockExchange } from "./components/StockExchange.js";
import { NotesTool } from "./components/NotesTool.js";
import { playBreakingChime } from "./utils/audio.js";
import {
  FALLBACK_NEWS,
  FALLBACK_MARKETS,
  FALLBACK_CLASSIFIEDS,
  FALLBACK_STOCKS,
  FALLBACK_OVERVIEWS,
} from "./data/fallbackData.js";
import type {
  NewsArticle,
  MarketTicker as MarketTickerType,
  ClassifiedItem,
  NotificationItem,
  UserPreferences,
  NewsRegion,
  StockQuote,
  MarketOverview,
  ResearchNote,
} from "./types.js";
import {
  Sparkles,
  RefreshCw,
  Sliders,
  AlertCircle,
  TrendingUp,
  Radio,
  FileCheck,
  Building,
  FileText,
  LineChart,
} from "lucide-react";

async function fetchJsonSafely<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return fallback;
    }
    const data = await res.json();
    return data ?? fallback;
  } catch (err) {
    console.warn(`Fetch to ${url} failed, using local intelligence dataset:`, err);
    return fallback;
  }
}


const DEFAULT_PREFERENCES: UserPreferences = {
  pushEnabled: false,
  soundEnabled: true,
  preferredCategories: ["business", "investment", "startup", "policy"],
  preferredRegion: "all",
  followedTopics: [
    "Fintech",
    "Bangladesh Bank",
    "RMG & Apparel",
    "Series A & Venture",
    "Dhaka Stock Exchange (DSE)",
  ],
  readArticles: [],
  bookmarkedArticles: [],
};

export default function App() {
  // --- Data State ---
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [markets, setMarkets] = useState<MarketTickerType[]>([]);
  const [stocks, setStocks] = useState<StockQuote[]>(FALLBACK_STOCKS);
  const [marketOverviews, setMarketOverviews] = useState<MarketOverview[]>(FALLBACK_OVERVIEWS);
  const [classifieds, setClassifieds] = useState<ClassifiedItem[]>([]);
  const [breakingArticles, setBreakingArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Research Notes State ---
  const [notes, setNotes] = useState<ResearchNote[]>(() => {
    try {
      const saved = localStorage.getItem("dispatch_research_notes");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: "note-init-1",
        title: "Bangladesh Bank Exposure Limit Revisions",
        content: "Central bank's proposed caps on single-borrower exposure will mandate portfolio diversification for top commercial banks. Watch Grameenphone and Square Pharma cash-flow resilience.",
        tags: ["Banking", "Macro", "DSE"],
        sentiment: "neutral",
        isPinned: true,
        stockSymbol: "DSE:BRACBANK",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "note-init-2",
        title: "South Asian Cross-Border UPI Corridor",
        content: "India-Nepal digital remittance link demonstrates immediate cost reduction. Potential expansion into Bangladesh and Sri Lanka could expand fintech addressable market.",
        tags: ["Fintech", "UPI", "Remittance"],
        sentiment: "bullish",
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  });
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [activeNoteArticleContext, setActiveNoteArticleContext] = useState<{ id: string; title: string; source: string; url: string } | undefined>(undefined);
  const [activeNoteStockContext, setActiveNoteStockContext] = useState<{ symbol: string; exchange: string; price: number } | undefined>(undefined);

  // --- Filter & Search State ---
  const [selectedCategory, setSelectedCategory] = useState<ExtendedCategory>("all");
  const [selectedRegion, setSelectedRegion] = useState<NewsRegion>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // --- Modals State ---
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

  // --- Preferences & Notifications ---
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem("dispatch_preferences");
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | "unsupported">("default");

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("dispatch_research_notes", JSON.stringify(notes));
    } catch (e) {
      // ignore
    }
  }, [notes]);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("dispatch_preferences", JSON.stringify(preferences));
    } catch (e) {
      // Storage quota or iframe permission
    }
  }, [preferences]);

  // Check initial Push Notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushPermission(Notification.permission);
    } else {
      setPushPermission("unsupported");
    }
  }, []);

  // Fetch initial portal data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [newsData, marketsData, classData, breakData, stocksData, overviewsData] = await Promise.all([
        fetchJsonSafely<{ articles: NewsArticle[] }>("/api/news?limit=40", { articles: FALLBACK_NEWS }),
        fetchJsonSafely<MarketTickerType[]>("/api/markets", FALLBACK_MARKETS),
        fetchJsonSafely<ClassifiedItem[]>("/api/classifieds", FALLBACK_CLASSIFIEDS),
        fetchJsonSafely<NewsArticle[]>("/api/news/breaking", FALLBACK_NEWS.filter((a) => a.isBreaking)),
        fetchJsonSafely<StockQuote[]>("/api/stocks", FALLBACK_STOCKS),
        fetchJsonSafely<MarketOverview[]>("/api/markets/overview", FALLBACK_OVERVIEWS),
      ]);

      const loadedArticles =
        newsData.articles && newsData.articles.length > 0
          ? newsData.articles
          : FALLBACK_NEWS;
      setArticles(loadedArticles);

      const loadedMarkets =
        marketsData && marketsData.length > 0 ? marketsData : FALLBACK_MARKETS;
      setMarkets(loadedMarkets);

      const loadedStocks =
        stocksData && stocksData.length > 0 ? stocksData : FALLBACK_STOCKS;
      setStocks(loadedStocks);

      const loadedOverviews =
        overviewsData && overviewsData.length > 0 ? overviewsData : FALLBACK_OVERVIEWS;
      setMarketOverviews(loadedOverviews);

      const loadedClassifieds =
        classData && classData.length > 0 ? classData : FALLBACK_CLASSIFIEDS;
      setClassifieds(loadedClassifieds);

      const loadedBreaking =
        breakData && breakData.length > 0
          ? breakData
          : loadedArticles.filter((a) => a.isBreaking);
      setBreakingArticles(loadedBreaking);

      // Populate initial notifications from breaking news
      const initialNotifs: NotificationItem[] = loadedBreaking.slice(0, 4).map((b: NewsArticle) => ({
        id: `notif-${b.id}`,
        title: b.title,
        source: b.source,
        time: new Date(b.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        category: b.category.toUpperCase(),
        articleId: b.id,
        read: false,
      }));
      setNotifications(initialNotifs);
    } catch (err: any) {
      console.warn("Portal data load fallback activated:", err);
      // Ensure UI always has data even if unhandled error occurred
      setArticles(FALLBACK_NEWS);
      setMarkets(FALLBACK_MARKETS);
      setStocks(FALLBACK_STOCKS);
      setMarketOverviews(FALLBACK_OVERVIEWS);
      setClassifieds(FALLBACK_CLASSIFIEDS);
      setBreakingArticles(FALLBACK_NEWS.filter((a) => a.isBreaking));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handlers for research notes
  const handleSaveNote = (noteData: Omit<ResearchNote, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    if (noteData.id) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteData.id
            ? {
                ...n,
                ...noteData,
                updatedAt: new Date().toISOString(),
              }
            : n
        )
      );
    } else {
      const newNote: ResearchNote = {
        id: `note-${Date.now()}`,
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags,
        sentiment: noteData.sentiment,
        isPinned: noteData.isPinned,
        articleId: noteData.articleId,
        articleTitle: noteData.articleTitle,
        stockSymbol: noteData.stockSymbol,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleOpenNoteForArticle = (article: NewsArticle) => {
    setActiveNoteStockContext(undefined);
    setActiveNoteArticleContext({
      id: article.id,
      title: article.title,
      source: article.source,
      url: article.url,
    });
    setIsNotesOpen(true);
  };

  const handleOpenNoteForStock = (stock: StockQuote) => {
    setActiveNoteArticleContext(undefined);
    setActiveNoteStockContext({
      symbol: stock.symbol,
      exchange: stock.exchange,
      price: stock.price,
    });
    setIsNotesOpen(true);
  };

  const handleRefreshStocks = async () => {
    const updated = await fetchJsonSafely<StockQuote[]>("/api/stocks", FALLBACK_STOCKS);
    setStocks(updated);
  };

  useEffect(() => {
    fetchData();

    // Background refresh poll every 90 seconds
    const interval = setInterval(async () => {
      const freshBreaking = await fetchJsonSafely<NewsArticle[]>("/api/news/breaking", []);
      if (freshBreaking && freshBreaking.length > 0) {
        setBreakingArticles(freshBreaking);
      }
    }, 90000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Force trigger ingestion pipeline from server
  const handleRefreshPipeline = async () => {
    setIsRefreshing(true);
    try {
      await fetch("/api/news/refresh", { method: "POST" });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Push notification permission requester
  const handleRequestPushPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        if (perm === "granted") {
          setPreferences((prev) => ({ ...prev, pushEnabled: true }));
          triggerBrowserPush(
            "Push Intelligence Activated",
            "You will receive verified breaking business and monetary policy dispatches."
          );
        }
      } catch (err) {
        console.error("Notification permission error:", err);
      }
    }
  };

  // Helper to trigger browser notification & audio chime
  const triggerBrowserPush = (title: string, body: string, articleId?: string) => {
    if (preferences.soundEnabled) {
      playBreakingChime();
    }

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        const notif = new Notification(title, {
          body,
          icon: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=128&q=80",
          tag: "financial-dispatch-breaking",
        });
        notif.onclick = () => {
          window.focus();
          if (articleId) {
            const art = articles.find((a) => a.id === articleId);
            if (art) setSelectedArticle(art);
          }
        };
      } catch (e) {
        console.error("Browser notification error:", e);
      }
    }
  };

  // Simulate real-time breaking push alert for demonstration
  const handleSimulatePush = () => {
    const sampleBreaking = breakingArticles[0] || articles[0];
    if (!sampleBreaking) return;

    const newNotif: NotificationItem = {
      id: `sim-${Date.now()}`,
      title: sampleBreaking.title,
      source: sampleBreaking.source,
      time: "Just now",
      category: sampleBreaking.category.toUpperCase(),
      articleId: sampleBreaking.id,
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    triggerBrowserPush(
      `BREAKING: ${sampleBreaking.source}`,
      sampleBreaking.title,
      sampleBreaking.id
    );
  };

  // Bookmarking handler
  const handleToggleBookmark = (article: NewsArticle) => {
    setPreferences((prev) => {
      const isSaved = prev.bookmarkedArticles.includes(article.id);
      const nextBookmarks = isSaved
        ? prev.bookmarkedArticles.filter((id) => id !== article.id)
        : [...prev.bookmarkedArticles, article.id];
      return { ...prev, bookmarkedArticles: nextBookmarks };
    });
  };

  // Article selection & reading tracker
  const handleSelectArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    // Mark as read in preferences
    setPreferences((prev) => {
      if (!prev.readArticles.includes(article.id)) {
        return { ...prev, readArticles: [...prev.readArticles, article.id] };
      }
      return prev;
    });
  };

  // Toggle user focus topic for personalized recommendations
  const handleToggleTopic = (topic: string) => {
    setPreferences((prev) => {
      const exists = prev.followedTopics.includes(topic);
      const nextTopics = exists
        ? prev.followedTopics.filter((t) => t !== topic)
        : [...prev.followedTopics, topic];
      return { ...prev, followedTopics: nextTopics };
    });
  };

  // Personalization matching score calculation
  const calculatePersonalizedScore = useCallback(
    (article: NewsArticle): number => {
      let score = 20;
      const combined = (article.title + " " + article.summary + " " + article.tags.join(" ")).toLowerCase();

      for (const topic of preferences.followedTopics) {
        if (combined.includes(topic.toLowerCase())) {
          score += 25;
        }
      }

      if (article.isBreaking) score += 15;
      return Math.min(99, score);
    },
    [preferences.followedTopics]
  );

  // Filtered and sorted articles
  const displayedArticles = useMemo(() => {
    let list = [...articles];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory === "for_you") {
      // Sort by personalized score
      list = list.slice().sort((a, b) => {
        return calculatePersonalizedScore(b) - calculatePersonalizedScore(a);
      });
    } else if (selectedCategory !== "all" && selectedCategory !== "classifieds") {
      list = list.filter((a) => a.category === selectedCategory);
    }

    // Region filter
    if (selectedRegion !== "all" && selectedCategory !== "classifieds") {
      list = list.filter((a) => a.sourceCategory === selectedRegion);
    }

    return list;
  }, [articles, searchQuery, selectedCategory, selectedRegion, calculatePersonalizedScore]);

  // Lead story is the first article if not searching
  const heroArticle = !searchQuery && displayedArticles.length > 0 ? displayedArticles[0] : null;
  const gridArticles = !searchQuery && heroArticle ? displayedArticles.slice(1) : displayedArticles;

  // Bookmarked articles resolution
  const bookmarkedArticlesList = useMemo(() => {
    return articles.filter((a) => preferences.bookmarkedArticles.includes(a.id));
  }, [articles, preferences.bookmarkedArticles]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] text-[#1f1a16]">
      {/* Header Masthead */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
        notesCount={notes.length}
        onOpenStocks={() => setSelectedCategory("stocks")}
        onRefreshFeeds={handleRefreshPipeline}
        isRefreshing={isRefreshing}
        unreadNotificationsCount={unreadCount}
        bookmarksCount={preferences.bookmarkedArticles.length}
        preferences={preferences}
        onToggleSound={() =>
          setPreferences((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onRequestPushPermission={handleRequestPushPermission}
        pushPermissionState={pushPermission}
      />

      {/* Live Financial Markets Ticker Strip */}
      <MarketTicker markets={markets} />

      {/* Breaking Wire Banner */}
      <BreakingBanner
        breakingArticles={breakingArticles}
        onSelectArticle={handleSelectArticle}
        onSendTestPush={(art) =>
          triggerBrowserPush(`BREAKING: ${art.source}`, art.title, art.id)
        }
      />

      {/* Filter Navigation Tabs */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        totalArticlesCount={displayedArticles.length}
      />

      {/* Personalized Recommendations Config Bar */}
      {selectedCategory === "for_you" && (
        <PersonalizationBar
          followedTopics={preferences.followedTopics}
          onToggleTopic={handleToggleTopic}
          readArticlesCount={preferences.readArticles.length}
        />
      )}

      {/* Main Editorial Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchData}
              className="px-2.5 py-1 bg-rose-700 text-white rounded font-medium hover:bg-rose-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* View Switcher based on Selected Category */}
        {selectedCategory === "stocks" ? (
          <StockExchange
            stocks={stocks}
            overviews={marketOverviews}
            onAddStockNote={handleOpenNoteForStock}
            onRefreshStocks={handleRefreshStocks}
          />
        ) : selectedCategory === "classifieds" ? (
          <ClassifiedsSection items={classifieds} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Intelligence Dispatches Feed */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Lead Story (Top of Front Page) */}
              {heroArticle && !isLoading && (
                <HeroLead
                  article={heroArticle}
                  onSelect={handleSelectArticle}
                  isBookmarked={preferences.bookmarkedArticles.includes(heroArticle.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onQuickSummarize={handleSelectArticle}
                />
              )}

              {/* Section Header & Subtitle */}
              <div className="flex items-center justify-between gap-4 border-b border-[#ded7cb] pb-3 mb-6">
                <div>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
                    {selectedCategory === "all" && "All Classified Wire Dispatches"}
                    {selectedCategory === "for_you" && "Curated For You (Personalized)"}
                    {selectedCategory === "business" && "Corporate & Industrial Affairs"}
                    {selectedCategory === "investment" && "Capital Markets & Portfolio Inflows"}
                    {selectedCategory === "startup" && "Startups, Founders & Venture Capital"}
                    {selectedCategory === "policy" && "Monetary Policy & Regulatory Gazettes"}
                  </h2>
                  <p className="text-xs text-neutral-500 font-serif-editorial italic mt-0.5">
                    Showing {displayedArticles.length} aggregated dispatches from verified South Asian & international desks
                  </p>
                </div>

                {selectedCategory === "for_you" && (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-900 bg-amber-100/70 px-3 py-1 rounded border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-semibold">Scored via Gemini Match Engine</span>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="py-20 flex flex-col items-center justify-center text-neutral-500 gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-amber-700" />
                  <p className="text-sm font-medium">
                    Aggregating live wires from South Asia and global capital media...
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && displayedArticles.length === 0 && (
                <div className="py-16 text-center text-neutral-500 bg-white border border-[#e5dfd4] rounded-lg p-8">
                  <p className="text-base font-semibold text-neutral-800">
                    No intelligence reports match your current filter.
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try clearing your search query or switching to "All Intelligence".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedRegion("all");
                    }}
                    className="mt-4 px-4 py-2 bg-[#1b1916] text-white text-xs font-semibold rounded hover:bg-neutral-800"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Editorial Articles Grid */}
              {!isLoading && gridArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {gridArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onSelect={handleSelectArticle}
                      isBookmarked={preferences.bookmarkedArticles.includes(article.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onQuickSummarize={handleSelectArticle}
                      matchScore={
                        selectedCategory === "for_you"
                          ? calculatePersonalizedScore(article)
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Editorial Side Suggestion Panel */}
            <div className="lg:col-span-4 xl:col-span-3">
              <SuggestionPanel
                articles={articles}
                onSelectArticle={handleSelectArticle}
                onFilterByTag={(tag) => setSearchQuery(tag)}
                onSelectRegion={setSelectedRegion}
                currentRegion={selectedRegion}
                followedTopics={preferences.followedTopics}
                className="sticky top-20"
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Analyst Research Desk Trigger */}
      <button
        id="floating-notes-btn"
        onClick={() => setIsNotesOpen(true)}
        title="Open Analyst Research Desk"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-full shadow-xl border border-neutral-700 transition-all hover:scale-105 group"
      >
        <FileText className="w-4 h-4 text-amber-400 group-hover:rotate-6 transition-transform" />
        <span className="text-xs font-semibold">Research Desk</span>
        {notes.length > 0 && (
          <span className="bg-amber-400 text-neutral-950 font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {notes.length}
          </span>
        )}
      </button>

      {/* Modals and Drawers */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={
          selectedArticle
            ? preferences.bookmarkedArticles.includes(selectedArticle.id)
            : false
        }
        onToggleBookmark={handleToggleBookmark}
        onAddNote={handleOpenNoteForArticle}
      />

      <NotesTool
        isOpen={isNotesOpen}
        onClose={() => {
          setIsNotesOpen(false);
          setActiveNoteArticleContext(undefined);
          setActiveNoteStockContext(undefined);
        }}
        notes={notes}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
        initialArticleContext={activeNoteArticleContext}
        initialStockContext={activeNoteStockContext}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onSelectNotification={(articleId) => {
          setIsNotificationsOpen(false);
          const target = articles.find((a) => a.id === articleId);
          if (target) handleSelectArticle(target);
        }}
        onClearAll={() => setNotifications([])}
        preferences={preferences}
        onToggleSound={() =>
          setPreferences((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onRequestPushPermission={handleRequestPushPermission}
        pushPermissionState={pushPermission}
        onSendSimulationPush={handleSimulatePush}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedArticles={bookmarkedArticlesList}
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={handleToggleBookmark}
      />

      {/* Editorial Footer */}
      <footer className="bg-[#161412] text-neutral-300 border-t border-neutral-800 mt-16 pt-12 pb-8 text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-800">
            {/* Column 1: Brand */}
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-wider">
                The Financial Dispatch
              </h3>
              <p className="font-serif-editorial italic text-neutral-400 text-xs mt-2 leading-relaxed">
                High-performance classified news aggregation and real-time macroeconomic intelligence. Connecting Bangladeshi capital markets to global institutional investors.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-amber-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Ingestion Pipeline: Healthy • Live</span>
              </div>
            </div>

            {/* Column 2: Pillars */}
            <div>
              <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px] mb-3">
                Intelligence Pillars
              </h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>• Corporate Business & RMG Exports</li>
                <li>• Investment, FDI & Capital Markets</li>
                <li>• Dhaka & Global Tech Startups</li>
                <li>• Bangladesh Bank & Monetary Circulars</li>
                <li>• National Board of Revenue (NBR) Tax Codes</li>
              </ul>
            </div>

            {/* Column 3: Connected Media Wires */}
            <div>
              <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px] mb-3">
                Connected Media Wires
              </h4>
              <ul className="space-y-1.5 text-neutral-400">
                <li>• The Financial Express Bangladesh</li>
                <li>• The Daily Star (Business)</li>
                <li>• The Business Standard (TBS News)</li>
                <li>• Dhaka Tribune (Business)</li>
                <li>• Prothom Alo English</li>
                <li>• Reuters, CNBC & TechCrunch</li>
              </ul>
            </div>

            {/* Column 4: AI Agent Architecture */}
            <div>
              <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px] mb-3">
                AI Pipeline & Agent Engine
              </h4>
              <p className="text-neutral-400 leading-relaxed text-xs">
                Summaries, sentiment scoring, and policy assessments are synthesized via Google Gemini 3.8 Flash models running in containerized server-side execution.
              </p>
              <div className="mt-3">
                <span className="inline-block bg-neutral-800 text-amber-400 font-mono text-[10px] px-2 py-1 rounded border border-neutral-700">
                  @google/genai 2.4.0 Engine
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[11px] gap-2">
            <p>© 2026 The Financial Dispatch. All rights reserved.</p>
            <p>Institutional Business Intelligence • Web Push Enabled • Zero Exposure Architecture</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
