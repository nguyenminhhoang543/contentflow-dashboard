"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        
        // Split full name if it exists
        const names = (data.full_name || "").split(" ");
        const first = names[0] || "";
        const last = names.length > 1 ? names.slice(1).join(" ") : "";

        setFormData({
          firstName: first,
          lastName: last,
          email: data.email || user.email || ""
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    if (!profile) return;
    
    setSaved(true);
    
    // Update profile in DB
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    
    await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
     return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
      </div>
    );
  }

  // Get initials for avatar
  const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase() || "Me";

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
                <div className="w-20 h-20 rounded-full bg-accent-cyan flex items-center justify-center text-background text-2xl font-bold">{initials}</div>
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
                  <input 
                    type="text" 
                    value={formData.firstName} 
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName} 
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled 
                  className="w-full bg-background border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground-muted opacity-60 cursor-not-allowed" 
                />
              </div>
              <div className="pt-4 flex justify-end items-center gap-4">
                {saved && <span className="text-accent-green text-sm">Profile updated!</span>}
                <button onClick={handleSave} className="bg-accent-amber hover:bg-accent-amber-light text-background font-medium py-2 px-6 rounded-md transition-colors text-sm">
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
