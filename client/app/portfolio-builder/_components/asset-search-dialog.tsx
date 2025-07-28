"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Loader2 } from "lucide-react";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { stockApi, transformToAsset } from "@/lib/stock-api";
import type { Asset, PortfolioAsset } from "@/types";

interface AssetSearchDialogProps {
  existingAssets: PortfolioAsset[];
  onAddAsset: (asset: Asset) => void;
}

export function AssetSearchDialog({
  existingAssets,
  onAddAsset,
}: AssetSearchDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);

  const { query, setQuery, results, isLoading, error } = useDebouncedSearch(
    React.useCallback(
      (searchQuery: string) => stockApi.searchStocks(searchQuery, 20),
      []
    ),
    300
  );

  const handleAddAsset = () => {
    if (
      selectedAsset &&
      !existingAssets.find((a) => a.symbol === selectedAsset.symbol)
    ) {
      onAddAsset(selectedAsset);
      setOpen(false);
      setSelectedAsset(null);
      setQuery("");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedAsset(null);
      setQuery("");
    }
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    setSelectedAsset(null);
  };

  // Filter out assets that are already in the portfolio
  const availableAssets = results
    .map(transformToAsset)
    .filter((asset) => !existingAssets.find((a) => a.symbol === asset.symbol));

  const showNoResults =
    query.length >= 2 && !isLoading && availableAssets.length === 0 && !error;
  const showMinLength = query.length > 0 && query.length < 2;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            Search for stocks, ETFs, or other assets to add to your portfolio
          </DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search for stocks (e.g., AAPL, Tesla, VTI)..."
            value={query}
            onValueChange={handleSearch}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="size-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">
                  Searching...
                </span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center p-4">
                <span className="text-sm text-destructive">Error: {error}</span>
              </div>
            )}

            {showMinLength && (
              <CommandEmpty>Type at least 2 characters to search</CommandEmpty>
            )}

            {showNoResults && (
              <CommandEmpty>No assets found for "{query}"</CommandEmpty>
            )}

            {!isLoading && availableAssets.length > 0 && (
              <CommandGroup heading="Search Results">
                {availableAssets.map((asset) => (
                  <CommandItem
                    key={asset.symbol}
                    onSelect={() => setSelectedAsset(asset)}
                    className={
                      selectedAsset?.symbol === asset.symbol ? "bg-accent" : ""
                    }
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{asset.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.name}
                        </div>
                      </div>
                      <Badge variant="outline">{asset.type}</Badge>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddAsset} disabled={!selectedAsset}>
            Add Asset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
