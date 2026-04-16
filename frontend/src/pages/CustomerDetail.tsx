import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import {
  getCustomers,
  getMeasurements,
  getOrders,
  getInvoices,
  addMeasurement
} from "@/lib/api"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CustomerDetail() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<any>(null)
  const [measurements, setMeasurements] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])

  const [form, setForm] = useState({
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


  const saveMeasurement = async () => {

    if (!form.garment_type) {
      alert("Garment type required")
      return
    }

    const newMeasurement = await addMeasurement({
      customer_id: Number(id),
      ...form
    })

    setMeasurements([...measurements, newMeasurement])

    setForm({
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


  if (!customer) return <p className="p-6">Loading...</p>


  return (

    <div className="space-y-6 p-4">

      <Button
        variant="outline"
        onClick={() => navigate("/customers")}
      >
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
            <p className="text-sm text-gray-500">
              No measurements yet
            </p>
          )}

          {measurements.map((m: any) => (

            <div key={m.id} className="border p-3 rounded">

              <p><b>Garment:</b> {m.garment_type}</p>
              <p>Chest: {m.chest}</p>
              <p>Waist: {m.waist}</p>
              <p>Shoulder: {m.shoulder}</p>
              <p>Sleeve: {m.sleeve}</p>

            </div>

          ))}



          {/* Add Measurement Form */}

          <div className="grid grid-cols-2 gap-2">

            <Input
              placeholder="Garment Type"
              value={form.garment_type}
              onChange={(e) =>
                setForm({ ...form, garment_type: e.target.value })
              }
            />

            <Input
              placeholder="Chest"
              value={form.chest}
              onChange={(e) =>
                setForm({ ...form, chest: e.target.value })
              }
            />

            <Input
              placeholder="Waist"
              value={form.waist}
              onChange={(e) =>
                setForm({ ...form, waist: e.target.value })
              }
            />

            <Input
              placeholder="Shoulder"
              value={form.shoulder}
              onChange={(e) =>
                setForm({ ...form, shoulder: e.target.value })
              }
            />

            <Input
              placeholder="Sleeve"
              value={form.sleeve}
              onChange={(e) =>
                setForm({ ...form, sleeve: e.target.value })
              }
            />

            <Input
              placeholder="Neck"
              value={form.neck}
              onChange={(e) =>
                setForm({ ...form, neck: e.target.value })
              }
            />

          </div>

          <Button onClick={saveMeasurement}>
            Add Measurement
          </Button>

        </CardContent>

      </Card>



      {/* Orders */}

      <Card>

        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>

        <CardContent>

          {orders.length === 0 && (
            <p className="text-sm text-gray-500">
              No orders yet
            </p>
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
            <p className="text-sm text-gray-500">
              No invoices yet
            </p>
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