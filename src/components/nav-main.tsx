"use client";

import { type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export function NavMain({
  items,
}: {
  items: {
    id: string;
    title: string;
    icon?: LucideIcon;
    items?: {
      id: string;
      title: string;
      url?: string;
      icon?: LucideIcon;
      onClick?: () => void;
      isActive?: boolean;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.id} asChild className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="w-full justify-between cursor-pointer">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span className="flex-1 truncate">{item.title}</span>
                  <ChevronRightIcon className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        onClick={subItem.onClick}
                        className={`w-full${
                          subItem.isActive ? "bg-primary/10 text-primary" : ""
                        }`}
                      >
                        {/* profile icon */}
                        {subItem.icon && (
                          <subItem.icon className="mr-2 h-4 w-4" />
                        )}
                        <span className="flex-1 truncate">{subItem.title}</span>
                        {subItem.isActive && (
                          <span className="ml-auto text-xs">✓</span>
                        )}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
