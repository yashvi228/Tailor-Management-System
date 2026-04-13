import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  getCustomers
} from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Plus } from "lucide-react"

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Cutting: "bg-blue-100 text-blue-800",
  Stitching: "bg-purple-100 text-purple-800",
  Ready: "bg-green-100 text-green-800",
  Delivered: "bg-gray-200 text-gray-700"
}

export default function Orders() {

  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  const [form, setForm] = useState({
    customer_id: "",
    description: "",
    amount: "",
    due_date: "",
    status: "Pending"
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
    mutationFn: addOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      setOpen(false)
    }
  })


  const updateMutation = useMutation({
    mutationFn: (data: any) => updateOrder(editId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      setOpen(false)
      setEditId(null)
    }
  })


  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    }
  })


  const submit = (e: any) => {

    e.preventDefault()

    const data = {
      customer_id: Number(form.customer_id),
      description: form.description,
      amount: Number(form.amount),
      due_date: form.due_date,
      status: form.status
    }

    if (editId) {
      updateMutation.mutate(data)
    } else {
      addMutation.mutate(data)
    }

  }


  return (

    <div className="space-y-6">

      <div className="flex justify-between">

        <h1 className="text-2xl font-semibold">
          Orders
        </h1>

        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          Add Order
        </Button>

      </div>


      <div className="grid gap-4">

        {orders.map((o: any) => {

          const customer = customers.find((c: any) => c.id === o.customer_id)

          return (

            <Card key={o.id} className="p-4 flex justify-between">

              <div>

                <h3 className="font-semibold">

                  {customer?.name}

                </h3>

                <p className="text-sm">
                  {o.description}
                </p>

                <p className="text-sm text-muted-foreground">
                  ₹ {o.amount}
                </p>

                <Badge className={statusColors[o.status]}>
                  {o.status}
                </Badge>

              </div>


              <div className="flex gap-2">

                <Button
                  variant="outline"
                  onClick={() => {

                    setEditId(o.id)

                    setForm({
                      customer_id: String(o.customer_id),
                      description: o.description,
                      amount: String(o.amount),
                      due_date: o.due_date,
                      status: o.status
                    })

                    setOpen(true)

                  }}
                >

                  Edit

                </Button>


                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(o.id)}
                >

                  Delete

                </Button>

              </div>

            </Card>

          )

        })}

      </div>


      {open && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-[400px] p-6 rounded-xl space-y-3">

            <h2 className="font-semibold">

              {editId ? "Edit Order" : "Add Order"}

            </h2>


            <form onSubmit={submit} className="space-y-3">

              <select
                className="border p-2 rounded w-full"
                value={form.customer_id}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
              >

                <option>Select Customer</option>

                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}

              </select>


              <Input
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />


              <Input
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />


              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />


              <select
                className="border p-2 rounded w-full"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >

                <option value="Pending">Pending</option>
                <option value="Cutting">Cutting</option>
                <option value="Stitching">Stitching</option>
                <option value="Ready">Ready</option>
                <option value="Delivered">Delivered</option>

              </select>


              <Button className="w-full">

                {editId ? "Update Order" : "Save Order"}

              </Button>

            </form>

          </div>

        </div>

      )}

    </div>

  )

}