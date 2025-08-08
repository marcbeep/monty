"use client";

import * as React from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

interface LoaderScreenProps {
  title?: string;
  description?: string;
  progress?: number; // 0-100
}

export function LoaderScreen({
  title = "Preparing your dashboard",
  description = "Fetching portfolios and market data...",
  progress = 0,
}: LoaderScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-secondary/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-surface-primary p-6 shadow-xl border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Monty Logo"
              width={24}
              height={24}
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monty</p>
            <p className="text-base font-medium text-foreground">{title}</p>
          </div>
        </div>
        <div className="space-y-3">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
