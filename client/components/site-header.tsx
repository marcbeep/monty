"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchDialog } from "@/components/search-dialog";

export function SiteHeader() {
  const pathname = usePathname();

  // Function to get page title based on current path
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/portfolio-builder":
        return "Portfolio Builder";
      case "/analytics":
        return "Analytics";
      case "/scenario-explorer":
        return "Scenario Explorer";
      case "/simulator":
        return "Simulator";
      case "/portfolio-comparison":
        return "Portfolio Comparison";
      case "/docs":
        return "Docs";
      default:
        return "Dashboard"; // Default fallback
    }
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <SearchDialog />
        </div>
      </div>
    </header>
  );
}
