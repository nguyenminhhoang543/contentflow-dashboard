"use client";

import { ArrowUpRight, ArrowDownRight, Clock, DollarSign, FileText, CheckCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const kpiData = [
  { title: "Active Orders", value: "24", change: "+12.5%", isPositive: true, subtext: "vs previous period", icon: FileText },
  { title: "Total Delivered", value: "148,205", change: "+4.1%", isPositive: true, subtext: "Words this month", icon: CheckCircle },
  { title: "Avg. Turnaround", value: "48h", change: "-2.4%", isPositive: false, subtext: "vs previous period", icon: Clock },
  { title: "Budget Used", value: "$4,250", change: "+8.0%", isPositive: true, subtext: "vs previous period", icon: DollarSign },
];

const tpsData = [
  { time: "00:00", value: 0 },
  { time: "01:00", value: 1.2 },
  { time: "02:00", value: 0.1 },
  { time: "03:00", value: 0 },
  { time: "04:00", value: 0.4 },
  { time: "05:00", value: 0.8 },
  { time: "06:00", value: 0 },
];

const latencyData = [
  { time: "00:00", widevine: 200, playready: 120 },
  { time: "01:00", widevine: 350, playready: 180 },
  { time: "02:00", widevine: 180, playready: 90 },
  { time: "03:00", widevine: 220, playready: 140 },
  { time: "04:00", widevine: 280, playready: 100 },
  { time: "05:00", widevine: 190, playready: 80 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard Overview</h1>
        <div className="flex gap-4">
          <select className="bg-elevated border border-border-subtle rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent-amber">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
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
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded ${kpi.isPositive ? 'text-accent-green bg-accent-green/10' : 'text-accent-red bg-accent-red/10'}`}>
                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
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
            <h3 className="text-sm font-medium text-foreground">Orders per day (TPS)</h3>
            <span className="text-xs text-foreground-muted">Max: 1.2</span>
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
                <Bar dataKey="widevine" name="Blog Posts" fill="#f59e0b" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="playready" name="Articles" fill="#10b981" radius={[2, 2, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables section could go here */}
    </div>
  );
}
