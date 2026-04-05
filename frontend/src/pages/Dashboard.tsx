import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, Clock, CheckCircle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: customers } = useQuery({
    queryKey: ["customers-count"],
    queryFn: async () => {
      const { count } = await supabase.from("customers").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["orders-all"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*, customers(name)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const pendingOrders = orders?.filter((o) => o.status !== "delivered").length ?? 0;
  const deliveredOrders = orders?.filter((o) => o.status === "delivered").length ?? 0;
  const recentOrders = orders?.slice(0, 5) ?? [];

  const stats = [
    { label: "Total Customers", value: customers ?? 0, icon: Users, color: "text-primary" },
    { label: "Total Orders", value: orders?.length ?? 0, icon: ShoppingBag, color: "text-primary" },
    { label: "In Progress", value: pendingOrders, icon: Clock, color: "text-primary" },
    { label: "Delivered", value: deliveredOrders, icon: CheckCircle, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet. <Link to="/orders" className="text-primary hover:underline">Create one</Link></p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{(order.customers as any)?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.garment_type} • {order.delivery_date ? format(new Date(order.delivery_date), "MMM d, yyyy") : "No date"}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
