"use client";

import * as React from "react";
import {
  BarChart3,
  Building,
  TrendingUp,
  Search,
  Scale,
  Users,
  FileText,
  LogIn,
  UserPlus,
} from "lucide-react";
import Image from "next/image";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
      title: "Analytics",
      url: "/analytics",
      icon: TrendingUp,
    },
    {
      title: "Scenario Explorer",
      url: "/scenario-explorer",
      icon: Search,
    },
    {
      title: "Simulator",
      url: "/simulator",
      icon: Scale,
    },
    {
      title: "Portfolio Comparison",
      url: "/portfolio-comparison",
      icon: Users,
    },
    {
      title: "Docs",
      url: "/docs",
      icon: FileText,
    },
  ],
  navAuth: [
    {
      title: "Login",
      url: "/login",
      icon: LogIn,
    },
    {
      title: "Register",
      url: "/register",
      icon: UserPlus,
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
        <SidebarGroup>
          <SidebarGroupLabel>Authentication</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navAuth.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
