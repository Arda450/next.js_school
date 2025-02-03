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
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useTodos } from "@/components/todos/todo-context";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { status } = useSession();
  const router = useRouter();
  const { setActiveTag, activeTag } = useTodos();
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const isHomePage = pathname === "/protected";

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
    appInfo: {
      name: "Todo Stream",
      description: "Your Todo App",
      icon: "/images/icon.svg",
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
        isHidden: !isHomePage, // Verstecke die Kategorien auf anderen Seiten
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
            disabled: !isHomePage, // Deaktiviere die Items
            className: !isHomePage ? "opacity-50 cursor-not-allowed" : "",
          },
          {
            id: "work",
            title: "Work",
            onClick: () => handleTagClick("Work"),
            active: activeTag === "Work",
            disabled: !isHomePage, // Deaktiviere die Items
            className: !isHomePage ? "opacity-50 cursor-not-allowed" : "",
          },
          {
            id: "school",
            title: "School",
            onClick: () => handleTagClick("School"),
            active: activeTag === "School",
            disabled: !isHomePage, // Deaktiviere die Items
            className: !isHomePage ? "opacity-50 cursor-not-allowed" : "",
          },
          {
            id: "low_priority",
            title: "Low priority",
            onClick: () => handleTagClick("Low Priority"),
            active: activeTag === "Low Priority",
            disabled: !isHomePage, // Deaktiviere die Items
            className: !isHomePage ? "opacity-50 cursor-not-allowed" : "",
          },
          {
            id: "urgent",
            title: "Urgent",
            onClick: () => handleTagClick("Urgent"),
            active: activeTag === "Urgent",
            disabled: !isHomePage, // Deaktiviere die Items
            className: !isHomePage ? "opacity-50 cursor-not-allowed" : "",
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
            onClick: handleProfileClick,
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
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} {...props}>
      <SidebarHeader>
        <Link
          href={data.appInfo.url}
          className="group hover:no-underline transition-all duration-1000"
        >
          <div className="flex items-center space-x-4 rounded-lg p-2 transition-all duration-200 group-hover:bg-gray-200 cursor-pointer">
            <div className="flex">
              <Image
                src={data.appInfo.icon}
                alt={data.appInfo.name}
                width={32}
                height={32}
                className="size-8"
              />
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
        <NavUser />
      </SidebarFooter>
      {!isMobile && <SidebarRail />}
    </Sidebar>
  );
}
