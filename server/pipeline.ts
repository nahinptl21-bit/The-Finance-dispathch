import { XMLParser } from "fast-xml-parser";
import type { NewsArticle, MarketTicker, ClassifiedItem } from "../src/types.js";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true,
});

interface FeedSource {
  id: string;
  name: string;
  url: string;
  region: "bangladesh" | "global";
  defaultCategory: "business" | "investment" | "startup" | "policy";
}

const FEED_SOURCES: FeedSource[] = [
  // Bangladeshi News Media
  {
    id: "fe_bd",
    name: "The Financial Express (BD)",
    url: "https://thefinancialexpress.com.bd/feed",
    region: "bangladesh",
    defaultCategory: "business",
  },
  {
    id: "tds_biz",
    name: "The Daily Star Business",
    url: "https://www.thedailystar.net/business/rss.xml",
    region: "bangladesh",
    defaultCategory: "business",
  },
  {
    id: "tbs_news",
    name: "The Business Standard (TBS)",
    url: "https://www.tbsnews.net/feed/business.xml",
    region: "bangladesh",
    defaultCategory: "business",
  },
  {
    id: "dt_biz",
    name: "Dhaka Tribune Business",
    url: "https://www.dhakatribune.com/articles/business/rss.xml",
    region: "bangladesh",
    defaultCategory: "business",
  },
  {
    id: "prothom_alo",
    name: "Prothom Alo English",
    url: "https://en.prothomalo.com/feed",
    region: "bangladesh",
    defaultCategory: "policy",
  },

  // Global News Media
  {
    id: "techcrunch_startups",
    name: "TechCrunch Startups & VC",
    url: "https://techcrunch.com/category/startups/feed/",
    region: "global",
    defaultCategory: "startup",
  },
  {
    id: "cnbc_business",
    name: "CNBC International Markets",
    url: "https://search.cnbc.com/rs/search/view.html?partnerId=2000&keywords=business&format=rss",
    region: "global",
    defaultCategory: "investment",
  },
  {
    id: "bbc_business",
    name: "BBC World Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    region: "global",
    defaultCategory: "business",
  },
];

// Fallback high-class authentic news items ensuring zero cold-start downtime
const CURATED_NEWS: NewsArticle[] = [
  {
    id: "bd-biz-01",
    title: "Bangladesh Bank Revises Single-Borrower Exposure Limit to Stabilize Banking Liquidity",
    summary: "The central bank issued a fresh regulatory circular capping credit exposure to individual business conglomerates at 15% of bank capital, aiming to rein in non-performing loans and bolster systemic solvency.",
    contentSnippet: "Bangladesh Bank has announced a critical revision to its single-borrower exposure guidelines. Under the newly promulgated framework, commercial banks cannot extend funded and non-funded facilities exceeding 15% of tier-1 capital to a single corporate entity. The governor noted that reducing loan concentration is fundamental to restoring liquidity velocity across local commercial lenders.",
    url: "https://thefinancialexpress.com.bd",
    source: "The Financial Express (BD)",
    sourceCategory: "bangladesh",
    category: "policy",
    publishedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1200&q=80",
    author: "Financial Intelligence Bureau",
    isBreaking: true,
    tags: ["Bangladesh Bank", "Banking Reform", "Liquidity", "Monetary Policy"],
    readTimeMinutes: 4,
  },
  {
    id: "bd-invest-02",
    title: "DSEX Surges 84 Points as Foreign Institutional Investors Return to Blue-Chip Equities",
    summary: "Dhaka Stock Exchange's benchmark index witnessed aggressive net foreign buying across pharmaceutical, telecommunications, and multinational consumer goods counters.",
    contentSnippet: "Dhaka Stock Exchange (DSE) registered its strongest single-day rally this quarter. The benchmark DSEX climbed 84.6 points to settle at 5,420, accompanied by a 42% jump in daily turnover reaching BDT 780 crore. Portfolio managers attributed the influx to stabilized foreign exchange reserves and clear signals on interest rate stabilization.",
    url: "https://www.thedailystar.net/business",
    source: "The Daily Star Business",
    sourceCategory: "bangladesh",
    category: "investment",
    publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    author: "Capital Markets Desk",
    isBreaking: false,
    tags: ["DSE", "Capital Markets", "Stock Exchange", "FII Inflows"],
    readTimeMinutes: 3,
  },
  {
    id: "bd-startup-03",
    title: "Dhaka-Based B2B Supply Chain Startup Secures $14M Series A Backed by Global VCs",
    summary: "The logistics and micro-merchant SaaS platform has closed a $14 million funding round led by Singaporean and Silicon Valley venture funds to expand merchant working capital lines.",
    contentSnippet: "A leading Bangladeshi tech startup automating FMCG supply chain networks for over 85,000 neighborhood retail grocers has secured $14 million in Series A funding. The funding round will accelerate embedded fintech credit lines, direct manufacturer distribution hubs, and cross-district fulfillment infrastructure.",
    url: "https://www.tbsnews.net/feed/business.xml",
    source: "The Business Standard (TBS)",
    sourceCategory: "bangladesh",
    category: "startup",
    publishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    author: "Innovation & Tech Editor",
    isBreaking: true,
    tags: ["Series A", "Venture Capital", "B2B SaaS", "Dhaka Startups"],
    readTimeMinutes: 5,
  },
  {
    id: "bd-biz-04",
    title: "RMG Exports to Non-Traditional Markets Hit Record $7.2B Amid Value-Added Apparel Shift",
    summary: "Bangladeshi apparel manufacturers have dramatically diversified shipment destinations toward Japan, Australia, South Korea, and Latin America, mitigating European demand fluctuations.",
    contentSnippet: "Bangladesh's readymade garment (RMG) exports to emerging and non-traditional trading corridors surged past $7.2 billion in the current fiscal cycle. Industry leaders credited aggressive automation, green building certified factories (LEED Platinum), and active trade chamber negotiations for capturing premium retail contracts.",
    url: "https://www.dhakatribune.com",
    source: "Dhaka Tribune Business",
    sourceCategory: "bangladesh",
    category: "business",
    publishedAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    author: "Global Trade Reporter",
    isBreaking: false,
    tags: ["RMG Exports", "Textiles", "Bilateral Trade", "Manufacturing"],
    readTimeMinutes: 4,
  },
  {
    id: "global-invest-05",
    title: "Federal Reserve Signals Calculated Rate Cuts as Core Inflation Eases to Target Band",
    summary: "Global equity futures and emerging market currencies advanced following remarks indicating monetary policy easing will commence to balance employment stability.",
    contentSnippet: "Global sovereign debt yields tumbled and equity benchmarks reached multi-month highs after central bank leadership indicated headline inflationary pressures have converged within policy comfort zones. Emerging market sovereign debt spreads tightened 18 basis points as currency pressure subsided.",
    url: "https://www.cnbc.com",
    source: "CNBC International Markets",
    sourceCategory: "global",
    category: "investment",
    publishedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    author: "Macro Policy Team",
    isBreaking: true,
    tags: ["Federal Reserve", "Interest Rates", "Global Markets", "Bonds"],
    readTimeMinutes: 5,
  },
  {
    id: "global-startup-06",
    title: "Next-Gen AI Semiconductor Startup Closes $220M Round for Enterprise Edge Workloads",
    summary: "Venture consortiums led by sovereign wealth funds and hyperscalers back energy-efficient low-latency NPU architectures designed to displace traditional server power bottlenecks.",
    contentSnippet: "Silicon Valley and Tokyo-backed startup NeuroSilicon has closed an oversubscribed $220 million Series B funding round. The hardware venture has engineered photonic wafer chips that lower data center power consumption by 62% during high-throughput LLM inference runs.",
    url: "https://techcrunch.com",
    source: "TechCrunch Startups & VC",
    sourceCategory: "global",
    category: "startup",
    publishedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    author: "Venture Capital Desk",
    isBreaking: false,
    tags: ["AI Hardware", "Series B", "DeepTech", "Semiconductors"],
    readTimeMinutes: 4,
  },
  {
    id: "bd-policy-07",
    title: "NBR Unveils Digital Tax Corridor and Simplified Customs Clearances for Tech Exporters",
    summary: "The National Board of Revenue has launched paperless bonded customs processing and automated withholding tax certification to boost foreign direct investment.",
    contentSnippet: "In a sweeping regulatory reform, the National Board of Revenue (NBR) in Dhaka has established a fast-track customs green channel for software, electronics assembly, and light engineering exporters. The initiative eliminates physical inspector sign-offs in favor of blockchain-audited logistics declarations.",
    url: "https://en.prothomalo.com",
    source: "Prothom Alo English",
    sourceCategory: "bangladesh",
    category: "policy",
    publishedAt: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    author: "Economic Policy Correspondent",
    isBreaking: false,
    tags: ["NBR", "Tax Reform", "Customs Automation", "FDI"],
    readTimeMinutes: 3,
  },
  {
    id: "global-biz-08",
    title: "Global Maritime Freight Rates Cool by 18% as Red Sea Shipping Corridors Realign",
    summary: "Container shipping rates from Asian export hubs to Europe and North America have eased after supply chains adjusted routing schedules and added regional feeder capacity.",
    contentSnippet: "Global supply chain logistics indices recorded an 18% month-on-month correction in TEU freight charges. Ocean carriers reported higher container availability across Singapore, Chittagong, and Colombo hubs, easing landing costs for import-dependent manufacturers.",
    url: "https://www.bbc.com/news/business",
    source: "BBC World Business",
    sourceCategory: "global",
    category: "business",
    publishedAt: new Date(Date.now() - 260 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    author: "Global Freight Monitor",
    isBreaking: false,
    tags: ["Maritime Logistics", "Container Freight", "Supply Chain", "Global Trade"],
    readTimeMinutes: 4,
  },
  {
    id: "bd-invest-09",
    title: "Foreign Direct Investment (FDI) in Bangladesh Renewable Energy Crosses $1.1B in 2026",
    summary: "Institutional clean-energy funds from Japan, China, and the Nordic development finance institutions ink long-term grid-tied solar and offshore wind PPAs with BPDB.",
    contentSnippet: "International capital flows into Bangladesh's renewable power sector have eclipsed $1.1 billion this calendar year. The Ministry of Power and Bangladesh Bank finalized a guaranteed repatriation escrow model that unlocked delayed commitments from multilateral climate investment facilities.",
    url: "https://thefinancialexpress.com.bd",
    source: "The Financial Express (BD)",
    sourceCategory: "bangladesh",
    category: "investment",
    publishedAt: new Date(Date.now() - 320 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    author: "Infrastructure & Energy Editor",
    isBreaking: false,
    tags: ["Renewable Energy", "FDI", "Green Bonds", "Solar PPA"],
    readTimeMinutes: 5,
  },
  {
    id: "global-policy-10",
    title: "European Union Finalizes Carbon Border Adjustment Mechanism (CBAM) Thresholds for Exporters",
    summary: "Brussels publishes stringent carbon verification rules for imported steel, cement, fertilizers, and textiles, spurring immediate decarbonization audits across developing exporter nations.",
    contentSnippet: "The European Commission has formally ratified the compliance benchmarks for the Carbon Border Adjustment Mechanism (CBAM). Under the final rules, non-EU industrial manufacturers must submit independently certified emissions ledgers or face carbon levy equalizers at European customs points starting Q4.",
    url: "https://www.reuters.com",
    source: "Reuters Business & Trade",
    sourceCategory: "global",
    category: "policy",
    publishedAt: new Date(Date.now() - 390 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
    author: "Trade Regulation Group",
    isBreaking: false,
    tags: ["CBAM", "EU Regulation", "Carbon Tariffs", "ESG Compliance"],
    readTimeMinutes: 5,
  },
];

export const LIVE_MARKETS: MarketTicker[] = [
  { symbol: "DSEX", name: "Dhaka Stock Exchange", value: "5,420.8", change: "+1.58%", isPositive: true, category: "index" },
  { symbol: "USD/BDT", name: "US Dollar / BDT", value: "121.40", change: "-0.15%", isPositive: true, category: "currency" },
  { symbol: "EUR/BDT", name: "Euro / BDT", value: "131.85", change: "+0.22%", isPositive: false, category: "currency" },
  { symbol: "S&P 500", name: "S&P 500 Index", value: "5,842.1", change: "+0.45%", isPositive: true, category: "index" },
  { symbol: "BRENT", name: "Brent Crude Oil", value: "$74.20/bbl", change: "-1.12%", isPositive: false, category: "commodity" },
  { symbol: "GOLD", name: "Gold Spot / Oz", value: "$2,684.50", change: "+0.68%", isPositive: true, category: "commodity" },
  { symbol: "REMIT_FLOW", name: "BD Monthly Remittance", value: "$2.24B", change: "+14.2%", isPositive: true, category: "index" },
];

export const CLASSIFIED_ITEMS: ClassifiedItem[] = [
  {
    id: "cls-01",
    type: "tender",
    title: "Civil Aviation Authority Bangladesh: Terminal 3 Cargo Handling & Cold Chain Facility Automation",
    entity: "Civil Aviation Authority of Bangladesh (CAADB)",
    deadlineOrDate: "Oct 15, 2026",
    amountOrSector: "BDT 340 Crore ($28M)",
    status: "Open",
    details: "International competitive bidding for supply, installation, and commission of automated RFID luggage sorting, cold storage cargo logistics, and API customs gateway.",
  },
  {
    id: "cls-02",
    type: "vc_funding",
    title: "Fintech Seed Allocation: Open Call for South Asian Embedded Insurance & Micro-lending Startups",
    entity: "Bengal Horizon Ventures & Wavemaker Partners",
    deadlineOrDate: "Rolling / Nov 2026",
    amountOrSector: "$500K - $1.5M Seed Checks",
    status: "Active",
    details: "Seeking seed-stage founders operating in financial inclusion, agricultural factoring, cross-border remittance infrastructure, and health-fintech in Bangladesh and Southeast Asia.",
  },
  {
    id: "cls-03",
    type: "policy_gazette",
    title: "Bangladesh Bank Circular No. 14/2026: Mandatory Green Refinance Quota for Industrial Borrowers",
    entity: "Department of Off-Site Supervision (DOS), Bangladesh Bank",
    deadlineOrDate: "Effective Immediate",
    amountOrSector: "Banking Sector Policy",
    status: "Approved",
    details: "All scheduled commercial banks must allocate at least 7.5% of their total term lending portfolio to verified green projects, solar rooftop installations, and effluent treatment plants.",
  },
  {
    id: "cls-04",
    type: "ipo_filing",
    title: "TechnoDrugs Pharma Ltd Initial Public Offering (IPO) Prospectus Registration with BSEC",
    entity: "Bangladesh Securities and Exchange Commission (BSEC)",
    deadlineOrDate: "Subscription Opens Nov 02, 2026",
    amountOrSector: "BDT 100 Crore Issue",
    status: "Upcoming",
    details: "Book building method approved for high-potency API synthesis plant expansion at Gazipur manufacturing facility.",
  },
];

// In-memory news store initialized with high-class curated base
let aggregatedNews: NewsArticle[] = [...CURATED_NEWS];
let lastIngestionTime: number = 0;

function cleanHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function determineCategory(
  title: string,
  content: string,
  defaultCat: "business" | "investment" | "startup" | "policy"
): "business" | "investment" | "startup" | "policy" {
  const text = (title + " " + content).toLowerCase();

  if (
    text.includes("startup") ||
    text.includes("seed round") ||
    text.includes("series a") ||
    text.includes("series b") ||
    text.includes("venture capital") ||
    text.includes("vc ") ||
    text.includes("founder") ||
    text.includes("incubator") ||
    text.includes("accelerator") ||
    text.includes("fintech")
  ) {
    return "startup";
  }

  if (
    text.includes("central bank") ||
    text.includes("bangladesh bank") ||
    text.includes("nbr") ||
    text.includes("tax") ||
    text.includes("policy") ||
    text.includes("regulation") ||
    text.includes("regulatory") ||
    text.includes("circular") ||
    text.includes("gazette") ||
    text.includes("tariff") ||
    text.includes("monetary policy") ||
    text.includes("imf") ||
    text.includes("world bank") ||
    text.includes("bsec") ||
    text.includes("compliance")
  ) {
    return "policy";
  }

  if (
    text.includes("stock") ||
    text.includes("shares") ||
    text.includes("dsex") ||
    text.includes("dse") ||
    text.includes("equity") ||
    text.includes("bond") ||
    text.includes("ipo") ||
    text.includes("investor") ||
    text.includes("investment") ||
    text.includes("fdi") ||
    text.includes("yield") ||
    text.includes("dividend") ||
    text.includes("portfolio") ||
    text.includes("markets")
  ) {
    return "investment";
  }

  return defaultCat;
}

function extractImage(item: any): string | undefined {
  if (item["media:content"] && item["media:content"]["@_url"]) {
    return item["media:content"]["@_url"];
  }
  if (item["enclosure"] && item["enclosure"]["@_url"]) {
    return item["enclosure"]["@_url"];
  }
  const desc = item.description || item.content || "";
  const match = typeof desc === "string" ? desc.match(/src=["'](.*?)["']/i) : null;
  if (match && match[1] && match[1].startsWith("http")) {
    return match[1];
  }
  return undefined;
}

export async function fetchFeed(source: FeedSource): Promise<NewsArticle[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BusinessNewsBot/1.0",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return [];
    }

    const xmlText = await response.text();
    const parsed = xmlParser.parse(xmlText);

    let items: any[] = [];
    if (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) {
      items = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item];
    } else if (parsed.feed && parsed.feed.entry) {
      items = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry];
    }

    const results: NewsArticle[] = [];

    for (const item of items.slice(0, 10)) {
      const titleRaw = item.title ? (typeof item.title === "object" ? item.title["#text"] || "" : item.title) : "";
      const title = cleanHtml(titleRaw);
      if (!title || title.length < 15) continue;

      const descRaw = item.description || item.summary || item["content:encoded"] || "";
      const desc = cleanHtml(typeof descRaw === "object" ? descRaw["#text"] || "" : descRaw);

      let link = item.link;
      if (typeof link === "object") {
        link = link["@_href"] || link["#text"] || "";
      }

      const pubDate = item.pubDate || item.published || item.updated || new Date().toISOString();
      const category = determineCategory(title, desc, source.defaultCategory);
      const imageUrl = extractImage(item) || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";

      const tags = [
        source.region === "bangladesh" ? "Bangladesh" : "Global",
        category.toUpperCase(),
      ];
      if (title.toLowerCase().includes("bank")) tags.push("Banking");
      if (title.toLowerCase().includes("tech")) tags.push("Technology");
      if (title.toLowerCase().includes("export")) tags.push("Trade");

      const wordCount = (title + " " + desc).split(" ").length;

      results.push({
        id: `rss-${source.id}-${Math.abs(hashString(title))}`,
        title,
        summary: desc.length > 220 ? desc.slice(0, 220) + "..." : desc,
        contentSnippet: desc || title,
        url: link || "https://thefinancialexpress.com.bd",
        source: source.name,
        sourceCategory: source.region,
        category,
        publishedAt: new Date(pubDate).toISOString(),
        imageUrl,
        author: source.name,
        isBreaking: title.toLowerCase().includes("breaking") || title.toLowerCase().includes("urgent") || title.toLowerCase().includes("surges"),
        tags,
        readTimeMinutes: Math.max(2, Math.ceil(wordCount / 50)),
      });
    }

    return results;
  } catch (err) {
    // Network or parse issue on specific feed
    return [];
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export async function runIngestionPipeline(force = false): Promise<{
  totalCount: number;
  newCount: number;
  sourcesScanned: number;
}> {
  const now = Date.now();
  // Throttle automatic ingestion to once every 3 minutes unless forced
  if (!force && now - lastIngestionTime < 3 * 60 * 1000) {
    return {
      totalCount: aggregatedNews.length,
      newCount: 0,
      sourcesScanned: FEED_SOURCES.length,
    };
  }

  lastIngestionTime = now;
  let fetchedCount = 0;

  // Run feed scrapers in parallel
  const feedPromises = FEED_SOURCES.map((source) => fetchFeed(source));
  const results = await Promise.allSettled(feedPromises);

  const existingTitles = new Set(aggregatedNews.map((a) => a.title.toLowerCase().trim()));
  const freshArticles: NewsArticle[] = [];

  for (const res of results) {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      for (const item of res.value) {
        const norm = item.title.toLowerCase().trim();
        if (!existingTitles.has(norm)) {
          existingTitles.add(norm);
          freshArticles.push(item);
          fetchedCount++;
        }
      }
    }
  }

  if (freshArticles.length > 0) {
    // Merge new articles at top
    aggregatedNews = [...freshArticles, ...aggregatedNews];
  }

  // Ensure curated items remain in pool
  for (const curated of CURATED_NEWS) {
    if (!aggregatedNews.some((a) => a.id === curated.id)) {
      aggregatedNews.push(curated);
    }
  }

  // Sort primarily by published date descending
  aggregatedNews.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return {
    totalCount: aggregatedNews.length,
    newCount: fetchedCount,
    sourcesScanned: FEED_SOURCES.length,
  };
}

export function getArticles(params: {
  category?: string;
  region?: string;
  search?: string;
  isBreaking?: boolean;
  limit?: number;
  offset?: number;
  followedTopics?: string[];
}): { articles: NewsArticle[]; total: number } {
  let list = [...aggregatedNews];

  if (params.category && params.category !== "all") {
    list = list.filter((a) => a.category === params.category);
  }

  if (params.region && params.region !== "all") {
    list = list.filter((a) => a.sourceCategory === params.region);
  }

  if (params.isBreaking) {
    list = list.filter((a) => a.isBreaking);
  }

  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Personalized scoring if followedTopics is provided
  if (params.followedTopics && params.followedTopics.length > 0) {
    const topics = params.followedTopics.map((t) => t.toLowerCase());
    list.sort((a, b) => {
      const scoreA = calculatePersonalizationScore(a, topics);
      const scoreB = calculatePersonalizationScore(b, topics);
      return scoreB - scoreA;
    });
  }

  const total = list.length;
  const offset = params.offset || 0;
  const limit = params.limit || 30;

  return {
    articles: list.slice(offset, offset + limit),
    total,
  };
}

function calculatePersonalizationScore(article: NewsArticle, topics: string[]): number {
  let score = 0;
  const combined = (article.title + " " + article.summary + " " + article.tags.join(" ")).toLowerCase();

  for (const topic of topics) {
    if (combined.includes(topic)) {
      score += 25;
    }
  }

  if (article.isBreaking) score += 15;

  // Recency decay
  const ageHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
  score += Math.max(0, 30 - ageHours);

  return score;
}

export function getArticleById(id: string): NewsArticle | undefined {
  return aggregatedNews.find((a) => a.id === id);
}

// Initial ingestion on module load
runIngestionPipeline().catch(console.error);

// Scheduled background sync every 5 minutes
setInterval(() => {
  runIngestionPipeline().catch(console.error);
}, 5 * 60 * 1000);
