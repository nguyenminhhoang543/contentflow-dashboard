"use client";

import { useEffect, useState, useRef } from "react";
import { User, Mail, Building, Globe, Lock, Bell, Loader2, Save, CheckCircle2, Upload } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile({
        ...data,
        email: user.email,
        company_name: data?.company_name || "",
        website: data?.website || "",
        full_name: data?.full_name || "",
        avatar_url: data?.avatar_url || ""
      });
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user && profile) {
      await supabase.from('profiles').update({
        full_name: profile.full_name,
        company_name: profile.company_name,
        website: profile.website,
        avatar_url: profile.avatar_url
      }).eq('id', user.id);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage bucket named 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Force cache bust by appending timestamp
      const freshUrl = `${publicUrl}?t=${new Date().getTime()}`;

      setProfile({ ...profile, avatar_url: freshUrl });
      
      // Update the DB immediately
      await supabase.from('profiles').update({ avatar_url: freshUrl }).eq('id', user.id);
      
    } catch (error) {
      alert("Error uploading avatar. Did you run the STORAGE_SCHEMA.sql script?");
      console.error(error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border-subtle pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Account Settings</h1>
          <p className="text-sm text-foreground-muted mt-1">Manage your profile, workspace, and security preferences</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-accent-amber hover:bg-accent-amber-light text-background font-medium py-2 px-6 rounded-md transition-colors text-sm flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <nav className="flex flex-col gap-1 space-y-1">
            {["Profile Information", "Workspace", "Security", "Notifications"].map((item, i) => (
              <button 
                key={i} 
                className={`text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${i === 0 ? 'bg-elevated text-foreground border border-border-subtle' : 'text-foreground-muted hover:bg-elevated hover:text-foreground'}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-card border border-border-subtle rounded-lg p-6">
            <h2 className="text-lg font-medium text-foreground mb-6">Profile Information</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-24 h-24 rounded-full border-2 border-border-subtle object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-accent-cyan/10 flex items-center justify-center border-2 border-dashed border-accent-cyan/30">
                  <User className="w-10 h-10 text-accent-cyan" />
                </div>
              )}
              
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="bg-elevated border border-border-subtle hover:border-accent-amber text-foreground text-sm font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                >
                  {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Change Avatar
                </button>
                <p className="text-xs text-foreground-muted mt-2">Recommended: Square JPG or PNG, max 2MB.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                    <input 
                      type="text" 
                      value={profile.full_name}
                      onChange={e => setProfile({...profile, full_name: e.target.value})}
                      className="w-full pl-9 bg-background border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-muted mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                    <input 
                      type="email" 
                      value={profile.email} 
                      disabled 
                      className="w-full pl-9 bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground-muted opacity-60 cursor-not-allowed" 
                    />
                  </div>
                  <p className="text-xs text-foreground-muted mt-1">Contact support to change email</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border-subtle rounded-lg p-6">
            <h2 className="text-lg font-medium text-foreground mb-6">Workspace Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Company / Workspace Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <input 
                    type="text" 
                    value={profile.company_name}
                    onChange={e => setProfile({...profile, company_name: e.target.value})}
                    placeholder="e.g. Acme Corp"
                    className="w-full pl-9 bg-background border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <input 
                    type="url" 
                    value={profile.website}
                    onChange={e => setProfile({...profile, website: e.target.value})}
                    placeholder="https://"
                    className="w-full pl-9 bg-background border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
