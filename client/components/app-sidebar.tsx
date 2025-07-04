"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconPuzzle,
  IconScale,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Monty User",
    email: "user@monty.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Portfolio Builder",
      url: "/portfolio-builder",
      icon: IconPuzzle,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
    {
      title: "Scenario Explorer",
      url: "/scenario-explorer",
      icon: IconSearch,
    },
    {
      title: "Simulator",
      url: "/simulator",
      icon: IconScale,
    },
    {
      title: "Portfolio Comparison",
      url: "/portfolio-comparison",
      icon: IconUsers,
    },
    {
      title: "Docs",
      url: "/docs",
      icon: IconFileDescription,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Monty Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-base font-semibold">Monty</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
