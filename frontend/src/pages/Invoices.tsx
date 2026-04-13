import { useState } from "react"
import { Plus, FileText, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import jsPDF from "jspdf"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import { useToast } from "@/hooks/use-toast"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
    getInvoices,
    addInvoice,
    updateInvoice,
    getCustomers,
    getOrders
} from "@/lib/api"


const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Paid: "bg-green-100 text-green-800",
    Unpaid: "bg-red-100 text-red-800"
}

export default function Invoices() {

    const queryClient = useQueryClient()

    const [search, setSearch] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editId, setEditId] = useState<number | null>(null)

    const [form, setForm] = useState({
        customer_id: "",
        order_id: "",
        amount: "",
        status: "Pending"
    })

    const { toast } = useToast()


    const { data: invoices = [] } = useQuery({
        queryKey: ["invoices"],
        queryFn: getInvoices
    })


    const { data: customers = [] } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers
    })


    const { data: orders = [] } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders
    })


    const addMutation = useMutation({
        mutationFn: addInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] })
            toast({ title: "Invoice created" })
            setDialogOpen(false)
        }
    })


    const updateMutation = useMutation({
        mutationFn: (data: any) => updateInvoice(editId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] })
            toast({ title: "Invoice updated" })
            setDialogOpen(false)
            setEditId(null)
        }
    })


    const submit = (e: any) => {

        e.preventDefault()

        const data = {
            customer_id: Number(form.customer_id),
            order_id: Number(form.order_id),
            amount: Number(form.amount),
            status: form.status
        }

        if (editId) {
            updateMutation.mutate(data)
        } else {
            addMutation.mutate(data)
        }

    }


    const downloadInvoice = (invoice: any, customer: any) => {

        const doc = new jsPDF()

        doc.setFontSize(20)
        doc.text("TailorPro Invoice", 20, 20)

        doc.setFontSize(12)

        doc.text(`Invoice ID: ${invoice.id}`, 20, 40)
        doc.text(`Customer: ${customer?.name}`, 20, 50)
        doc.text(`Amount: ₹${invoice.amount}`, 20, 60)
        doc.text(`Status: ${invoice.status}`, 20, 70)

        doc.text("Thank you for choosing TailorPro!", 20, 100)

        doc.save(`invoice-${invoice.id}.pdf`)

    }


    const filtered = invoices.filter((i: any) => {

        const customer = customers.find((c: any) => c.id === i.customer_id)

        return customer?.name?.toLowerCase().includes(search.toLowerCase())

    })


    return (

        <div className="space-y-6">

            <div className="flex justify-between">

                <h1 className="text-2xl font-semibold">
                    Invoices
                </h1>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

                    <DialogTrigger asChild>

                        <Button>
                            <Plus size={16} />
                            New Invoice
                        </Button>

                    </DialogTrigger>

                    <DialogContent>

                        <DialogHeader>
                            <DialogTitle>
                                {editId ? "Edit Invoice" : "Create Invoice"}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={submit} className="space-y-3">

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


                            <Input
                                placeholder="Amount"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            />


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


                            <Button className="w-full">

                                {editId ? "Update Invoice" : "Create Invoice"}

                            </Button>

                        </form>

                    </DialogContent>

                </Dialog>

            </div>


            <Input
                placeholder="Search by customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />


            <Card>

                <CardContent className="p-0">

                    <Table>

                        <TableHeader>

                            <TableRow>

                                <TableHead>Invoice</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Actions</TableHead>

                            </TableRow>

                        </TableHeader>


                        <TableBody>

                            {filtered.map((i: any) => {

                                const customer = customers.find((c: any) => c.id === i.customer_id)

                                return (

                                    <TableRow key={i.id}>

                                        <TableCell>

                                            <FileText size={14} /> #{i.id}

                                        </TableCell>


                                        <TableCell>

                                            {customer?.name}

                                        </TableCell>


                                        <TableCell>

                                            {new Date(i.created_at || Date.now()).toLocaleDateString()}

                                        </TableCell>


                                        <TableCell>

                                            <Badge className={statusColors[i.status]}>
                                                {i.status}
                                            </Badge>

                                        </TableCell>


                                        <TableCell>

                                            ₹ {i.amount}

                                        </TableCell>


                                        <TableCell className="flex gap-2">

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {

                                                    setEditId(i.id)

                                                    setForm({
                                                        customer_id: String(i.customer_id),
                                                        order_id: String(i.order_id),
                                                        amount: String(i.amount),
                                                        status: i.status
                                                    })

                                                    setDialogOpen(true)

                                                }}
                                            >

                                                <Pencil size={14} />

                                            </Button>


                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => downloadInvoice(i, customer)}
                                            >

                                                PDF

                                            </Button>

                                        </TableCell>

                                    </TableRow>

                                )

                            })}

                        </TableBody>

                    </Table>

                </CardContent>

            </Card>

        </div>

    )

}