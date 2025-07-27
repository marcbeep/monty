import { z } from "zod";

const configSchema = z.object({
  supabaseUrl: z.string().min(1, "SUPABASE_URL is required"),
  supabaseKey: z.string().min(1, "SUPABASE_KEY is required"),
  port: z.coerce.number().default(8000),
});

type Config = z.infer<typeof configSchema>;

let config: Config | null = null;

export const getConfig = (): Config => {
  if (!config) {
    const rawConfig = {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      port: process.env.PORT,
    };

    // Check if required environment variables are missing
    if (!rawConfig.supabaseUrl || !rawConfig.supabaseKey) {
      console.error("❌ Missing required environment variables:");
      if (!rawConfig.supabaseUrl) console.error("   - SUPABASE_URL is not set");
      if (!rawConfig.supabaseKey) console.error("   - SUPABASE_KEY is not set");
      console.error("\n💡 Create a .env file with your Supabase credentials:");
      console.error("   SUPABASE_URL=your_supabase_project_url");
      console.error("   SUPABASE_KEY=your_supabase_anon_key");
      console.error("   PORT=8000");
      console.error("\n📖 See .env.example for reference");
      process.exit(1);
    }

    try {
      config = configSchema.parse(rawConfig);
    } catch (error) {
      console.error("❌ Configuration validation failed:", error);
      process.exit(1);
    }
  }
  return config;
};
