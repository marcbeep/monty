"use client";

import * as React from "react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  PortfolioSelector,
  PortfolioDetailsForm,
  AssetAllocationBuilder,
  PortfolioSummary,
  PortfolioActions,
  type Asset,
  type PortfolioAsset,
  type ExistingPortfolio,
} from "./_components";
import type { AssetType } from "@/types";

// Mock assets for selection
const availableAssets: Asset[] = [
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "Equities",
  },
  {
    symbol: "VXUS",
    name: "Vanguard Total International Stock ETF",
    type: "Equities",
  },
  {
    symbol: "BND",
    name: "Vanguard Total Bond Market ETF",
    type: "Fixed Income",
  },
  {
    symbol: "BNDX",
    name: "Vanguard Total International Bond ETF",
    type: "Fixed Income",
  },
  {
    symbol: "VNQ",
    name: "Vanguard Real Estate Index Fund ETF",
    type: "Alternatives",
  },
  {
    symbol: "IAU",
    name: "iShares Gold Trust",
    type: "Alternatives",
  },
  {
    symbol: "VMOT",
    name: "Vanguard Short-Term Inflation-Protected Securities ETF",
    type: "Fixed Income",
  },
  { symbol: "CASH", name: "Cash Reserves", type: "Cash" },
];

export default function PortfolioBuilderPage() {
  const [selectedPortfolioId, setSelectedPortfolioId] = React.useState<
    number | null
  >(null);
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);
  const [portfolioName, setPortfolioName] = React.useState("");
  const [portfolioDescription, setPortfolioDescription] = React.useState("");
  const [riskLevel, setRiskLevel] = React.useState<"Low" | "Medium" | "High">(
    "Medium"
  );
  const [assets, setAssets] = React.useState<PortfolioAsset[]>([]);

  // Calculate total allocation percentage
  const totalAllocation = assets.reduce(
    (sum, asset) => sum + asset.allocation,
    0
  );
  const isValidAllocation = totalAllocation === 100;

  // Mock existing portfolios for selector
  const existingPortfolios: ExistingPortfolio[] = [
    { id: 1, name: "Conservative Portfolio" },
    { id: 2, name: "Moderate Portfolio" },
    { id: 3, name: "Aggressive Portfolio" },
  ];

  const handleNewPortfolio = () => {
    setIsCreatingNew(true);
    setSelectedPortfolioId(null);
    setPortfolioName("");
    setPortfolioDescription("");
    setRiskLevel("Medium");
    setAssets([]);
  };

  const handlePortfolioSelect = (portfolioId: number) => {
    setSelectedPortfolioId(portfolioId);
    setIsCreatingNew(false);
    // In a real app, this would load the portfolio data
    const portfolio = existingPortfolios.find((p) => p.id === portfolioId);
    if (portfolio) {
      setPortfolioName(portfolio.name);
      setPortfolioDescription("Example portfolio description");
      // Load existing assets...
    }
  };

  const handleAddAsset = (asset: Asset) => {
    if (!assets.find((a) => a.symbol === asset.symbol)) {
      setAssets([
        ...assets,
        {
          ...asset,
          allocation: 0,
        },
      ]);
    }
  };

  const handleRemoveAsset = (symbol: string) => {
    setAssets(assets.filter((a) => a.symbol !== symbol));
  };

  const handleAllocationChange = (symbol: string, allocation: number) => {
    setAssets(
      assets.map((asset) =>
        asset.symbol === symbol ? { ...asset, allocation } : asset
      )
    );
  };

  const handleAssetTypeChange = (symbol: string, type: AssetType) => {
    setAssets(
      assets.map((asset) =>
        asset.symbol === symbol ? { ...asset, type } : asset
      )
    );
  };

  const handleSave = () => {
    if (!isValidAllocation || !portfolioName.trim()) return;

    // In a real app, this would save to the backend
    console.log("Saving portfolio:", {
      name: portfolioName,
      description: portfolioDescription,
      riskLevel,
      assets,
    });

    // Show success message
    toast.success("Portfolio saved successfully!", {
      description: "Your portfolio has been created and saved.",
    });
  };

  const handleReset = () => {
    setPortfolioName("");
    setPortfolioDescription("");
    setRiskLevel("Medium");
    setAssets([]);
  };

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
              {/* Portfolio Selector */}
              <PortfolioSelector
                existingPortfolios={existingPortfolios}
                selectedPortfolioId={selectedPortfolioId}
                onPortfolioSelect={handlePortfolioSelect}
                onNewPortfolio={handleNewPortfolio}
              />

              {(isCreatingNew || selectedPortfolioId) && (
                <>
                  {/* Portfolio Details */}
                  <PortfolioDetailsForm
                    portfolioName={portfolioName}
                    portfolioDescription={portfolioDescription}
                    riskLevel={riskLevel}
                    onPortfolioNameChange={setPortfolioName}
                    onPortfolioDescriptionChange={setPortfolioDescription}
                    onRiskLevelChange={setRiskLevel}
                  />

                  {/* Asset Allocation Builder */}
                  <AssetAllocationBuilder
                    assets={assets}
                    availableAssets={availableAssets}
                    onAddAsset={handleAddAsset}
                    onRemoveAsset={handleRemoveAsset}
                    onAllocationChange={handleAllocationChange}
                    onAssetTypeChange={handleAssetTypeChange}
                  />

                  {/* Portfolio Summary */}
                  <PortfolioSummary
                    assets={assets}
                    totalAllocation={totalAllocation}
                    isValidAllocation={isValidAllocation}
                  />

                  {/* Actions */}
                  <PortfolioActions
                    isValidAllocation={isValidAllocation}
                    portfolioName={portfolioName}
                    onSave={handleSave}
                    onReset={handleReset}
                  />
                </>
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
