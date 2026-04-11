import { useState } from "react";
import { Plus, Search, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMeasurements, addMeasurement, getCustomers } from "@/lib/api";

const fields = [
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Waist" },
    { key: "hips", label: "Hips" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeve", label: "Sleeve" },
    { key: "inseam", label: "Inseam" },
    { key: "neck", label: "Neck" },
] as const;

interface MeasurementForm {
    customer_id: string;
    chest: string; waist: string; hips: string; shoulder: string;
    sleeve_length: string; inseam: string; neck: string; notes: string;
}

const emptyForm: MeasurementForm = {
    customer_id: "", chest: "", waist: "", hips: "", shoulder: "",
    sleeve_length: "", inseam: "", neck: "", notes: ""
};

export default function Measurements() {
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState<MeasurementForm>(emptyForm);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: measurements = [], isLoading } = useQuery({
        queryKey: ["measurements"],
        queryFn: getMeasurements,
    });

    const { data: customers = [] } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    });

    const createMutation = useMutation({
        mutationFn: addMeasurement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["measurements"] });
            toast({ title: "Measurement recorded successfully" });
            setDialogOpen(false);
            setForm(emptyForm);
        },
        onError: (err: Error) =>
            toast({ title: "Error", description: err.message, variant: "destructive" }),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            customer_id: Number(form.customer_id),
            chest: parseFloat(form.chest),
            waist: parseFloat(form.waist),
            hips: parseFloat(form.hips),
            shoulder: parseFloat(form.shoulder),
            sleeve: parseFloat(form.sleeve),
            inseam: parseFloat(form.inseam),
            neck: parseFloat(form.neck),
            notes: form.notes,
        });
    };

    const filtered = measurements.filter((m: any) => {
        const customer = customers.find((c: any) => c.id === m.customer_id);
        return (customer?.name ?? "").toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Measurements</h1>
                    <p className="text-muted-foreground">Customer body measurements record</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" />Add Measurement</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>Record Measurements</DialogTitle></DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Customer</Label>
                                <Select value={form.customer_id} onValueChange={(v) => setForm({ ...form, customer_id: v })}>
                                    <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c: any) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {fields.map((f) => (
                                    <div key={f.key} className="space-y-1">
                                        <Label className="text-xs">{f.label} (inches)</Label>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            value={form[f.key]}
                                            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Input
                                    placeholder="e.g., Prefers slim fit"
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={createMutation.isPending || !form.customer_id}>
                                {createMutation.isPending ? "Saving..." : "Save Measurements"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by customer..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {[1, 2].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {filtered.map((m: any) => {
                        const customer = customers.find((c: any) => c.id === m.customer_id);
                        return (
                            <Card key={m.id} className="transition-shadow hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Ruler className="h-4 w-4 text-primary" />
                                        {customer?.name ?? "Unknown"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-4 gap-3">
                                        {fields.map((f) => (
                                            <div key={f.key} className="text-center">
                                                <p className="text-xs text-muted-foreground">{f.label}</p>
                                                <p className="text-sm font-semibold">{m[f.key]}"</p>
                                            </div>
                                        ))}
                                    </div>
                                    {m.notes && (
                                        <p className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                                            📝 {m.notes}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                    {filtered.length === 0 && (
                        <p className="col-span-full text-center text-muted-foreground py-8">No measurements found</p>
                    )}
                </div>
            )}
        </div>
    );
}