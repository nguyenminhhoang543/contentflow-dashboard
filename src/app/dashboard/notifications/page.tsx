"use client";

import { useState } from "react";
import { BellRing, CheckCircle, Clock } from "lucide-react";

const initialNotifications = [
  { id: 1, title: "Order Delivered",  desc: "Order #ORD-20261 has been completed and is ready for your review.", date: "2 hours ago", unread: true,  type: "success" },
  { id: 2, title: "New Message",      desc: "Alice left a comment on 'SEO Optimized Landing Page'.",             date: "5 hours ago", unread: true,  type: "info"    },
  { id: 3, title: "Invoice Paid",     desc: "Your monthly plan has been renewed successfully.",                  date: "1 day ago",   unread: false, type: "success" },
  { id: 4, title: "Order Started",    desc: "A writer has been assigned to #ORD-20263.",                         date: "2 days ago",  unread: false, type: "info"    },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead  = () => setNotifications(n => n.map(x => ({ ...x, unread: false })));
  const unreadCount  = notifications.filter(n => n.unread).length;

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
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
            className={`p-4 flex gap-4 transition-colors cursor-pointer ${n.unread ? "bg-elevated/40 hover:bg-elevated/60" : "hover:bg-elevated"}`}
          >
            <div className={`mt-1 flex-shrink-0 ${n.type === "success" ? "text-accent-green" : "text-accent-cyan"}`}>
              {n.type === "success" ? <CheckCircle className="w-5 h-5" /> : <BellRing className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h3 className={`text-sm ${n.unread ? "font-semibold text-foreground" : "font-medium text-foreground-muted"}`}>
                {n.title}
              </h3>
              <p className="text-sm text-foreground-muted mt-1">{n.desc}</p>
              <span className="text-xs text-foreground-muted flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3" /> {n.date}
              </span>
            </div>
            {n.unread && (
              <div className="flex flex-col justify-center">
                <div className="w-2.5 h-2.5 bg-accent-amber rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
