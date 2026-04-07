"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, ShoppingCart, PlusSquare, History,
  FileText, Calculator, Settings, CreditCard, Users, HelpCircle, MessageSquare, LogOut, X, Menu, PanelLeftClose, PanelLeftOpen
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
      { name: "Word Calc",      href: "/dashboard/calculator",    icon: Calculator  },
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

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();
  const [avatarStr, setAvatarStr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).single();
        if (data && data.avatar_url) {
          setAvatarStr(data.avatar_url);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const SidebarContent = (
    <div className={`flex flex-col bg-sidebar border-r border-border-subtle h-full transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border-subtle shrink-0 justify-between">
        <div className={`flex items-center gap-2 text-accent-amber font-bold tracking-wide transition-all ${isCollapsed ? 'w-full justify-center text-sm' : 'text-xl'}`}>
          <div className="w-8 h-8 rounded bg-accent-amber flex items-center justify-center text-background shrink-0">
            <span className="font-black text-lg">CF</span>
          </div>
          {!isCollapsed && <span>ContentFlow</span>}
        </div>
        {!isCollapsed && (
           <button onClick={() => setIsCollapsed(true)} className="hidden md:block p-1 text-foreground-muted hover:text-foreground">
             <PanelLeftClose className="w-5 h-5" />
           </button>
        )}
      </div>

      {isCollapsed && (
         <div className="flex justify-center pt-4 hidden md:flex">
           <button onClick={() => setIsCollapsed(false)} className="p-1 text-foreground-muted hover:text-foreground">
             <PanelLeftOpen className="w-5 h-5" />
           </button>
         </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
        {navigation.map((group) => (
          <div key={group.title} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-6 mb-2 text-xs font-semibold text-foreground-muted tracking-wider truncate">
                {group.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.href === "/dashboard" 
                  ? pathname === "/dashboard" 
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-accent-amber bg-accent-amber/10 border-r-2 border-accent-amber"
                          : "text-foreground-muted hover:text-foreground hover:bg-elevated"
                      } ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom User Area */}
      <div className={`p-4 border-t border-border-subtle shrink-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center transition-colors group ${isCollapsed ? 'justify-center' : 'justify-between p-2 rounded-md hover:bg-elevated cursor-pointer'}`}>
          <div className="flex items-center gap-3">
            {!loading && avatarStr ? (
               <img src={avatarStr} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 border border-border-subtle" />
            ) : (
               <div className="w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center text-background font-bold text-sm shrink-0">
                 CF
               </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col truncate w-32">
                <span className="text-sm font-medium text-foreground truncate">My Account</span>
                <span className="text-xs text-foreground-muted truncate">Admin</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className={`p-1.5 rounded hover:bg-elevated text-foreground-muted hover:text-accent-red transition-colors ${isCollapsed ? 'absolute bottom-16 bg-sidebar rounded-full shadow border border-border-subtle' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        {SidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-0 bottom-0 left-0 w-64 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="absolute top-4 right-4 z-50">
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-foreground bg-elevated rounded-md border border-border-subtle">
               <X className="w-5 h-5"/>
             </button>
           </div>
           <div className="w-full h-full bg-sidebar shadow-2xl">
             <div className="flex flex-col bg-sidebar border-r border-border-subtle h-full transition-all duration-300 w-64">
               {/* Duplicate identical content but forced open for mobile */}
               <div className="h-16 flex items-center px-6 border-b border-border-subtle shrink-0 justify-between">
                <div className="flex items-center gap-2 text-accent-amber font-bold tracking-wide text-xl">
                  <div className="w-8 h-8 rounded bg-accent-amber flex items-center justify-center text-background shrink-0">
                    <span className="font-black text-lg">CF</span>
                  </div>
                  <span>ContentFlow</span>
                </div>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
                {navigation.map((group) => (
                  <div key={group.title} className="mb-6">
                    <h3 className="px-6 mb-2 text-xs font-semibold text-foreground-muted tracking-wider truncate">
                      {group.title}
                    </h3>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const isActive = item.href === "/dashboard" 
                          ? pathname === "/dashboard" 
                          : pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                          <li key={item.name}>
                            <Link href={item.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 py-2.5 text-sm font-medium transition-colors px-6 ${isActive ? "text-accent-amber bg-accent-amber/10 border-r-2 border-accent-amber" : "text-foreground-muted hover:text-foreground hover:bg-elevated"}`}>
                              <item.icon className="w-4 h-4 shrink-0" />
                              <span className="truncate">{item.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
              <div className="p-4 border-t border-border-subtle shrink-0">
                <div className="flex items-center transition-colors group justify-between p-2 rounded-md hover:bg-elevated cursor-pointer">
                  <div className="flex items-center gap-3">
                    {!loading && avatarStr ? (
                       <img src={avatarStr} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 border border-border-subtle" />
                    ) : (
                       <div className="w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center text-background font-bold text-sm shrink-0">
                         CF
                       </div>
                    )}
                    <div className="flex flex-col truncate w-32">
                      <span className="text-sm font-medium text-foreground truncate">My Account</span>
                      <span className="text-xs text-foreground-muted truncate">Admin</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="p-1.5 rounded hover:bg-elevated text-foreground-muted hover:text-accent-red transition-colors opacity-0 group-hover:opacity-100">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
             </div>
           </div>
        </div>
      </div>
    </>
  );
}
