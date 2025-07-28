"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Eye, Loader2 } from "lucide-react";

interface PortfolioActionsProps {
  isValidAllocation: boolean;
  portfolioName: string;
  onSave: () => void;
  onReset: () => void;
  onPreview?: () => void;
  isSaving?: boolean;
}

export function PortfolioActions({
  isValidAllocation,
  portfolioName,
  onSave,
  onReset,
  onPreview,
  isSaving = false,
}: PortfolioActionsProps) {
  const isDisabled = !isValidAllocation || !portfolioName.trim() || isSaving;

  return (
    <Card className="@container/card bg-surface-primary shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button variant="outline" onClick={onReset} disabled={isSaving}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          {onPreview && (
            <Button variant="outline" disabled={isDisabled}>
              <Eye className="size-4" />
              Preview
            </Button>
          )}
          <Button onClick={onSave} disabled={isDisabled}>
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isSaving ? "Saving..." : "Save Portfolio"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
