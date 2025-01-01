"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Search,
  User,
  Briefcase,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/components/user/UserContext";
import { useSession } from "next-auth/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { status } = useSession();

  // Warte auf die Session
  if (status === "loading") return null;

  const data = {
    user: {
      username: user?.username || "Guest",
      email: user?.email || "",
      avatar: user?.avatar || "/avatars/shadcn.jpg",
    },
    appInfo: {
      name: "Todo Stream",
      description: "Your Todo App",
      icon: GalleryVerticalEnd, // hier kommt das logo hin
      url: "/protected",
    },
    navMain: [
      {
        title: "Tasks",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Upcoming",
            url: "#",
          },
          {
            title: "Today",
            url: "#",
          },
          {
            title: "Calendar",
            url: "#",
          },
        ],
      },
      {
        title: "Find by category",
        url: "#",
        icon: Search,
        items: [
          {
            title: "Collaboration",
            url: "#",
          },
          {
            title: "Categories",
            url: "#",
          },
          {
            title: "Personal",
            url: "#",
          },
          {
            title: "Work",
            url: "#",
          },
          {
            title: "School",
            url: "#",
          },
          {
            title: "Low priority",
            url: "#",
          },
          {
            title: "Urgent",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Profile",
            url: "/protected/settings/profile",
          },
          {
            title: "Theme",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          href={data.appInfo.url}
          className="group hover:no-underline transition-all duration-1000"
        >
          <div className="flex items-center space-x-4 rounded-lg p-2 transition-all duration-200 group-hover:bg-gray-200">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <data.appInfo.icon className="size-5" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="text-base font-semibold transition-all duration-1000">
                {data.appInfo.name}
              </h2>
              <p className="text-sm text-gray-700">
                {data.appInfo.description}
              </p>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
