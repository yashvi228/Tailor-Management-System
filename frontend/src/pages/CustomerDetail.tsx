import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StatusBadge from "@/components/StatusBadge";
import { ArrowLeft, Plus, Ruler, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";

const measurementFields = [
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve_length", label: "Sleeve Length" },
  { key: "inseam", label: "Inseam" },
  { key: "outseam", label: "Outseam" },
  { key: "neck", label: "Neck" },
  { key: "back_length", label: "Back Length" },
  { key: "front_length", label: "Front Length" },
] as const;

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [measOpen, setMeasOpen] = useState(false);
  const [measForm, setMeasForm] = useState<Record<string, string>>({});

  const { data: customer } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: measurements } = useQuery({
    queryKey: ["measurements", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("measurements").select("*").eq("customer_id", id!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").eq("customer_id", id!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMeasurement = useMutation({
    mutationFn: async () => {
      const payload: any = { customer_id: id };
      measurementFields.forEach((f) => {
        if (measForm[f.key]) payload[f.key] = parseFloat(measForm[f.key]);
      });
      if (measForm.notes) payload.notes = measForm.notes;
      const { error } = await supabase.from("measurements").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements", id] });
      toast.success("Measurements saved");
      setMeasForm({});
      setMeasOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteCustomer = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("customers").delete().eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted");
      navigate("/customers");
    },
  });

  if (!customer) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/customers")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{customer.name}</h2>
          <p className="text-sm text-muted-foreground">{customer.phone} {customer.email && `• ${customer.email}`}</p>
        </div>
        <Button variant="destructive" size="sm" onClick={() => deleteCustomer.mutate()}>
          <Trash2 className="h-4 w-4 mr-1" />Delete
        </Button>
      </div>

      {customer.address && <p className="text-sm text-muted-foreground">{customer.address}</p>}

      {/* Measurements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Ruler className="h-4 w-4" />Measurements</CardTitle>
          <Dialog open={measOpen} onOpenChange={setMeasOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>New Measurements</DialogTitle></DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); addMeasurement.mutate(); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {measurementFields.map((f) => (
                    <div key={f.key} className="space-y-1">
                      <Label className="text-xs">{f.label}</Label>
                      <Input type="number" step="0.1" value={measForm[f.key] ?? ""} onChange={(e) => setMeasForm({ ...measForm, [f.key]: e.target.value })} placeholder="inches" />
                    </div>
                  ))}
                </div>
                <div className="space-y-1"><Label className="text-xs">Notes</Label><Textarea value={measForm.notes ?? ""} onChange={(e) => setMeasForm({ ...measForm, notes: e.target.value })} rows={2} /></div>
                <Button type="submit" className="w-full" disabled={addMeasurement.isPending}>Save Measurements</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {!measurements?.length ? (
            <p className="text-muted-foreground text-sm">No measurements recorded.</p>
          ) : (
            <div className="space-y-3">
              {measurements.map((m) => (
                <div key={m.id} className="p-3 rounded-lg bg-muted text-sm">
                  <p className="text-xs text-muted-foreground mb-2">{format(new Date(m.created_at), "MMM d, yyyy")}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {measurementFields.map((f) => {
                      const val = m[f.key as keyof typeof m];
                      return val ? <div key={f.key}><span className="text-muted-foreground">{f.label}:</span> {String(val)}"</div> : null;
                    })}
                  </div>
                  {m.notes && <p className="mt-2 text-muted-foreground">{m.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Orders</CardTitle>
          <Button size="sm" onClick={() => navigate(`/orders/new?customer=${id}`)}><Plus className="h-4 w-4 mr-1" />New Order</Button>
        </CardHeader>
        <CardContent>
          {!orders?.length ? (
            <p className="text-muted-foreground text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm capitalize">{o.garment_type}</p>
                    <p className="text-xs text-muted-foreground">{o.delivery_date ? format(new Date(o.delivery_date), "MMM d, yyyy") : "No delivery date"}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
