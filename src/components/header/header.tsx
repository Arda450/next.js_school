"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchBar from "@/components/ui/search-bar";
import { useSession } from "next-auth/react";
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
          <span className="hidden lg:inline font-medium text-sm bg-primary/20 px-3 py-1.5 rounded-md transition-colors">
            Welcome, {session?.user?.username || "Guest"}
          </span>
        </div>
        {isHomePage && ( // Zeige die searchbar nur auf der homepage
          <div className="flex-1 flex justify-center mr-2">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
}
