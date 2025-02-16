"use client";

import { Check, type LucideIcon } from "lucide-react";
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
import { useSidebar } from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    id: string;
    title: string;
    icon?: LucideIcon;
    isHidden?: boolean;
    items?: {
      id: string;
      title: string;
      url?: string;
      icon?: LucideIcon;
      onClick?: () => void;
      active?: boolean;
      disabled?: boolean;
    }[];
  }[];
}) {
  const { setOpen } = useSidebar();

  const handleItemClick = (
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    item: any
  ) => {
    if (item.id === "categories" || item.id === "settings") {
      setOpen(true);
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items
          .filter((item) => !item.isHidden)
          .map((item) => (
            <Collapsible
              key={item.id}
              asChild
              className="group/collapsible"
              onOpenChange={() => handleItemClick(item)}
            >
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
                      <SidebarMenuSubItem key={subItem.id}>
                        <SidebarMenuSubButton
                          onClick={subItem.onClick}
                          disabled={subItem.disabled}
                          className={`w-full cursor-pointer ${
                            subItem.active ? "bg-primary/10 text-primary" : ""
                          } ${
                            subItem.disabled
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {subItem.icon && (
                            <subItem.icon className="mr-2 h-4 w-4" />
                          )}
                          <span className="flex-1 truncate">
                            {subItem.title}
                          </span>
                          {subItem.active && (
                            <Check className="ml-auto h-4 w-4 text-green-500" />
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
