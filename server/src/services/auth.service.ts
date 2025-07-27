import { supabase } from "../config/supabase";
import { AuthResponse, UserResponse } from "../dto/auth.dto";
import { LoginInput, SignupInput } from "../utils/validation";
import { Unauthorized, AppError } from "../utils/errors";
import { portfolioService } from "./portfolio.service";

export class AuthService {
  async login(credentials: LoginInput): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error || !data.user || !data.session)
      throw Unauthorized(error?.message);

    return {
      user: this.mapUser(data.user),
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  async signup(credentials: SignupInput): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          first_name: credentials.firstName,
          last_name: credentials.lastName,
        },
      },
    });
    if (error || !data.user || !data.session)
      throw Unauthorized(error?.message);

    try {
      // Create profile entry
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        first_name: credentials.firstName,
        last_name: credentials.lastName,
      });

      if (profileError)
        throw new AppError(
          `Profile creation failed: ${profileError.message}`,
          500
        );

      // Create starter portfolios
      await portfolioService.createStarterPortfolios(data.user.id);
    } catch (setupError) {
      // If profile/portfolio creation fails, we should still allow login but log the error
      console.error("User setup failed:", setupError);
      // Don't throw - user can still use the app, just without portfolios initially
    }

    return {
      user: this.mapUser(data.user),
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw Unauthorized(error.message);
  }

  async getUser(token: string): Promise<UserResponse> {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw Unauthorized();
    return this.mapUser(data.user);
  }

  private mapUser(user: any): UserResponse {
    const firstName = user.user_metadata?.first_name || "";
    const lastName = user.user_metadata?.last_name || "";
    return {
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      createdAt: user.created_at,
    };
  }
}

export const authService = new AuthService();
