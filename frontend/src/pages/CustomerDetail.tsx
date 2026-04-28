import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
    getCustomers,
    getMeasurements,
    getOrders,
    getInvoices
} from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CustomerDetail() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [customer, setCustomer] = useState<any>(null)
    const [measurements, setMeasurements] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [invoices, setInvoices] = useState<any[]>([])

    useEffect(() => {
        async function load() {
            const customers = await getCustomers()
            const measurements = await getMeasurements()
            const orders = await getOrders()
            const invoices = await getInvoices()

            const c = customers.find((x: any) => x.id === Number(id))
            setCustomer(c)
            setMeasurements(
                measurements.filter((m: any) => m.customer_id === Number(id))
            )
            setOrders(
                orders.filter((o: any) => o.customer_id === Number(id))
            )
            setInvoices(
                invoices.filter((i: any) => i.customer_id === Number(id))
            )
        }
        load()
    }, [id])

    if (!customer) return <p className="p-6">Loading...</p>

    return (
        <div className="space-y-6 p-4">

            <Button variant="outline" onClick={() => navigate("/customers")}>
                ← Back
            </Button>

            {/* Customer Profile */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><b>Name:</b> {customer.name}</p>
                    <p><b>Phone:</b> {customer.phone}</p>
                    <p><b>Email:</b> {customer.email || "-"}</p>
                    <p><b>Address:</b> {customer.address || "-"}</p>
                </CardContent>
            </Card>

            {/* Measurements */}
            <Card>
                <CardHeader>
                    <CardTitle>Measurements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {measurements.length === 0 && (
                        <p className="text-sm text-gray-500">No measurements yet</p>
                    )}
                    {measurements.map((m: any) => (
                        <div key={m.id} className="border p-3 rounded">
                            <p><b>Garment:</b> {m.garment_type}</p>
                            <p>Chest: {m.chest}</p>
                            <p>Waist: {m.waist}</p>
                            <p>Shoulder: {m.shoulder}</p>
                            <p>Sleeve: {m.sleeve}</p>
                            <p>Neck: {m.neck}</p>
                            {m.image && (
                                <img
                                    src={`http://127.0.0.1:8000/${m.image}`}
                                    className="w-40 mt-2 rounded"
                                    alt="measurement"
                                />
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 && (
                        <p className="text-sm text-gray-500">No orders yet</p>
                    )}
                    {orders.map((o: any) => (
                        <div key={o.id} className="border p-3 rounded mb-2">
                            <p><b>Description:</b> {o.description}</p>
                            <p>Amount: ₹{o.amount}</p>
                            <p>Status: {o.status}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Invoices */}
            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    {invoices.length === 0 && (
                        <p className="text-sm text-gray-500">No invoices yet</p>
                    )}
                    {invoices.map((i: any) => (
                        <div key={i.id} className="border p-3 rounded mb-2">
                            <p><b>Invoice ID:</b> {i.id}</p>
                            <p>Amount: ₹{i.amount}</p>
                            <p>Status: {i.status}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    )
}