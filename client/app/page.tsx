import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl text-center space-y-6 sm:space-y-8">
        {/* Logo and Brand */}
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Monty Logo"
              width={48}
              height={48}
              className="object-cover rounded-lg"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-light text-foreground tracking-tight">
              Welcome to Monty
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto px-4">
              Build, analyse, and stress-test your investment portfolios with
              advanced backtesting tools and real-time performance tracking.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="text-base px-8 py-3 h-12">
              <Link href="/register" className="flex items-center gap-2">
                <BarChart3 className="size-5" />
                Get Started
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 py-3 h-12"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Attribution and Technologies */}
        <div className="pt-6 space-y-3">
          {/* Attribution */}
          <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
            Built by{" "}
            <a
              href="https://marc.tt"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Marc Beepath
            </a>{" "}
            for his Final Master&apos;s Project at the University of Liverpool.
            Made with:
          </p>

          {/* Technology Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Next.js
            </Badge>
            <Badge variant="secondary" className="text-xs">
              FastAPI
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Supabase
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Python
            </Badge>
            <Badge variant="secondary" className="text-xs">
              TypeScript
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
