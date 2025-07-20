"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Shield, Zap } from "lucide-react";

interface PortfolioDetailsFormProps {
  portfolioName: string;
  portfolioDescription: string;
  riskLevel: "Low" | "Medium" | "High";
  onPortfolioNameChange: (name: string) => void;
  onPortfolioDescriptionChange: (description: string) => void;
  onRiskLevelChange: (riskLevel: "Low" | "Medium" | "High") => void;
}

export function PortfolioDetailsForm({
  portfolioName,
  portfolioDescription,
  riskLevel,
  onPortfolioNameChange,
  onPortfolioDescriptionChange,
  onRiskLevelChange,
}: PortfolioDetailsFormProps) {
  return (
    <Card className="@container/card bg-surface-primary shadow-sm">
      <CardHeader>
        <CardTitle className="font-bold">Portfolio Details</CardTitle>
        <CardDescription>
          Configure your portfolio&apos;s basic information and risk profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="portfolio-name">Portfolio Name</Label>
            <Input
              id="portfolio-name"
              placeholder="Enter portfolio name"
              value={portfolioName}
              onChange={(e) => onPortfolioNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="risk-level">Risk Level</Label>
            <Select value={riskLevel} onValueChange={onRiskLevelChange}>
              <SelectTrigger id="risk-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Low Risk
                  </div>
                </SelectItem>
                <SelectItem value="Medium">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Medium Risk
                  </div>
                </SelectItem>
                <SelectItem value="High">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    High Risk
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolio-description">Description</Label>
          <Input
            id="portfolio-description"
            placeholder="Describe your portfolio strategy"
            value={portfolioDescription}
            onChange={(e) => onPortfolioDescriptionChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
