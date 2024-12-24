"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export default function Header({ username }: { username?: string }) {
  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
    border-b border-gray-200"
    >
      <SidebarTrigger className="ml-4 " />
      <div className="flex items-center gap-2 px-4">
        <Separator orientation="vertical" className="mr-2 h-4 " />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block ">
              <BreadcrumbLink>Welcome, {username || "Guest"}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
