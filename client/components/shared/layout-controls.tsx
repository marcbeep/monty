"use client";

import { Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type SidebarVariant = "inset" | "sidebar" | "floating";
type SidebarCollapsible = "icon" | "offcanvas";
type ContentLayout = "centered" | "full-width";

type LayoutControlsProps = {
  readonly variant?: SidebarVariant;
  readonly collapsible?: SidebarCollapsible;
  readonly contentLayout?: ContentLayout;
  readonly onVariantChange?: (variant: SidebarVariant) => void;
  readonly onCollapsibleChange?: (collapsible: SidebarCollapsible) => void;
  readonly onContentLayoutChange?: (layout: ContentLayout) => void;
};

export function LayoutControls({
  variant = "inset",
  collapsible = "offcanvas",
  contentLayout = "full-width",
  onVariantChange,
  onCollapsibleChange,
  onContentLayoutChange,
}: LayoutControlsProps) {
  const [localVariant, setLocalVariant] = useState<SidebarVariant>(variant);
  const [localCollapsible, setLocalCollapsible] =
    useState<SidebarCollapsible>(collapsible);
  const [localContentLayout, setLocalContentLayout] =
    useState<ContentLayout>(contentLayout);

  const handleVariantChange = (value: string) => {
    const newVariant = value as SidebarVariant;
    setLocalVariant(newVariant);
    onVariantChange?.(newVariant);
  };

  const handleCollapsibleChange = (value: string) => {
    const newCollapsible = value as SidebarCollapsible;
    setLocalCollapsible(newCollapsible);
    onCollapsibleChange?.(newCollapsible);
  };

  const handleContentLayoutChange = (value: string) => {
    const newLayout = value as ContentLayout;
    setLocalContentLayout(newLayout);
    onContentLayoutChange?.(newLayout);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="h-9 w-9">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Layout settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-4">
        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <h4 className="text-sm leading-none font-medium">
              Layout Settings
            </h4>
            <p className="text-muted-foreground text-xs">
              Customize your dashboard layout preferences.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Sidebar Variant</Label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={localVariant}
                onValueChange={handleVariantChange}
              >
                <ToggleGroupItem
                  className="text-xs"
                  value="inset"
                  aria-label="Toggle inset"
                >
                  Inset
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="text-xs"
                  value="sidebar"
                  aria-label="Toggle sidebar"
                >
                  Sidebar
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="text-xs"
                  value="floating"
                  aria-label="Toggle floating"
                >
                  Floating
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Sidebar Collapsible</Label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={localCollapsible}
                onValueChange={handleCollapsibleChange}
              >
                <ToggleGroupItem
                  className="text-xs"
                  value="icon"
                  aria-label="Toggle icon"
                >
                  Icon
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="text-xs"
                  value="offcanvas"
                  aria-label="Toggle offcanvas"
                >
                  OffCanvas
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Content Layout</Label>
              <ToggleGroup
                className="w-full"
                size="sm"
                variant="outline"
                type="single"
                value={localContentLayout}
                onValueChange={handleContentLayoutChange}
              >
                <ToggleGroupItem
                  className="text-xs"
                  value="centered"
                  aria-label="Toggle centered"
                >
                  Centered
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="text-xs"
                  value="full-width"
                  aria-label="Toggle full-width"
                >
                  Full Width
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
