import request from "supertest";
import express from "express";
import { AuthService } from "../services/auth.service";
import { errorHandler } from "../middleware/error.middleware";
import authRoutes from "../routes/auth.routes";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use(errorHandler);

jest.mock("../services/auth.service");
const mockAuthService = jest.mocked(AuthService);

describe("Authentication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/login", () => {
    it("should login successfully", async () => {
      const mockResponse = {
        user: {
          id: "123",
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
          created_at: "2023-01-01T00:00:00Z",
        },
        access_token: "token123",
        refresh_token: "refresh123",
      };

      mockAuthService.prototype.login = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "Password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should fail with missing fields", async () => {
      const response = await request(app).post("/auth/login").send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /auth/signup", () => {
    it("should signup successfully", async () => {
      const mockResponse = {
        user: {
          id: "123",
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
          created_at: "2023-01-01T00:00:00Z",
        },
        access_token: "token123",
        refresh_token: "refresh123",
      };

      mockAuthService.prototype.signup = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const response = await request(app).post("/auth/signup").send({
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "Password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it("should fail with missing fields", async () => {
      const response = await request(app).post("/auth/signup").send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
