import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
              Your AI-powered investment companion. Build, analyze, and optimize
              your portfolio with intelligent insights.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Button asChild size="lg" className="text-base px-8 py-3 h-12">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Subtle feature hint */}
        <p className="text-sm text-muted-foreground/80 pt-8">
          Portfolio building • Market analysis • Investment simulation
        </p>
      </div>
    </div>
  );
}
