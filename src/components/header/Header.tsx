"use client";

import { Bell, Search, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

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

export function Header({ setMobileMenuOpen }: { setMobileMenuOpen: (o: boolean) => void }) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  const supabase = createClient();
  const [avatarStr, setAvatarStr] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).single();
        if (data && data.avatar_url) {
          setAvatarStr(data.avatar_url);
        }
      }
    }
    loadUser();
  }, [supabase]);

  return (
    <header className="h-16 border-b border-border-subtle bg-background flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Left side – mobile menu button + page title + search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 text-foreground hover:bg-elevated rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-sm font-semibold text-foreground hidden sm:block whitespace-nowrap">{title}</span>
        <div className="relative w-full max-w-xs md:w-56 xl:w-72">
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

        {avatarStr && (
          <div className="hidden md:block pl-2 border-l border-border-subtle">
            <img src={avatarStr} alt="Avatar" className="w-8 h-8 rounded-full border border-border-subtle object-cover" />
          </div>
        )}
      </div>
    </header>
  );
}
