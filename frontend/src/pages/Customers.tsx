import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Phone, Mail, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getCustomers, addCustomer } from "@/lib/api"



export default function Customers() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  })



  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers
  })



  const createMutation = useMutation({

    mutationFn: addCustomer,

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["customers"] })

      setDialogOpen(false)

      setForm({
        name: "",
        phone: "",
        email: "",
        address: ""
      })

    }

  })



  const filtered = customers.filter((c: any) =>

    c.name?.toLowerCase().includes(search.toLowerCase()) ||

    (c.phone && c.phone.includes(search))

  )



  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Customers
          </h1>

          <p className="text-muted-foreground">
            Manage your customer directory
          </p>

        </div>



        {/* Add Customer */}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

          <DialogTrigger asChild>

            <Button>

              <Plus className="mr-2 h-4 w-4" />

              Add Customer

            </Button>

          </DialogTrigger>



          <DialogContent>

            <DialogHeader>

              <DialogTitle>
                Add New Customer
              </DialogTitle>

            </DialogHeader>



            <form
              onSubmit={(e) => {
                e.preventDefault()
                createMutation.mutate(form)
              }}
              className="space-y-4"
            >

              <div className="space-y-2">

                <Label>
                  Full Name
                </Label>

                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

              </div>



              <div className="space-y-2">

                <Label>
                  Phone
                </Label>

                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />

              </div>



              <div className="space-y-2">

                <Label>
                  Email
                </Label>

                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

              </div>



              <div className="space-y-2">

                <Label>
                  Address
                </Label>

                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />

              </div>



              <Button
                type="submit"
                className="w-full"
              >

                Add Customer

              </Button>

            </form>

          </DialogContent>

        </Dialog>

      </div>



      {/* Search */}

      <div className="relative max-w-sm">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search customers..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>



      {/* Customer Cards */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {filtered.map((customer: any) => (

          <Card
            key={customer.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate(`/customers/${customer.id}`)}
          >

            <CardHeader className="pb-3">

              <CardTitle className="text-lg">

                {customer.name}

              </CardTitle>

            </CardHeader>



            <CardContent className="space-y-2 text-sm">

              <div className="flex items-center gap-2 text-muted-foreground">

                <Phone className="h-3.5 w-3.5" />

                {customer.phone || "—"}

              </div>



              <div className="flex items-center gap-2 text-muted-foreground">

                <Mail className="h-3.5 w-3.5" />

                {customer.email || "—"}

              </div>



              <div className="flex items-center gap-2 text-muted-foreground">

                <MapPin className="h-3.5 w-3.5" />

                {customer.address || "—"}

              </div>

            </CardContent>

          </Card>

        ))}



        {filtered.length === 0 && (

          <p className="col-span-full text-center text-muted-foreground py-8">

            No customers found

          </p>

        )}

      </div>

    </div>

  )

}