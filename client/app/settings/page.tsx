"use client";

import * as React from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function SettingsPage() {
  const [currency, setCurrency] = React.useState<string>("USD");
  const [baseAmount, setBaseAmount] = React.useState<string>("10000");
  const [isLoading, setIsLoading] = React.useState(false);

  const currencies = [
    { value: "USD", label: "US Dollar ($)", symbol: "$" },
    { value: "EUR", label: "Euro (€)", symbol: "€" },
    { value: "GBP", label: "British Pound (£)", symbol: "£" },
    { value: "CAD", label: "Canadian Dollar (C$)", symbol: "C$" },
    { value: "AUD", label: "Australian Dollar (A$)", symbol: "A$" },
    { value: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
    { value: "CHF", label: "Swiss Franc (CHF)", symbol: "CHF" },
  ];

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Settings saved successfully!", {
      description: "Your preferences have been updated.",
    });

    setIsLoading(false);
  };

  const handleReset = () => {
    setCurrency("USD");
    setBaseAmount("10000");
    toast.success("Settings reset to defaults");
  };

  const selectedCurrency = currencies.find((c) => c.value === currency);

  return (
    <ProtectedRoute>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="p-4 md:p-6">
            <div className="@container/main flex flex-col gap-4 md:gap-6">
              {/* Page Header */}
              <div className="space-y-2">
                <h1 className="text-2xl font-light text-foreground tracking-tight">
                  Settings
                </h1>
                <p className="text-muted-foreground">
                  Manage your portfolio preferences and defaults
                </p>
              </div>

              {/* Portfolio Defaults Card */}
              <Card className="bg-surface-primary shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Portfolio Defaults
                  </CardTitle>
                  <CardDescription>
                    Set your default currency and starting amount for new
                    portfolios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Currency Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">
                      Default Currency
                    </Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.value} value={curr.value}>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                {curr.symbol}
                              </span>
                              <span>{curr.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This will be used as the default currency for new
                      portfolios and calculations
                    </p>
                  </div>

                  {/* Base Starting Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="baseAmount" className="text-sm font-medium">
                      Base Starting Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        {selectedCurrency?.symbol}
                      </span>
                      <Input
                        id="baseAmount"
                        type="number"
                        value={baseAmount}
                        onChange={(e) => setBaseAmount(e.target.value)}
                        className="pl-8"
                        placeholder="10000"
                        min="1"
                        step="1000"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Default starting value for portfolio calculations and
                      backtesting
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
