import express from "express";
import dotenv from "dotenv";
import {
  getArticles,
  getArticleById,
  runIngestionPipeline,
  LIVE_MARKETS,
  CLASSIFIED_ITEMS,
} from "./pipeline.js";
import { generateArticleSummary, askArticleQuestion } from "./gemini.js";

dotenv.config();

export function createExpressApp() {
  const app = express();

  app.use(express.json({ limit: "2mb" }));

  // CORS support for external / multi-origin callers
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // --- API Endpoints ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      service: "Business & Investment Intelligence News Portal",
      timestamp: new Date().toISOString(),
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // Get aggregated news articles
  app.get("/api/news", (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const region = req.query.region as string | undefined;
      const search = req.query.search as string | undefined;
      const isBreaking = req.query.isBreaking === "true";
      const limit = parseInt(req.query.limit as string) || 30;
      const offset = parseInt(req.query.offset as string) || 0;

      let followedTopics: string[] | undefined;
      if (req.query.topics) {
        followedTopics = (req.query.topics as string).split(",").map((t) => t.trim());
      }

      const result = getArticles({
        category,
        region,
        search,
        isBreaking,
        limit,
        offset,
        followedTopics,
      });

      res.json(result);
    } catch (err: any) {
      console.error("Error fetching news:", err);
      res.status(500).json({ error: "Failed to retrieve news articles" });
    }
  });

  // Get breaking news headlines
  app.get("/api/news/breaking", (req, res) => {
    try {
      const result = getArticles({ isBreaking: true, limit: 10 });
      res.json(result.articles);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to retrieve breaking news" });
    }
  });

  // Force trigger live pipeline aggregation
  app.post("/api/news/refresh", async (req, res) => {
    try {
      const stats = await runIngestionPipeline(true);
      res.json({
        message: "Live ingestion pipeline completed successfully",
        stats,
      });
    } catch (err: any) {
      res.status(500).json({ error: "Ingestion pipeline error: " + err.message });
    }
  });

  // Get article by ID
  app.get("/api/news/:id", (req, res) => {
    const article = getArticleById(req.params.id);
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json(article);
  });

  // Live financial markets ticker
  app.get("/api/markets", (req, res) => {
    res.json(LIVE_MARKETS);
  });

  // Business classifieds, tenders & regulatory gazettes
  app.get("/api/classifieds", (req, res) => {
    res.json(CLASSIFIED_ITEMS);
  });

  // AI Summary Pipeline (Powered by Gemini)
  app.post("/api/ai/summarize", async (req, res) => {
    try {
      const { articleId, title, content, source, category, region } = req.body;

      let article = articleId ? getArticleById(articleId) : null;

      const targetTitle = title || article?.title;
      const targetContent = content || article?.contentSnippet || article?.summary || "";
      const targetSource = source || article?.source || "Global Business Media";
      const targetCategory = category || article?.category || "business";
      const targetRegion = region || article?.sourceCategory || "bangladesh";

      if (!targetTitle) {
        res.status(400).json({ error: "Missing article title or ID for summary generation" });
        return;
      }

      const summary = await generateArticleSummary({
        id: articleId || `custom-${Date.now()}`,
        title: targetTitle,
        content: targetContent,
        source: targetSource,
        category: targetCategory,
        region: targetRegion,
      });

      res.json({
        success: true,
        summary,
      });
    } catch (err: any) {
      console.error("AI summary endpoint error:", err);
      res.status(500).json({ error: "Failed to generate AI executive summary" });
    }
  });

  // AI Q&A Chat regarding specific article or policy
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { question, articleId, title, content, source } = req.body;
      if (!question) {
        res.status(400).json({ error: "Question parameter is required" });
        return;
      }

      let article = articleId ? getArticleById(articleId) : null;
      const targetTitle = title || article?.title || "Business Intelligence Report";
      const targetContent = content || article?.contentSnippet || article?.summary || "";
      const targetSource = source || article?.source || "Financial Press";

      const answer = await askArticleQuestion(
        {
          title: targetTitle,
          content: targetContent,
          source: targetSource,
        },
        question
      );

      res.json({ answer });
    } catch (err: any) {
      console.error("AI Q&A error:", err);
      res.status(500).json({ error: "Failed to answer question" });
    }
  });

  return app;
}
