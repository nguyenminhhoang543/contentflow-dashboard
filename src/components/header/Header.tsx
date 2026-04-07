"use client";

import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Map of page titles from URL path
const pageTitles: Record<string, string> = {
  "/dashboard":                    "Dashboard Overview",
  "/dashboard/orders":             "All Orders",
  "/dashboard/orders/new":         "New Order",
  "/dashboard/orders/history":     "Order History",
  "/dashboard/content-types":      "Content Types",
  "/dashboard/calculator":         "Word Calculator",
  "/dashboard/settings":           "Settings",
  "/dashboard/billing":            "Billing & Invoices",
  "/dashboard/team":               "Team Members",
  "/dashboard/help":               "Help Center",
  "/dashboard/contact":            "Contact Support",
  "/dashboard/notifications":      "Notifications",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="h-16 border-b border-border-subtle bg-background flex items-center justify-between px-6 shrink-0">
      {/* Left side – page title + search */}
      <div className="flex items-center gap-6 flex-1">
        <span className="text-sm font-semibold text-foreground hidden sm:block whitespace-nowrap">{title}</span>
        <div className="relative w-56 xl:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search orders, content..."
            className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 pl-9 pr-4 text-foreground focus:outline-none focus:border-accent-amber transition-colors placeholder:text-foreground-muted"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/notifications"
          className="relative p-2 text-foreground-muted hover:text-foreground hover:bg-elevated rounded-full transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full border border-background" />
        </Link>
        <div className="h-8 w-px bg-border-subtle" />
        <button
          onClick={() => alert("Export Report as CSV coming soon.")}
          className="flex items-center gap-2 bg-accent-amber hover:bg-accent-amber-light text-background font-medium text-sm px-4 py-2 rounded-md transition-colors"
        >
          Export Report
        </button>
      </div>
    </header>
  );
}
