"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Search, X } from "lucide-react";
import { AssetSearchDialog } from "./asset-search-dialog";
import type { Asset, PortfolioAsset, AssetType } from "@/types";

interface AssetAllocationBuilderProps {
  assets: PortfolioAsset[];
  onAddAsset: (asset: Asset) => void;
  onRemoveAsset: (symbol: string) => void;
  onAllocationChange: (symbol: string, allocation: number) => void;
  onAssetTypeChange?: (symbol: string, type: AssetType) => void;
}

const ASSET_CLASSES: AssetType[] = [
  "Equities",
  "Fixed Income",
  "Alternatives",
  "Cash",
];

export function AssetAllocationBuilder({
  assets,
  onAddAsset,
  onRemoveAsset,
  onAllocationChange,
  onAssetTypeChange,
}: AssetAllocationBuilderProps) {
  const handleAddAsset = (asset: Asset) => {
    onAddAsset(asset);
  };

  const handleAllocationChange = (symbol: string, allocation: number) => {
    onAllocationChange(symbol, Math.max(0, Math.min(100, allocation)));
  };

  const handleAssetTypeChange = (symbol: string, type: AssetType) => {
    if (onAssetTypeChange) {
      onAssetTypeChange(symbol, type);
    }
  };

  return (
    <Card className="@container/card bg-surface-primary shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-bold">Asset Allocation</CardTitle>
            <CardDescription>
              Add assets and set allocation percentages (must total 100%)
            </CardDescription>
          </div>
          <AssetSearchDialog
            existingAssets={assets}
            onAddAsset={handleAddAsset}
          />
        </div>
      </CardHeader>
      <CardContent>
        {assets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No assets added yet</p>
            <p className="text-sm">
              Click &quot;Add Asset&quot; to start building your portfolio
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-surface-secondary"
              >
                {/* Asset Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">
                      {asset.symbol}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-financial-neutral text-financial-neutral"
                    >
                      {asset.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {asset.name}
                  </p>
                </div>

                {/* Asset Class Dropdown */}
                <div className="w-full sm:w-auto">
                  <Select
                    value={asset.type}
                    onValueChange={(value: AssetType) =>
                      handleAssetTypeChange(asset.symbol, value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Asset Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSET_CLASSES.map((assetClass) => (
                        <SelectItem key={assetClass} value={assetClass}>
                          {assetClass}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Allocation Controls */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleAllocationChange(
                        asset.symbol,
                        Math.max(0, asset.allocation - 1)
                      )
                    }
                    disabled={asset.allocation <= 0}
                    className="h-9 w-9 shrink-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center justify-center min-w-[100px]">
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={asset.allocation}
                        onChange={(e) => {
                          const value = e.target.value;
                          const intValue = parseInt(value) || 0;
                          const clampedValue = Math.max(
                            0,
                            Math.min(100, intValue)
                          );
                          handleAllocationChange(asset.symbol, clampedValue);
                        }}
                        className="w-24 text-center pr-6 font-numerical"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleAllocationChange(
                        asset.symbol,
                        Math.min(100, asset.allocation + 1)
                      )
                    }
                    disabled={asset.allocation >= 100}
                    className="h-9 w-9 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRemoveAsset(asset.symbol)}
                    className="h-9 w-9 shrink-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
