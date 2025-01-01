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
import { useUser } from "@/components/user/UserContext";
import { useSession } from "next-auth/react";

export default function Header() {
  const { user } = useUser();
  const { status } = useSession();

  // Warte auf die Session
  if (status === "loading") return null;

  return (
    <header className="flex h-16 shrink-0 items-center relative border-b border-gray-200">
      <div className="flex items-center gap-2 absolute left-0">
        <SidebarTrigger className="ml-4" />
        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>
                  <span>Welcome, {user?.username || "Guest"}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>
    </header>
  );
}
