import { useState } from "react";
import { Plus, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInvoices, addInvoice, getCustomers, getOrders } from "@/lib/api";

const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Paid: "bg-green-100 text-green-800 border-green-200",
    Unpaid: "bg-red-100 text-red-800 border-red-200",
};

interface InvoiceForm {
    customer_id: string;
    order_id: string;
    amount: string;
    status: string;
}

export default function Invoices() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState<InvoiceForm>({
        customer_id: "",
        order_id: "",
        amount: "",
        status: "Pending",
    });

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: invoices = [], isLoading } = useQuery({
        queryKey: ["invoices"],
        queryFn: getInvoices,
    });

    const { data: customers = [] } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    });

    const { data: orders = [] } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });

    const createMutation = useMutation({
        mutationFn: addInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            toast({ title: "Invoice created successfully" });
            setDialogOpen(false);
            setForm({ customer_id: "", order_id: "", amount: "", status: "Pending" });
        },
        onError: (err: Error) =>
            toast({ title: "Error", description: err.message, variant: "destructive" }),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            customer_id: Number(form.customer_id),
            order_id: Number(form.order_id),
            amount: parseFloat(form.amount),
            status: form.status,
        });
    };

    const filtered = invoices.filter((inv: any) => {
        const customer = customers.find((c: any) => c.id === inv.customer_id);
        const matchSearch = customer?.name?.toLowerCase().includes(search.toLowerCase()) ?? false;
        const matchFilter = filter === "all" || inv.status === filter;
        return matchSearch && matchFilter;
    });

    const totalOutstanding = invoices
        .filter((inv: any) => inv.status !== "Paid")
        .reduce((sum: number, inv: any) => sum + Number(inv.amount), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
                    <p className="text-muted-foreground">
                        Track payments —{" "}
                        <span className="font-medium text-foreground">
                            ₹{totalOutstanding.toLocaleString()}
                        </span>{" "}
                        outstanding
                    </p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Invoice
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Invoice</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Customer</Label>
                                <Select
                                    value={form.customer_id}
                                    onValueChange={(v) => setForm({ ...form, customer_id: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c: any) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Order</Label>
                                <Select
                                    value={form.order_id}
                                    onValueChange={(v) => setForm({ ...form, order_id: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orders.map((o: any) => (
                                            <SelectItem key={o.id} value={String(o.id)}>
                                                Order #{o.id}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Amount (₹)</Label>
                                    <Input
                                        type="number"
                                        value={form.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={form.status}
                                        onValueChange={(v) => setForm({ ...form, status: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Paid">Paid</SelectItem>
                                            <SelectItem value="Unpaid">Unpaid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={createMutation.isPending || !form.customer_id || !form.order_id}
                            >
                                {createMutation.isPending ? "Creating..." : "Create Invoice"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by customer..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-4 space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((inv: any) => {
                                    const customer = customers.find((c: any) => c.id === inv.customer_id);
                                    return (
                                        <TableRow key={inv.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    #{inv.id}
                                                </div>
                                            </TableCell>
                                            <TableCell>{customer?.name ?? "—"}</TableCell>
                                            <TableCell>Order #{inv.order_id}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={statusColors[inv.status] ?? ""}
                                                >
                                                    {inv.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ₹{Number(inv.amount).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-8 text-muted-foreground"
                                        >
                                            No invoices found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}