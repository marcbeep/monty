import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://monty.marc.tt",
      "https://www.monty.marc.tt",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Monty API is running successfully!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use("/api/v1", routes);

app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

app.use(errorHandler);

if (env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(`📡 Health: http://localhost:${env.PORT}/api/v1/health`);
    console.log(`🔐 Auth: http://localhost:${env.PORT}/api/v1/auth`);
  });
}

export default app;
