"use client";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { useUser } from "./user/user-context";

export function NavUser() {
  const { data: session } = useSession();
  const { isMobile } = useSidebar();
  const { avatarUrl } = useUser();

  if (!session?.user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {avatarUrl ? (
                  <AvatarImage
                    src={avatarUrl}
                    alt={`${session.user.username}'s avatar`}
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                ) : (
                  <AvatarFallback>
                    {session.user.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {session.user.username}
                </span>
                <span className="truncate text-xs">{session.user.email}</span>
              </div>
              <CaretSortIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              <div className="flex items-center w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
