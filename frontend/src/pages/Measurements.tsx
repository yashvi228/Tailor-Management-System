import { useState } from "react"
import { Plus, Search, Ruler } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

import { Label } from "@/components/ui/label"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getMeasurements, addMeasurement, getCustomers } from "@/lib/api"



export default function Measurements() {

    const queryClient = useQueryClient()

    const [search, setSearch] = useState("")
    const [open, setOpen] = useState(false)

    const [form, setForm] = useState({
        customer_id: "",
        garment_type: "",
        chest: "",
        waist: "",
        hips: "",
        shoulder: "",
        sleeve: "",
        inseam: "",
        neck: "",
        notes: ""
    })


    const { data: customers = [] } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers
    })


    const { data: measurements = [] } = useQuery({
        queryKey: ["measurements"],
        queryFn: getMeasurements
    })


    const mutation = useMutation({
        mutationFn: addMeasurement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["measurements"] })
            setOpen(false)

            setForm({
                customer_id: "",
                garment_type: "",
                chest: "",
                waist: "",
                hips: "",
                shoulder: "",
                sleeve: "",
                inseam: "",
                neck: "",
                notes: ""
            })
        }
    })


    const submit = (e: any) => {

        e.preventDefault()

        mutation.mutate({

            customer_id: Number(form.customer_id),
            garment_type: form.garment_type,
            chest: Number(form.chest),
            waist: Number(form.waist),
            hips: Number(form.hips),
            shoulder: Number(form.shoulder),
            sleeve: Number(form.sleeve),
            inseam: Number(form.inseam),
            neck: Number(form.neck),
            notes: form.notes

        })

    }



    const filtered = measurements.filter((m: any) => {

        const customer = customers.find((c: any) => c.id === m.customer_id)

        return customer?.name?.toLowerCase().includes(search.toLowerCase())

    })



    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold">
                        Measurements
                    </h1>

                    <p className="text-muted-foreground">
                        Customer body measurements record
                    </p>

                </div>


                <Dialog open={open} onOpenChange={setOpen}>

                    <DialogTrigger asChild>

                        <Button>

                            <Plus className="mr-2 h-4 w-4" />

                            Add Measurement

                        </Button>

                    </DialogTrigger>


                    <DialogContent className="max-w-lg">

                        <DialogHeader>

                            <DialogTitle>
                                Record Measurements
                            </DialogTitle>

                        </DialogHeader>


                        <form onSubmit={submit} className="space-y-4">


                            {/* Customer */}

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



                            {/* Garment Type */}

                            <div className="space-y-2">

                                <Label>Garment Type</Label>

                                <Select
                                    value={form.garment_type}
                                    onValueChange={(v) => setForm({ ...form, garment_type: v })}
                                >

                                    <SelectTrigger>
                                        <SelectValue placeholder="Select garment" />
                                    </SelectTrigger>

                                    <SelectContent>

                                        <SelectItem value="Shirt">Shirt</SelectItem>
                                        <SelectItem value="Pant">Pant</SelectItem>
                                        <SelectItem value="Suit">Suit</SelectItem>
                                        <SelectItem value="Kurta">Kurta</SelectItem>

                                    </SelectContent>

                                </Select>

                            </div>



                            {/* Measurements */}

                            <div className="grid grid-cols-2 gap-3">

                                <Input
                                    placeholder="Chest"
                                    onChange={(e) => setForm({ ...form, chest: e.target.value })}
                                />

                                <Input
                                    placeholder="Waist"
                                    onChange={(e) => setForm({ ...form, waist: e.target.value })}
                                />

                                <Input
                                    placeholder="Hips"
                                    onChange={(e) => setForm({ ...form, hips: e.target.value })}
                                />

                                <Input
                                    placeholder="Shoulder"
                                    onChange={(e) => setForm({ ...form, shoulder: e.target.value })}
                                />

                                <Input
                                    placeholder="Sleeve"
                                    onChange={(e) => setForm({ ...form, sleeve: e.target.value })}
                                />

                                <Input
                                    placeholder="Inseam"
                                    onChange={(e) => setForm({ ...form, inseam: e.target.value })}
                                />

                                <Input
                                    placeholder="Neck"
                                    onChange={(e) => setForm({ ...form, neck: e.target.value })}
                                />

                            </div>



                            {/* Notes */}

                            <Input
                                placeholder="Notes"
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            />


                            <Button className="w-full">

                                Save Measurements

                            </Button>

                        </form>

                    </DialogContent>

                </Dialog>

            </div>



            {/* Search */}

            <div className="relative max-w-sm">

                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Search by customer"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>



            {/* List */}

            <div className="grid gap-4 sm:grid-cols-2">

                {filtered.map((m: any) => {

                    const customer = customers.find((c: any) => c.id === m.customer_id)

                    return (

                        <Card key={m.id}>

                            <CardHeader>

                                <CardTitle className="flex items-center gap-2">

                                    <Ruler className="h-4 w-4" />

                                    {customer?.name}

                                </CardTitle>

                            </CardHeader>


                            <CardContent>

                                <div className="grid grid-cols-4 gap-2 text-sm">

                                    <p>Chest: {m.chest}"</p>
                                    <p>Waist: {m.waist}"</p>
                                    <p>Hips: {m.hips}"</p>
                                    <p>Shoulder: {m.shoulder}"</p>
                                    <p>Sleeve: {m.sleeve}"</p>
                                    <p>Inseam: {m.inseam}"</p>
                                    <p>Neck: {m.neck}"</p>

                                </div>

                                {m.notes && (

                                    <p className="mt-3 text-xs text-muted-foreground">

                                        📝 {m.notes}

                                    </p>

                                )}

                            </CardContent>

                        </Card>

                    )

                })}

            </div>

        </div>

    )

}