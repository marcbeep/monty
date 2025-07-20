"use client";
import * as React from "react";
import {
  Search,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  Building,
  Target,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const searchItems = [
  {
    group: "Dashboard",
    icon: BarChart3,
    label: "Dashboard",
    url: "/dashboard",
  },
  {
    group: "Features",
    icon: Building,
    label: "Portfolio Builder",
    url: "/portfolio-builder",
  },
  {
    group: "Features",
    icon: Target,
    label: "Backtester",
    url: "/backtester",
  },
  {
    group: "Features",
    icon: Users,
    label: "Portfolio Comparison",
    url: "/portfolio-comparison",
  },
  { group: "Settings", icon: Settings, label: "Settings", url: "/settings" },
  { group: "Help", icon: HelpCircle, label: "Get Help", url: "/help" },
];

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    // In a real app, you'd use router.push(url) here
    window.location.href = url;
  };

  return (
    <>
      <div
        className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm hover:text-foreground transition-colors"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Search
        <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium select-none">
          <span className="text-xs">⌘</span>J
        </kbd>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search features, pages, and more…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {[...new Set(searchItems.map((item) => item.group))].map(
            (group, i) => (
              <React.Fragment key={group}>
                {i !== 0 && <CommandSeparator />}
                <CommandGroup heading={group} key={group}>
                  {searchItems
                    .filter((item) => item.group === group)
                    .map((item) => (
                      <CommandItem
                        className="!py-1.5"
                        key={item.label}
                        onSelect={() => handleSelect(item.url)}
                      >
                        {item.icon && <item.icon className="size-4" />}
                        <span>{item.label}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </React.Fragment>
            )
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
