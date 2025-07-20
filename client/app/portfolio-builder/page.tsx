"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Building,
  Plus,
  Minus,
  Search,
  TrendingUp,
  Shield,
  Zap,
  Save,
  RotateCcw,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  MiniPieChart,
  MiniPieChartLegend,
} from "@/components/ui/mini-pie-chart";
import type { Portfolio, AssetType, AssetAllocation } from "@/lib/mock-data";

// Mock assets for selection
const availableAssets = [
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "Equities" as AssetType,
  },
  {
    symbol: "VXUS",
    name: "Vanguard Total International Stock ETF",
    type: "Equities" as AssetType,
  },
  {
    symbol: "BND",
    name: "Vanguard Total Bond Market ETF",
    type: "Fixed Income" as AssetType,
  },
  {
    symbol: "BNDX",
    name: "Vanguard Total International Bond ETF",
    type: "Fixed Income" as AssetType,
  },
  {
    symbol: "VNQ",
    name: "Vanguard Real Estate Index Fund ETF",
    type: "Alternatives" as AssetType,
  },
  {
    symbol: "IAU",
    name: "iShares Gold Trust",
    type: "Alternatives" as AssetType,
  },
  {
    symbol: "VMOT",
    name: "Vanguard Short-Term Inflation-Protected Securities ETF",
    type: "Fixed Income" as AssetType,
  },
  { symbol: "CASH", name: "Cash Reserves", type: "Cash" as AssetType },
];

interface PortfolioAsset {
  symbol: string;
  name: string;
  type: AssetType;
  allocation: number;
}

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
  const [isAddAssetOpen, setIsAddAssetOpen] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<
    (typeof availableAssets)[0] | null
  >(null);

  // Calculate total allocation percentage
  const totalAllocation = assets.reduce(
    (sum, asset) => sum + asset.allocation,
    0
  );
  const isValidAllocation = totalAllocation === 100;

  // Mock existing portfolios for selector
  const existingPortfolios = [
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

  const handleAddAsset = () => {
    if (
      selectedAsset &&
      !assets.find((a) => a.symbol === selectedAsset.symbol)
    ) {
      setAssets([
        ...assets,
        {
          ...selectedAsset,
          allocation: 0,
        },
      ]);
      setIsAddAssetOpen(false);
      setSelectedAsset(null);
    }
  };

  const handleRemoveAsset = (symbol: string) => {
    setAssets(assets.filter((a) => a.symbol !== symbol));
  };

  const handleAllocationChange = (symbol: string, allocation: number) => {
    setAssets(
      assets.map((asset) =>
        asset.symbol === symbol
          ? { ...asset, allocation: Math.max(0, Math.min(100, allocation)) }
          : asset
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

    // Reset form or show success message
    alert("Portfolio saved successfully!");
  };

  const handleReset = () => {
    setPortfolioName("");
    setPortfolioDescription("");
    setRiskLevel("Medium");
    setAssets([]);
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low":
        return Shield;
      case "Medium":
        return TrendingUp;
      case "High":
        return Zap;
      default:
        return TrendingUp;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "High":
        return "bg-red-500/10 text-red-700 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  // Generate asset allocation for chart
  const assetAllocation: AssetAllocation[] = React.useMemo(() => {
    const typeMap = new Map<AssetType, number>();
    assets.forEach((asset) => {
      const current = typeMap.get(asset.type) || 0;
      typeMap.set(asset.type, current + asset.allocation);
    });

    const colors = {
      Equities: "#16a34a",
      "Fixed Income": "#22c55e",
      Alternatives: "#166534",
      Cash: "#84cc16",
    };

    return Array.from(typeMap.entries()).map(([type, percentage]) => ({
      type,
      percentage,
      color: colors[type] || "#6b7280",
    }));
  }, [assets]);

  return (
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
            <Card className="@container/card bg-surface-primary shadow-sm">
              <CardHeader>
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                  <div className="space-y-1.5">
                    <CardTitle className="font-bold flex items-center gap-2">
                      <Building className="h-6 w-6" />
                      Portfolio Builder
                    </CardTitle>
                    <CardDescription>
                      Create and customize your investment portfolio strategy
                    </CardDescription>
                  </div>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                    <Select
                      value={selectedPortfolioId?.toString() || ""}
                      onValueChange={(value) =>
                        value ? handlePortfolioSelect(Number(value)) : undefined
                      }
                    >
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select Portfolio" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingPortfolios.map((portfolio) => (
                          <SelectItem
                            key={portfolio.id}
                            value={portfolio.id.toString()}
                          >
                            {portfolio.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleNewPortfolio}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="size-4" />
                      New Portfolio
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {(isCreatingNew || selectedPortfolioId) && (
              <>
                {/* Portfolio Details */}
                <Card className="@container/card bg-surface-primary shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-bold">
                      Portfolio Details
                    </CardTitle>
                    <CardDescription>
                      Configure your portfolio's basic information and risk
                      profile
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
                          onChange={(e) => setPortfolioName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="risk-level">Risk Level</Label>
                        <Select
                          value={riskLevel}
                          onValueChange={(value: "Low" | "Medium" | "High") =>
                            setRiskLevel(value)
                          }
                        >
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
                        onChange={(e) =>
                          setPortfolioDescription(e.target.value)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Asset Allocation Builder */}
                <Card className="@container/card bg-surface-primary shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-bold">
                          Asset Allocation
                        </CardTitle>
                        <CardDescription>
                          Add assets and set allocation percentages (must total
                          100%)
                        </CardDescription>
                      </div>
                      <Dialog
                        open={isAddAssetOpen}
                        onOpenChange={setIsAddAssetOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Plus className="size-4" />
                            Add Asset
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Asset</DialogTitle>
                            <DialogDescription>
                              Search and select an asset to add to your
                              portfolio
                            </DialogDescription>
                          </DialogHeader>
                          <Command>
                            <CommandInput placeholder="Search assets..." />
                            <CommandList>
                              <CommandEmpty>No assets found.</CommandEmpty>
                              <CommandGroup>
                                {availableAssets
                                  .filter(
                                    (asset) =>
                                      !assets.find(
                                        (a) => a.symbol === asset.symbol
                                      )
                                  )
                                  .map((asset) => (
                                    <CommandItem
                                      key={asset.symbol}
                                      onSelect={() => setSelectedAsset(asset)}
                                      className={
                                        selectedAsset?.symbol === asset.symbol
                                          ? "bg-accent"
                                          : ""
                                      }
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <div>
                                          <div className="font-medium">
                                            {asset.symbol}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {asset.name}
                                          </div>
                                        </div>
                                        <Badge variant="outline">
                                          {asset.type}
                                        </Badge>
                                      </div>
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsAddAssetOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAddAsset}
                              disabled={!selectedAsset}
                            >
                              Add Asset
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {assets.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No assets added yet</p>
                        <p className="text-sm">
                          Click "Add Asset" to start building your portfolio
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {assets.map((asset) => (
                          <div
                            key={asset.symbol}
                            className="flex items-center gap-4 p-4 border rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {asset.symbol}
                                </span>
                                <Badge variant="outline">{asset.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {asset.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleAllocationChange(
                                    asset.symbol,
                                    asset.allocation - 5
                                  )
                                }
                                disabled={asset.allocation <= 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <div className="w-20 text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={asset.allocation}
                                  onChange={(e) =>
                                    handleAllocationChange(
                                      asset.symbol,
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="text-center"
                                />
                                <span className="text-xs text-muted-foreground">
                                  %
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleAllocationChange(
                                    asset.symbol,
                                    asset.allocation + 5
                                  )
                                }
                                disabled={asset.allocation >= 100}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveAsset(asset.symbol)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Portfolio Summary */}
                {assets.length > 0 && (
                  <Card className="@container/card bg-surface-primary shadow-sm">
                    <CardHeader>
                      <CardTitle className="font-bold">
                        Portfolio Summary
                      </CardTitle>
                      <CardDescription>
                        Preview your portfolio allocation and validation status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              Total Allocation
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold ${
                                  isValidAllocation
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {totalAllocation}%
                              </span>
                              {isValidAllocation ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Risk Level</span>
                              {(() => {
                                const Icon = getRiskIcon(riskLevel);
                                return (
                                  <Badge className={getRiskColor(riskLevel)}>
                                    <Icon className="h-3 w-3" />
                                    {riskLevel} Risk
                                  </Badge>
                                );
                              })()}
                            </div>

                            <div className="space-y-1">
                              <span className="text-sm font-medium">
                                Asset Distribution
                              </span>
                              {assetAllocation.map((allocation) => (
                                <div
                                  key={allocation.type}
                                  className="flex justify-between text-sm"
                                >
                                  <span>{allocation.type}</span>
                                  <span>
                                    {allocation.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                          <div className="text-center">
                            <MiniPieChart
                              allocations={assetAllocation}
                              size={120}
                            />
                            <MiniPieChartLegend
                              allocations={assetAllocation}
                              className="text-sm mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <Card className="@container/card bg-surface-primary shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                      <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="size-4" />
                        Reset
                      </Button>
                      <Button
                        variant="outline"
                        disabled={!isValidAllocation || !portfolioName.trim()}
                      >
                        <Eye className="size-4" />
                        Preview
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={!isValidAllocation || !portfolioName.trim()}
                      >
                        <Save className="size-4" />
                        Save Portfolio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
