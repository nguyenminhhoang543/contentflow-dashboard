"use client";

import { useEffect, useState } from "react";
import { BellRing, CheckCircle, Clock, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Load from DB
  useEffect(() => {
    async function loadNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setNotifications(data || []);
      setLoading(false);
    }
    loadNotifications();
  }, [supabase]);

  // Actions
  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Optimistic UI update
    setNotifications(n => n.map(x => ({ ...x, is_read: true })));
    
    // DB Update
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  };

  const markSingleRead = async (id: string) => {
    // Optimistic UI update
    setNotifications(prev => prev.map(x => x.id === id ? { ...x, is_read: true } : x));
    
    // DB Update
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
  };

  if (loading) {
     return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-accent-red text-background text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-accent-cyan hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-card border border-border-subtle rounded-lg divide-y divide-border-subtle overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-foreground-muted">
            <BellRing className="w-10 h-10 mx-auto opacity-30 mb-3" />
            <p>You have no notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => { if (!n.is_read) markSingleRead(n.id); }}
              className={`p-4 flex gap-4 transition-colors cursor-pointer ${!n.is_read ? "bg-elevated/40 hover:bg-elevated/60" : "hover:bg-elevated"}`}
            >
              <div className={`mt-1 flex-shrink-0 ${n.type === "success" ? "text-accent-green" : "text-accent-cyan"}`}>
                {n.type === "success" ? <CheckCircle className="w-5 h-5" /> : <BellRing className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h3 className={`text-sm ${!n.is_read ? "font-semibold text-foreground" : "font-medium text-foreground-muted"}`}>
                  {n.title}
                </h3>
                <p className="text-sm text-foreground-muted mt-1">{n.message}</p>
                <span className="text-xs text-foreground-muted flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3" /> {new Date(n.created_at).toLocaleString()}
                </span>
              </div>
              {!n.is_read && (
                <div className="flex flex-col justify-center">
                  <div className="w-2.5 h-2.5 bg-accent-amber rounded-full" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
