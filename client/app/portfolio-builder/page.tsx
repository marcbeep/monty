"use client";

import * as React from "react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LoaderScreen } from "@/components/shared/loader-screen";
import {
  PortfolioSelector,
  PortfolioDetailsForm,
  AssetAllocationBuilder,
  PortfolioSummary,
  PortfolioActions,
  type Asset,
  type PortfolioAsset,
} from "./_components";
import type { AssetType, PortfolioResponse } from "@/types";
import { portfolioApi } from "@/lib/portfolio-api";
import { handleApiError } from "@/lib/api";

// Assets are now loaded dynamically via real-time search

export default function PortfolioBuilderPage() {
  const [portfolios, setPortfolios] = React.useState<PortfolioResponse[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = React.useState<
    string | null
  >(null);
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);
  const [portfolioName, setPortfolioName] = React.useState("");
  const [portfolioDescription, setPortfolioDescription] = React.useState("");
  const [riskLevel, setRiskLevel] = React.useState<"Low" | "Medium" | "High">(
    "Medium"
  );
  const [assets, setAssets] = React.useState<PortfolioAsset[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasInitialLoaded, setHasInitialLoaded] = React.useState(false);
  const [progress, setProgress] = React.useState(10);

  // Calculate total allocation percentage
  const totalAllocation = assets.reduce(
    (sum, asset) => sum + asset.allocation,
    0
  );
  const isValidAllocation = totalAllocation === 100;

  // Load portfolios on mount (ProtectedRoute ensures user is authenticated)
  React.useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const data = await portfolioApi.getPortfolios();
        setPortfolios(data);
        setProgress((p) => (p < 60 ? 60 : p));
      } catch (error) {
        handleApiError(error);
        setPortfolios([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolios();
  }, []);

  // Mark initial load complete when we have finished initial fetch
  React.useEffect(() => {
    if (!hasInitialLoaded && !isLoading) {
      setProgress(100);
      const t = setTimeout(() => setHasInitialLoaded(true), 200);
      return () => clearTimeout(t);
    }
  }, [hasInitialLoaded, isLoading]);

  // Safety timeout to prevent perpetual loading overlay
  React.useEffect(() => {
    if (hasInitialLoaded) return;
    const timeout = setTimeout(() => setHasInitialLoaded(true), 10000);
    return () => clearTimeout(timeout);
  }, [hasInitialLoaded]);

  const handleNewPortfolio = () => {
    setIsCreatingNew(true);
    setSelectedPortfolioId(null);
    setPortfolioName("");
    setPortfolioDescription("");
    setRiskLevel("Medium");
    setAssets([]);
  };

  const handlePortfolioSelect = async (portfolioId: string) => {
    try {
      setIsLoading(true);
      const portfolio = await portfolioApi.getPortfolio(portfolioId);

      setSelectedPortfolioId(portfolioId);
      setIsCreatingNew(false);
      setPortfolioName(portfolio.name);
      setPortfolioDescription(portfolio.description || "");
      setRiskLevel(portfolio.riskLevel);
      setAssets(
        portfolio.assets.map((asset) => ({
          symbol: asset.symbol,
          name: asset.name,
          type: asset.type,
          allocation: asset.allocation,
        }))
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAsset = (asset: Asset) => {
    if (!assets.find((a) => a.symbol === asset.symbol)) {
      setAssets([...assets, { ...asset, allocation: 0 }]);
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

  const handleSave = async () => {
    if (!isValidAllocation || !portfolioName.trim()) return;

    setIsSaving(true);
    try {
      // Only include assets with non-zero allocation
      const assetsWithAllocation = assets.filter(
        (asset) => asset.allocation > 0
      );

      const portfolioData = {
        name: portfolioName,
        description: portfolioDescription || undefined,
        riskLevel,
        assets: assetsWithAllocation.map((asset) => ({
          symbol: asset.symbol,
          name: asset.name,
          type: asset.type,
          allocation: asset.allocation,
        })),
      };

      if (selectedPortfolioId && !isCreatingNew) {
        // Update existing portfolio
        const updatedPortfolio = await portfolioApi.updatePortfolio(
          selectedPortfolioId,
          portfolioData
        );
        setPortfolios((prev) =>
          prev.map((p) => (p.id === selectedPortfolioId ? updatedPortfolio : p))
        );
        toast.success("Portfolio updated successfully!");
      } else {
        // Create new portfolio
        const newPortfolio = await portfolioApi.createPortfolio(portfolioData);
        setPortfolios((prev) => [newPortfolio, ...prev]);
        setSelectedPortfolioId(newPortfolio.id);
        setIsCreatingNew(false);
        toast.success("Portfolio created successfully!");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPortfolioName("");
    setPortfolioDescription("");
    setRiskLevel("Medium");
    setAssets([]);
  };

  const handleDelete = async (portfolioId: string) => {
    try {
      await portfolioApi.deletePortfolio(portfolioId);
      setPortfolios((prev) => prev.filter((p) => p.id !== portfolioId));

      if (selectedPortfolioId === portfolioId) {
        setSelectedPortfolioId(null);
        setIsCreatingNew(false);
        handleReset();
      }

      toast.success("Portfolio deleted successfully!");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <ProtectedRoute>
      {!hasInitialLoaded && (
        <LoaderScreen
          title="Loading portfolio builder"
          description="Fetching your portfolios..."
          progress={progress}
        />
      )}
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
                portfolios={portfolios}
                selectedPortfolioId={selectedPortfolioId}
                onPortfolioSelect={handlePortfolioSelect}
                onNewPortfolio={handleNewPortfolio}
                onDeletePortfolio={handleDelete}
                isLoading={isLoading}
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
                    isSaving={isSaving}
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
