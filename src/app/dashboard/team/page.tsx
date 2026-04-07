"use client";

import { useEffect, useState } from "react";
import { Crown, Shield, User, Users, UserPlus, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const roleIcon: Record<string, React.ReactNode> = {
  Admin:  <Crown  className="w-3 h-3" />,
  Editor: <Shield className="w-3 h-3" />,
  Viewer: <User   className="w-3 h-3" />,
};
const roleColor: Record<string, string> = {
  Admin:  "bg-accent-amber/20 text-accent-amber",
  Editor: "bg-accent-cyan/20 text-accent-cyan",
  Viewer: "bg-gray-500/20 text-gray-400",
};

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchTeam() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("admin_id", user.id)
        .order("joined_at", { ascending: false });

      setMembers(data || []);
      setLoading(false);
    }
    fetchTeam();
  }, [supabase]);

  const handleInvite = async () => {
    if (!email) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from("team_members").insert({
      admin_id: user.id,
      email: email,
      role: role
    }).select().single();

    if (!error && data) {
      setMembers([data, ...members]);
      setInviteSuccess(true);
      setEmail("");
      setTimeout(() => {
        setInviteSuccess(false);
        setShowInvite(false);
      }, 2000);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-accent-cyan" /></div>;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-accent-amber" /> Team Members
          </h1>
          <p className="text-sm text-foreground-muted mt-1">Manage who has access to your ContentFlow workspace</p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 bg-accent-amber hover:bg-accent-amber-light text-background font-medium text-sm px-4 py-2 rounded-md transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {showInvite && (
        <div className="bg-card border border-accent-amber/40 rounded-lg p-5">
          <h2 className="text-base font-medium text-foreground mb-3">Invite a New Member</h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber"
              />
            </div>
            <select value={role} onChange={e => setRole(e.target.value)} className="bg-elevated border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber">
              <option>Viewer</option>
              <option>Editor</option>
              <option>Admin</option>
            </select>
            <button
              onClick={handleInvite}
              className="bg-accent-amber text-background text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-amber-light transition-colors flex items-center gap-2"
            >
              {inviteSuccess ? <CheckCircle2 className="w-4 h-4" /> : "Send Invite"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border-subtle rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle text-xs uppercase tracking-wider text-foreground-muted bg-elevated grid grid-cols-5 gap-4">
          <span className="col-span-2">Member</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
        </div>
        {members.length === 0 ? (
           <div className="p-8 text-center text-foreground-muted text-sm">
             No team members added yet. Run FINAL_SCHEMA_PHASE2.sql if needed and click "Invite Member".
           </div>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {members.map((m, i) => {
              const bgColors = ["bg-accent-cyan", "bg-accent-green", "bg-purple-500", "bg-accent-amber"];
              const color = bgColors[i % bgColors.length];
              const initial = m.email.charAt(0).toUpperCase();
              
              return (
              <li key={m.id} className="grid grid-cols-5 gap-4 items-center px-6 py-4 hover:bg-elevated transition-colors">
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-background font-bold text-sm shrink-0`}>
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.email}</p>
                    <p className="text-xs text-foreground-muted">Seat User</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${roleColor[m.role] || roleColor['Viewer']}`}>
                    {roleIcon[m.role] || roleIcon['Viewer']} {m.role}
                  </span>
                </div>
                <div>
                   <span className={`text-xs font-medium ${m.status === 'Active' ? 'text-accent-green' : 'text-foreground-muted'}`}>
                     {m.status}
                   </span>
                </div>
                <div className="text-sm text-foreground-muted">{new Date(m.joined_at).toLocaleDateString()}</div>
              </li>
            )})}
          </ul>
        )}
      </div>

      <div className="bg-card border border-border-subtle rounded-lg p-5 text-sm text-foreground-muted">
        <p className="font-medium text-foreground mb-2">Team Seats</p>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex-1 h-2 bg-elevated rounded-full overflow-hidden">
            <div className="h-full bg-accent-amber rounded-full" style={{ width: `${Math.min(100, ((members.length+1) / 10) * 100)}%` }} />
          </div>
          <span className="text-foreground font-medium tabular-nums">{members.length + 1} / 10 seats used</span>
        </div>
      </div>
    </div>
  );
}
