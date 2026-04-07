"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  PlusSquare,
  History,
  FileText,
  Calculator,
  Settings,
  CreditCard,
  Users,
  HelpCircle,
  MessageSquare,
  LogOut,
  ChevronUp,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navigation = [
  {
    title: "OVERVIEW",
    items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "ORDERS",
    items: [
      { name: "All Orders",    href: "/dashboard/orders",         icon: ShoppingCart },
      { name: "New Order",     href: "/dashboard/orders/new",     icon: PlusSquare   },
      { name: "Order History", href: "/dashboard/orders/history", icon: History      },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { name: "Content Types",  href: "/dashboard/content-types", icon: FileText    },
      { name: "Word Calculator",href: "/dashboard/calculator",     icon: Calculator  },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { name: "Settings",      href: "/dashboard/settings", icon: Settings    },
      { name: "Billing",       href: "/dashboard/billing",  icon: CreditCard  },
      { name: "Team Members",  href: "/dashboard/team",     icon: Users       },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      { name: "Help Center", href: "/dashboard/help",    icon: HelpCircle    },
      { name: "Contact Us",  href: "/dashboard/contact", icon: MessageSquare },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex flex-col w-64 bg-sidebar border-r border-border-subtle h-full shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-2 text-accent-amber font-bold text-xl tracking-wide">
          <div className="w-8 h-8 rounded bg-accent-amber flex items-center justify-center text-background">
            <span className="font-black text-lg">CF</span>
          </div>
          ContentFlow
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="px-6 mb-2 text-xs font-semibold text-foreground-muted tracking-wider">
              {group.title}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-accent-amber bg-accent-amber/10 border-r-2 border-accent-amber"
                          : "text-foreground-muted hover:text-foreground hover:bg-elevated"
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom User Area */}
      <div className="p-4 border-t border-border-subtle shrink-0">
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-elevated cursor-pointer transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center text-background font-bold text-sm">
              CF
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">My Account</span>
              <span className="text-xs text-foreground-muted">Admin</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded hover:bg-elevated text-foreground-muted hover:text-accent-red transition-colors opacity-0 group-hover:opacity-100"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
