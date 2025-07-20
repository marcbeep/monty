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
import { Plus, Minus, Search } from "lucide-react";
import { AssetSearchDialog } from "./asset-search-dialog";
import type { Asset, PortfolioAsset } from "./types";

interface AssetAllocationBuilderProps {
  assets: PortfolioAsset[];
  availableAssets: Asset[];
  onAddAsset: (asset: Asset) => void;
  onRemoveAsset: (symbol: string) => void;
  onAllocationChange: (symbol: string, allocation: number) => void;
}

export function AssetAllocationBuilder({
  assets,
  availableAssets,
  onAddAsset,
  onRemoveAsset,
  onAllocationChange,
}: AssetAllocationBuilderProps) {
  const handleAddAsset = (asset: Asset) => {
    onAddAsset(asset);
  };

  const handleAllocationChange = (symbol: string, allocation: number) => {
    onAllocationChange(symbol, Math.max(0, Math.min(100, allocation)));
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
            availableAssets={availableAssets}
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
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{asset.symbol}</span>
                    <Badge variant="outline">{asset.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{asset.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleAllocationChange(asset.symbol, asset.allocation - 5)
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
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleAllocationChange(asset.symbol, asset.allocation + 5)
                    }
                    disabled={asset.allocation >= 100}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRemoveAsset(asset.symbol)}
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
  );
}
