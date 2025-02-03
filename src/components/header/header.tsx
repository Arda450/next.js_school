"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchBar from "@/components/ui/search-bar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === "/protected";

  if (status === "loading") return null;

  return (
    <header className="flex h-16 shrink-0 items-center relative border-b border-gray-200">
      <div className="flex items-center gap-2 absolute left-0">
        <SidebarTrigger className="ml-4" />
        <div className="md:flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-8" />
          {/* <Breadcrumb>
            <BreadcrumbList> */}
          {/* <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink> */}
          <span className="hidden md:inline">
            Welcome, {session?.user?.username || "Guest"}
          </span>
          {/* </BreadcrumbLink>
              </BreadcrumbItem> */}
          {/* <BreadcrumbSeparator className="hidden md:block" /> */}
          {/* </BreadcrumbList>
          </Breadcrumb> */}
        </div>
        {isHomePage && ( // Zeige die searchbar nur auf der homepage
          <div className="flex-1 flex justify-center">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
}
