"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "Pending": return "bg-accent-amber/20 text-accent-amber";
      case "In Progress": return "bg-accent-cyan/20 text-accent-cyan";
      case "Review": return "bg-purple-500/20 text-purple-400";
      case "Delivered": return "bg-accent-green/20 text-accent-green";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <h1 className="text-2xl font-semibold text-foreground">All Orders</h1>
        <Link href="/dashboard/orders/new" className="bg-accent-amber hover:bg-accent-amber-light text-background font-medium text-sm px-4 py-2 rounded-md transition-colors">
          New Order
        </Link>
      </div>
      
      <div className="bg-card border border-border-subtle rounded-lg overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-border-subtle flex gap-4 bg-elevated">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input 
              type="text" 
              placeholder="Search by title or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 bg-background border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber transition-colors"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48 bg-background border border-border-subtle text-sm rounded-md py-2 px-3 text-foreground focus:outline-none focus:border-accent-amber transition-colors"
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Delivered</option>
          </select>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-accent-cyan">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left text-sm text-foreground-muted">
              <thead className="bg-elevated border-b border-border-subtle text-xs uppercase tracking-wider text-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Content Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-elevated transition-colors group">
                      <td className="px-6 py-4 font-medium text-foreground truncate max-w-[120px]">{order.id}</td>
                      <td className="px-6 py-4 font-medium text-foreground max-w-[200px] truncate">{order.title}</td>
                      <td className="px-6 py-4">{order.content_type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-accent-cyan hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-foreground-muted">
                      No orders matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
