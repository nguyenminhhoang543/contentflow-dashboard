"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/header/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden text-foreground">
        <Header setMobileMenuOpen={setMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
