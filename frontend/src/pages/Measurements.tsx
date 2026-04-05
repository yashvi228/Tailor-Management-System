import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const fields = ["chest", "waist", "hips", "shoulder", "sleeve_length", "inseam", "outseam", "neck", "back_length", "front_length"] as const;
const fieldLabels: Record<string, string> = { chest: "Chest", waist: "Waist", hips: "Hips", shoulder: "Shoulder", sleeve_length: "Sleeve", inseam: "Inseam", outseam: "Outseam", neck: "Neck", back_length: "Back", front_length: "Front" };

export default function Measurements() {
  const { data, isLoading } = useQuery({
    queryKey: ["measurements-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("measurements").select("*, customers(id, name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">All measurements across customers. Click customer name to view details.</p>
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : !data?.length ? (
        <p className="text-muted-foreground text-sm">No measurements yet. Add them from a customer's profile.</p>
      ) : (
        <div className="space-y-3">
          {data.map((m) => (
            <Card key={m.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <Link to={`/customers/${(m.customers as any)?.id}`} className="text-primary hover:underline">{(m.customers as any)?.name}</Link>
                  <span className="text-xs text-muted-foreground font-normal">{format(new Date(m.created_at), "MMM d, yyyy")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
                  {fields.map((f) => {
                    const val = m[f];
                    return val ? <div key={f}><span className="text-muted-foreground">{fieldLabels[f]}:</span> {val}"</div> : null;
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
