export type NewsCategory = 'all' | 'business' | 'investment' | 'startup' | 'policy';
export type NewsRegion = 'all' | 'south_asia' | 'bangladesh' | 'india' | 'pakistan' | 'sri_lanka' | 'nepal' | 'global';

export interface AISummary {
  executiveSummary: string;
  keyTakeaways: string[];
  marketImpact: {
    sentiment: 'bullish' | 'bearish' | 'neutral';
    score?: number; // -100 to +100
    rationale?: string;
    affectedSectors?: string[];
    riskLevel?: string;
    timeHorizon?: string;
  };
  policyAnalysis?: {
    regulatoryBodies: string[];
    complianceImpact: string;
    targetSectors: string[];
  };
  actionableInsights?: {
    forInvestors: string;
    forFounders: string;
    forPolicymakers: string;
  };
  generatedAt?: string;
  modelUsed?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  contentSnippet: string;
  url: string;
  source: string;
  sourceCategory: NewsRegion;
  country?: string;
  countryCode?: string;
  category: 'business' | 'investment' | 'startup' | 'policy';
  publishedAt: string;
  imageUrl?: string;
  author?: string;
  isBreaking?: boolean;
  tags: string[];
  readTimeMinutes: number;
  aiSummary?: AISummary;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  category: 'currency' | 'index' | 'commodity' | 'stock';
  exchange?: string;
  country?: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  volume: string;
  high: number;
  low: number;
  exchange: 'DSE' | 'BSE' | 'NSE' | 'PSX' | 'CSE' | 'NEPSE' | 'GLOBAL';
  sector: string;
  isPositive: boolean;
  sparkline?: number[];
}

export interface MarketOverview {
  exchange: string;
  code: string;
  country: string;
  countryFlag: string;
  indexName: string;
  indexValue: string;
  change: string;
  changePoints: string;
  isPositive: boolean;
  turnover: string;
  status: 'OPEN' | 'CLOSED';
  tradingHours: string;
}

export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  isPinned?: boolean;
  articleId?: string;
  articleTitle?: string;
  articleSource?: string;
  articleUrl?: string;
  stockSymbol?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassifiedItem {
  id: string;
  type: 'tender' | 'vc_funding' | 'policy_gazette' | 'ipo_filing';
  title: string;
  entity: string;
  deadlineOrDate: string;
  amountOrSector?: string;
  status: 'Open' | 'Active' | 'Approved' | 'Upcoming';
  sourceUrl?: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  articleId: string;
  read: boolean;
}

export interface UserPreferences {
  pushEnabled: boolean;
  soundEnabled: boolean;
  preferredCategories: string[];
  preferredRegion: NewsRegion;
  followedTopics: string[];
  readArticles: string[];
  bookmarkedArticles: string[];
}
