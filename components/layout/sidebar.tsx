"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  FileText,
  PackageCheck,
  Truck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Products", href: "/products", icon: Package },
  { name: "Quotations", href: "/quotations/list", icon: ClipboardList },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Stock", href: "/stock", icon: Package },
  { name: "Release Orders", href: "/release-order", icon: PackageCheck },
  { name: "Delivery Orders", href: "/delivery-order", icon: Truck },
  { name: "Collections", href: "/collection", icon: CreditCard },
  { name: "Letterhead", href: "/letterhead", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4 transition-all">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <LayoutDashboard className="h-5 w-5" />
          </div> */}
          {!collapsed && (
            <span className="truncate text-lg font-bold tracking-tight">
              DUS
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col justify-between h-[calc(100vh-64px)]">
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-sidebar-border p-2 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              collapsed ? "justify-center px-2" : "px-3"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="ml-3">Settings</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive",
              collapsed ? "justify-center px-2" : "px-3"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>

          {/* Collapse Toggle */}
          <div className="mt-2 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
