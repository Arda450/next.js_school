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
import { useTodos } from "@/components/todos/TodoContext";
import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { status } = useSession();
  const router = useRouter(); // NEU: Router importieren
  const { setActiveTag, activeTag } = useTodos();

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
    }
  };

  const handleProfileClick = () => {
    router.push("/protected/settings/profile");
  };

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
        id: "tasks",
        title: "Tasks",
        icon: SquareTerminal,
        items: [
          {
            id: "upcoming",
            title: "Upcoming",
          },
          {
            id: "today",
            title: "Today",
          },
          {
            id: "calendar",
            title: "Calendar",
          },
        ],
      },
      {
        id: "categories",
        title: "Find by category",
        icon: Search,
        items: [
          {
            id: "collaboration",
            title: "Collaboration",
          },
          {
            id: "categories",
            title: "Categories",
          },
          {
            id: "personal",
            title: "Personal",
            onClick: () => handleTagClick("Personal"),
            active: activeTag === "Personal",
          },
          {
            id: "work",
            title: "Work",
            onClick: () => handleTagClick("Work"),
            active: activeTag === "Work",
          },
          {
            id: "school",
            title: "School",
            onClick: () => handleTagClick("School"),
            active: activeTag === "School",
          },
          {
            id: "low_priority",
            title: "Low priority",
            onClick: () => handleTagClick("Low Priority"),
            active: activeTag === "Low Priority",
          },
          {
            id: "urgent",
            title: "Urgent",
            onClick: () => handleTagClick("Urgent"),
            active: activeTag === "Urgent",
          },
        ],
      },
      {
        id: "settings",
        title: "Settings",
        icon: Settings2,
        items: [
          {
            id: "profile",
            title: "Profile",
            icon: User,
            onClick: handleProfileClick, // NEU: Click-Handler statt URL
          },
          {
            id: "theme",
            title: "Theme",
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
          className="group hover:no-underline transition-all duration-1000 cursor-pointer"
        >
          <div className="flex items-center space-x-4 rounded-lg p-2 transition-all duration-200 group-hover:bg-gray-200 cursor-pointer">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground cursor-pointer">
              <data.appInfo.icon className="size-5" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="text-base font-semibold transition-all duration-1000 cursor-pointer">
                {data.appInfo.name}
              </h2>
              <p className="text-sm text-gray-700 cursor-pointer">
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
