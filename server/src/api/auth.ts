import { Router, Request, Response } from "express";
import { z } from "zod";
import { getSupabase } from "../core/database";
import {
  loginRequestSchema,
  registerRequestSchema,
  AuthResponse,
  LogoutResponse,
} from "../types/auth";
import { success, error } from "../utils/response";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = loginRequestSchema.parse(req.body);
    const supabase = getSupabase();

    const authResponse = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const { user, session } = authResponse.data;
    if (!user || !session) {
      return error(res, "Invalid credentials", 401);
    }

    // Get user profile
    let profile = {};
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      profile = data || {};
    } catch (profileError) {
      // Profile might not exist yet
    }

    const responseData: AuthResponse = {
      user_id: user.id,
      email: user.email!,
      first_name: (profile as any)?.first_name || "",
      last_name: (profile as any)?.last_name || "",
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    };

    return success(res, responseData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(res, "Invalid request data", 400, err.errors);
    }
    if ((err as any)?.message?.includes("Invalid login credentials")) {
      return error(res, "Invalid email or password", 401);
    }
    return error(res, "Login failed", 500);
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name } =
      registerRequestSchema.parse(req.body);
    const supabase = getSupabase();

    const authResponse = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name, last_name },
      },
    });

    const { user, session } = authResponse.data;
    if (!user) {
      return error(res, "Registration failed - no user created", 400);
    }

    // Get profile (may be created by trigger)
    let profile = {};
    try {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for trigger
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      profile = data || {};
    } catch (profileError) {
      // Profile might not exist yet
    }

    const responseData: AuthResponse = {
      user_id: user.id,
      email: user.email!,
      first_name: (profile as any)?.first_name || first_name,
      last_name: (profile as any)?.last_name || last_name,
      access_token: session?.access_token || "",
      refresh_token: session?.refresh_token || "",
    };

    return success(res, responseData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(res, "Invalid request data", 400, err.errors);
    }
    if ((err as any)?.message?.includes("already registered")) {
      return error(res, "User already exists", 400);
    }
    return error(res, "Registration failed", 500);
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    const supabase = getSupabase();
    await supabase.auth.signOut();

    const responseData: LogoutResponse = { message: "Successfully logged out" };
    return success(res, responseData);
  } catch (err) {
    return error(res, "Logout failed", 500);
  }
});

export default router;
