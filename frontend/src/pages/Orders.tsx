import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";

const garmentTypes = ["shirt", "pants", "suit", "dress", "blouse", "skirt", "jacket", "other"] as const;
const statuses = ["pending", "cutting", "stitching", "finishing", "ready", "delivered"] as const;

export default function Orders() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(!!searchParams.get("customer"));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [form, setForm] = useState({
    customer_id: searchParams.get("customer") ?? "",
    garment_type: "shirt" as string,
    description: "",
    price: "",
    advance_paid: "",
    delivery_date: "",
    notes: "",
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*, customers(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("id, name").order("name");
      return data ?? [];
    },
  });

  const addOrder = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("orders").insert({
        customer_id: form.customer_id,
        garment_type: form.garment_type as any,
        description: form.description || null,
        price: form.price ? parseFloat(form.price) : null,
        advance_paid: form.advance_paid ? parseFloat(form.advance_paid) : 0,
        delivery_date: form.delivery_date || null,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-all"] });
      toast.success("Order created");
      setForm({ customer_id: "", garment_type: "shirt", description: "", price: "", advance_paid: "", delivery_date: "", notes: "" });
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const payload: any = { status };
      if (status === "delivered") payload.delivered_at = new Date().toISOString();
      const { error } = await supabase.from("orders").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-all"] });
      toast.success("Status updated");
    },
  });

  const filtered = orders?.filter((o) => {
    const matchSearch = (o.customers as any)?.name?.toLowerCase().includes(search.toLowerCase()) || o.garment_type.includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  }) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Order</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); addOrder.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label>Customer *</Label>
                <Select value={form.customer_id} onValueChange={(v) => setForm({ ...form, customer_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>{customers?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Garment Type</Label>
                  <Select value={form.garment_type} onValueChange={(v) => setForm({ ...form, garment_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{garmentTypes.map((g) => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Delivery Date</Label><Input type="date" value={form.delivery_date} onChange={(e) => setForm({ ...form, delivery_date: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Price</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div className="space-y-2"><Label>Advance Paid</Label><Input type="number" value={form.advance_paid} onChange={(e) => setForm({ ...form, advance_paid: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
              <Button type="submit" className="w-full" disabled={addOrder.isPending || !form.customer_id}>Create Order</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <p className="font-medium">{(order.customers as any)?.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{order.garment_type}{order.description ? ` — ${order.description}` : ""}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.price ? `₹${order.price}` : ""}{order.advance_paid ? ` (Advance: ₹${order.advance_paid})` : ""}
                    {order.delivery_date ? ` • Due: ${format(new Date(order.delivery_date), "MMM d, yyyy")}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  {order.status !== "delivered" && (
                    <Select value={order.status} onValueChange={(v) => updateStatus.mutate({ id: order.id, status: v })}>
                      <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
