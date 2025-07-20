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
import { Plus } from "lucide-react";
import type { Asset, PortfolioAsset } from "@/types";

interface AssetSearchDialogProps {
  availableAssets: Asset[];
  existingAssets: PortfolioAsset[];
  onAddAsset: (asset: Asset) => void;
}

export function AssetSearchDialog({
  availableAssets,
  existingAssets,
  onAddAsset,
}: AssetSearchDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);

  const handleAddAsset = () => {
    if (
      selectedAsset &&
      !existingAssets.find((a) => a.symbol === selectedAsset.symbol)
    ) {
      onAddAsset(selectedAsset);
      setOpen(false);
      setSelectedAsset(null);
    }
  };

  const filteredAssets = availableAssets.filter(
    (asset) => !existingAssets.find((a) => a.symbol === asset.symbol)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Search and select an asset to add to your portfolio
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search assets..." />
          <CommandList>
            <CommandEmpty>No assets found.</CommandEmpty>
            <CommandGroup>
              {filteredAssets.map((asset) => (
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
          </CommandList>
        </Command>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
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
