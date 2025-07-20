"use client";

import * as React from "react";
import { BarChart3, Building, Users, Target } from "lucide-react";
import Image from "next/image";

import { NavMain } from "@/components/shared/nav-main";
import { NavUser } from "@/components/shared/nav-user";
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
      icon: BarChart3,
    },
    {
      title: "Portfolio Builder",
      url: "/portfolio-builder",
      icon: Building,
    },
    {
      title: "Backtester",
      url: "/backtester",
      icon: Target,
    },
    {
      title: "Portfolio Comparison",
      url: "/portfolio-comparison",
      icon: Users,
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
                <div className="relative w-6 h-6 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Monty Logo"
                    width={24}
                    height={24}
                    className="object-cover rounded-lg"
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
