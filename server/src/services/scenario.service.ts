import {
  StressTestResult,
  MonteCarloResult,
  StressTestRequest,
  MonteCarloRequest,
} from "../dto/scenario.dto";
import { AppError, NotFound } from "../utils/errors";
import { env } from "../config/env";

const getScenarioApiUrl = () => {
  if (env.SCENARIO_API_URL) {
    return env.SCENARIO_API_URL;
  }

  const isProduction = env.ENV === "production";

  if (isProduction) {
    throw new Error("SCENARIO_API_URL is required in production");
  }

  return "http://localhost:8002";
};

const SCENARIO_API_URL = getScenarioApiUrl();
const CACHE_DURATION = 300000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface ScenarioApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export class ScenarioService {
  private stressTestCache = new Map<string, CacheEntry<StressTestResult>>();
  private monteCarloCache = new Map<string, CacheEntry<MonteCarloResult>>();

  async runStressTest(params: StressTestRequest): Promise<StressTestResult> {
    const cacheKey = `stress_test:${JSON.stringify(params)}`;
    const cached = this.stressTestCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const url = `${SCENARIO_API_URL}/api/v1/stress-test`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw NotFound("Portfolio not found");
        }
        throw new AppError(
          `Scenario API responded with ${response.status}`,
          500
        );
      }

      const result =
        (await response.json()) as ScenarioApiResponse<StressTestResult>;

      if (!result.success) {
        throw new AppError(result.error || "Stress test failed", 500);
      }

      this.stressTestCache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now(),
      });

      return result.data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Stress test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async runMonteCarlo(params: MonteCarloRequest): Promise<MonteCarloResult> {
    const cacheKey = `monte_carlo:${JSON.stringify(params)}`;
    const cached = this.monteCarloCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const url = `${SCENARIO_API_URL}/api/v1/monte-carlo`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw NotFound("Portfolio not found");
        }
        throw new AppError(
          `Scenario API responded with ${response.status}`,
          500
        );
      }

      const result =
        (await response.json()) as ScenarioApiResponse<MonteCarloResult>;

      if (!result.success) {
        throw new AppError(
          result.error || "Monte Carlo simulation failed",
          500
        );
      }

      this.monteCarloCache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now(),
      });

      return result.data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Monte Carlo simulation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async healthCheck(): Promise<{
    status: string;
    service: string;
    version: string;
  }> {
    try {
      const url = `${SCENARIO_API_URL}/api/v1/health`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new AppError(
          `Scenario API health check failed with ${response.status}`,
          500
        );
      }

      const result = (await response.json()) as ScenarioApiResponse<{
        status: string;
        service: string;
        version: string;
        api_prefix: string;
      }>;

      if (!result.success) {
        throw new AppError(result.error || "Health check failed", 500);
      }

      return {
        status: result.data.status,
        service: result.data.service,
        version: result.data.version,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Scenario API health check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }
}

export const scenarioService = new ScenarioService();
