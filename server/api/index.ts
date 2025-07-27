import "dotenv/config";
import express from "express";
import cors from "cors";
import { getConfig } from "../src/core/config";
import { getSupabase } from "../src/core/database";
import { success, error } from "../src/utils/response";

// Import API routes
import authRouter from "../src/api/auth";
import dashboardRouter from "../src/api/dashboard";
import portfoliosRouter from "../src/api/portfolios";
import assetsRouter from "../src/api/assets";
import backtesterRouter from "../src/api/backtester";
import comparisonRouter from "../src/api/comparison";
import settingsRouter from "../src/api/settings";

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

// Export for Vercel serverless
export default app;
