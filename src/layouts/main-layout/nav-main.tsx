import { ChevronRight } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { MenuItem } from "@/modules/authentication/types/user-types";
import { getIcon } from "@/lib/icon-map";

// TODO: Change to Map.groupBy 
// const menuBySection = Map.groupBy(items, item => item.section)
function groupBySection(items: MenuItem[]): Map<string, MenuItem[]> {
  const groups = new Map<string, MenuItem[]>();
  for (const item of items) {
    const section = item.section;
    if (!groups.has(section)) {
      groups.set(section, []);
    }
    groups.get(section)!.push(item);
  }
  return groups;
}

// TODO: Make menu rendering recursive
export function NavMain({ items }: { items: MenuItem[] }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const sections = groupBySection(items);
  return (
    <>
      {Array.from(sections.entries()).map(([menuSection, menuItems]) => (
        <SidebarGroup key={menuSection}>
          <SidebarGroupLabel>{menuSection}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((menuItem) => {
                const Icon = getIcon(menuItem.icon);
                const hasSubMenus = menuItem.subMenus.length > 0;

                if (!hasSubMenus) {
                  return (
                    <SidebarMenuItem key={menuItem.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={currentPath === menuItem.route}
                        tooltip={menuItem.name}
                      >
                        <Link to={menuItem.route}>
                          {Icon && <Icon />}
                          <span>{menuItem.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                const isSubActive = menuItem.subMenus.some(
                  (sub) => currentPath === sub.route,
                );

                return (
                  <Collapsible
                    key={menuItem.id}
                    asChild
                    defaultOpen={isSubActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={menuItem.name}
                          isActive={isSubActive}
                        >
                          {Icon && <Icon />}
                          <span>{menuItem.name}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {menuItem.subMenus.map((sub) => (
                            <SidebarMenuSubItem key={sub.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={currentPath === sub.route}
                              >
                                <Link to={sub.route}>
                                  <span>{sub.name}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
