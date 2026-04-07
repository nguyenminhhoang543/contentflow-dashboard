"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Clock, DollarSign, FileText, CheckCircle, Loader2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { createClient } from "@/utils/supabase/client";

// Stub data for charts since order volume requires long-term aggregation
const tpsData = [
  { time: "Day 1", value: 0 },
  { time: "Day 2", value: 1.2 },
  { time: "Day 3", value: 0.1 },
  { time: "Day 4", value: 0.4 },
  { time: "Day 5", value: 0.8 },
  { time: "Day 6", value: 2.0 },
];

const latencyData = [
  { time: "Mon", blog: 200, article: 120 },
  { time: "Tue", blog: 350, article: 180 },
  { time: "Wed", blog: 180, article: 90 },
  { time: "Thu", blog: 220, article: 140 },
  { time: "Fri", blog: 280, article: 100 },
];

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id);

      setOrders(data || []);
      setLoading(false);
    }
    fetchStats();
  }, [supabase]);

  if (loading) {
     return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
      </div>
    );
  }

  // Calculate real KPIs from DB arrays
  const activeOrders = orders.filter(o => o.status !== "Delivered").length;
  
  const totalDeliveredWords = orders
    .filter(o => o.status === "Delivered")
    .reduce((sum, o) => sum + (o.word_count || 0), 0);

  const totalBudgetUsed = orders.reduce((sum, o) => sum + ((o.word_count || 0) * 0.08), 0);

  const kpiData = [
    { title: "Active Orders", value: activeOrders.toString(), change: "Live", isPositive: true, subtext: "In progress / Pending", icon: FileText },
    { title: "Total Delivered", value: totalDeliveredWords.toLocaleString(), change: "All Time", isPositive: true, subtext: "Words completed", icon: CheckCircle },
    { title: "Avg. Turnaround", value: "48h", change: "Target", isPositive: true, subtext: "SLA guarantee", icon: Clock },
    { title: "Budget Used", value: "$" + totalBudgetUsed.toLocaleString(undefined, { minimumFractionDigits: 2 }), change: "All Time", isPositive: true, subtext: "Total estimated spend", icon: DollarSign },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard Overview</h1>
        <div className="flex gap-4">
          <select className="bg-elevated border border-border-subtle rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent-amber">
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-card border border-border-subtle rounded-lg p-5 flex flex-col gap-1 transition-all hover:border-border-active hover:shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground-muted">{kpi.title}</span>
              <kpi.icon className="w-5 h-5 text-accent-amber opacity-80" />
            </div>
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                <span className="text-xs text-foreground-muted mt-1">{kpi.subtext}</span>
              </div>
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded bg-accent-green/10 text-accent-green`}>
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {kpi.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border-subtle rounded-lg p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-foreground">Order Frequency Trend</h3>
            <span className="text-xs text-foreground-muted">Projected</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tpsData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141921', borderColor: '#2d3748', borderRadius: '8px' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border-subtle rounded-lg p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-foreground">Words by Content Type</h3>
            <span className="text-xs text-foreground-muted">Projected Volume</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141921', borderColor: '#2d3748', borderRadius: '8px' }}
                  cursor={{ fill: '#1c2333' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="blog" name="Blog Posts" fill="#f59e0b" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="article" name="Articles" fill="#10b981" radius={[2, 2, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
