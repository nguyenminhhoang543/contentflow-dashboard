"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="border-b border-border-subtle pb-4">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-foreground-muted mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-8">
        <aside className="w-48 text-sm">
          <ul className="space-y-1 text-foreground-muted">
            <li className="px-3 py-2 bg-elevated text-accent-amber font-medium rounded-md cursor-pointer">Profile</li>
            <li className="px-3 py-2 hover:bg-elevated hover:text-foreground rounded-md cursor-pointer transition-colors">Notifications</li>
            <li className="px-3 py-2 hover:bg-elevated hover:text-foreground rounded-md cursor-pointer transition-colors">Billing</li>
            <li className="px-3 py-2 hover:bg-elevated hover:text-foreground rounded-md cursor-pointer transition-colors">API Keys</li>
            <li className="px-3 py-2 hover:bg-elevated hover:text-foreground rounded-md cursor-pointer transition-colors">Team</li>
          </ul>
        </aside>

        <main className="flex-1">
          <div className="bg-card border border-border-subtle rounded-lg p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-accent-cyan flex items-center justify-center text-background text-2xl font-bold">JD</div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-elevated border border-border-subtle rounded-full flex items-center justify-center hover:bg-border-subtle transition-colors text-xs">!</button>
              </div>
              <div>
                <button className="bg-elevated border border-border-subtle hover:bg-border-subtle text-foreground text-sm py-2 px-4 rounded-md transition-colors mr-2">Change Avatar</button>
                <button className="text-accent-red hover:underline text-sm">Remove</button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-1">First Name</label>
                  <input type="text" defaultValue="John" className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-1">Last Name</label>
                  <input type="text" defaultValue="Doe" className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Email Address</label>
                <input type="email" defaultValue="john.doe@example.com" disabled className="w-full bg-background border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground-muted opacity-60 cursor-not-allowed" />
              </div>
              <div className="pt-4 flex justify-end">
                <button className="bg-accent-amber hover:bg-accent-amber-light text-background font-medium py-2 px-6 rounded-md transition-colors text-sm">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
