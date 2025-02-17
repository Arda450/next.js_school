"use client";

import * as React from "react";
import Link from "next/link";
import { Settings2, Search, User } from "lucide-react";

import { NavMain } from "@/components/nav-main";
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
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { status } = useSession();
  const router = useRouter();
  const { setActiveTag, activeTag } = useTodos();
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const isHomePage = pathname === "/protected";
  const { theme, setTheme } = useTheme();

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

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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
      // {
      //   id: "tasks",
      //   title: "Tasks",
      //   icon: SquareTerminal,
      //   items: [
      //     {
      //       id: "upcoming",
      //       title: "Upcoming",
      //     },
      //     {
      //       id: "today",
      //       title: "Today",
      //     },
      //     {
      //       id: "calendar",
      //       title: "Calendar",
      //     },
      //   ],
      // },
      {
        id: "categories",
        title: "Filter Todos",
        icon: Search,
        isHidden: !isHomePage, // Verstecke die Kategorien auf anderen Seiten
        items: [
          // {
          //   id: "collaboration",
          //   title: "Collaboration",
          // },
          // {
          //   id: "categories",
          //   title: "Categories",
          // },
          {
            id: "personal",
            title: "Personal",
            onClick: () => handleTagClick("Personal"),
            active: activeTag === "Personal",
            disabled: !isHomePage,
          },
          {
            id: "work",
            title: "Work",
            onClick: () => handleTagClick("Work"),
            active: activeTag === "Work",
            disabled: !isHomePage,
          },
          {
            id: "school",
            title: "School",
            onClick: () => handleTagClick("School"),
            active: activeTag === "School",
            disabled: !isHomePage,
          },
          {
            id: "low_priority",
            title: "Low priority",
            onClick: () => handleTagClick("Low Priority"),
            active: activeTag === "Low Priority",
            disabled: !isHomePage,
          },
          {
            id: "urgent",
            title: "Urgent",
            onClick: () => handleTagClick("Urgent"),
            active: activeTag === "Urgent",
            disabled: !isHomePage,
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
            title: "Profile Settings",
            icon: User,
            onClick: handleProfileClick,
          },
          {
            id: "theme",
            title: theme === "dark" ? "Theme: Light Mode" : "Theme: Dark Mode",
            icon: theme === "dark" ? Sun : Moon,
            onClick: handleThemeChange,

            content: (
              <div className="flex items-center justify-between px-4 py-2 w-full ">
                <div className="flex items-center gap-2">
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={handleThemeChange}
                  aria-label="Toggle dark mode"
                />
              </div>
            ),
            items: [
              {
                id: "light",
                title: "Light",
                icon: Sun,
                onClick: () => setTheme("light"),
              },
              {
                id: "dark",
                title: "Dark",
                icon: Moon,
                onClick: () => setTheme("dark"),
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} {...props}>
      <SidebarHeader>
        <Link
          href={data.appInfo.url}
          className="group hover:no-underline"
          aria-label="Go to home page"
        >
          <div className="flex items-center space-x-4 rounded-lg p-2 group-data-[collapsible=icon]:p-0.5 transition-all duration-200 hover:bg-accent group-hover:bg-accent dark:hover:bg-accent/50">
            {" "}
            <div className="flex shrink-0">
              <Image
                src={data.appInfo.icon}
                alt={data.appInfo.name}
                width={32}
                height={32}
                className="size-8 "
                priority
                loading="eager"
              />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="text-base font-semibold text-foreground transition-colors">
                {data.appInfo.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {data.appInfo.description}
              </p>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      {!isMobile && <SidebarRail />}
    </Sidebar>
  );
}
