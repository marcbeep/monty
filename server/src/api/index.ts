import "dotenv/config";
import express from "express";
import cors from "cors";
import { getConfig } from "../core/config";
import { getSupabase } from "../core/database";
import { success, error } from "../utils/response";

// Import API routes
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import portfoliosRouter from "./portfolios";
import assetsRouter from "./assets";
import backtesterRouter from "./backtester";
import comparisonRouter from "./comparison";
import settingsRouter from "./settings";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["*"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.get("/health", (req, res) => {
  return success(res, {
    status: "ok",
    service: "monty-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/healthz", (req, res) => {
  return success(res, { status: "ok" });
});

app.get("/ping", (req, res) => {
  return success(res, { ping: "pong" });
});

// Root endpoint
app.get("/", (req, res) => {
  return success(res, {
    status: "running",
    service: "monty-api",
    version: "1.0.0",
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/portfolios", portfoliosRouter);
app.use("/api/assets", assetsRouter);
app.use("/api/backtester", backtesterRouter);
app.use("/api/comparison", comparisonRouter);
app.use("/api/settings", settingsRouter);

// 404 handler
app.use("*", (req, res) => {
  return error(res, "Endpoint not found", 404);
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    return error(res, "Internal server error", 500);
  }
);

// For local development, start the server
if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      console.log("🚀 Starting Monty API...");

      // Validate configuration
      const config = getConfig();
      console.log("✅ Configuration loaded");

      // Test database connection
      const supabase = getSupabase();
      console.log("✅ Supabase client created");

      const { port } = config;
      app.listen(port, "0.0.0.0", () => {
        console.log(`🎉 Monty API is running on port ${port}`);
        console.log(`📖 Health check: http://localhost:${port}/health`);
      });
    } catch (err) {
      console.error("❌ Failed to start server:", err);
      process.exit(1);
    }
  };

  startServer();
}

// Export for Vercel serverless
export default app;
