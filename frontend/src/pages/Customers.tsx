import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCustomers, addCustomer } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

import { Search, Phone, Mail, MapPin, Plus } from "lucide-react"

export default function Customers() {

const queryClient = useQueryClient()

const [search,setSearch] = useState("")
const [open,setOpen] = useState(false)

const [form,setForm] = useState({
 name:"",
 phone:"",
 email:"",
 address:""
})

const {data:customers=[]} = useQuery({
 queryKey:["customers"],
 queryFn:getCustomers
})

const mutation = useMutation({
 mutationFn:addCustomer,
 onSuccess:()=>{
   queryClient.invalidateQueries({queryKey:["customers"]})
   setOpen(false)
 }
})

const submit=(e:any)=>{
 e.preventDefault()

 mutation.mutate(form)

 setForm({
  name:"",
  phone:"",
  email:"",
  address:""
 })
}

const filtered = customers.filter((c:any)=>
 c.name.toLowerCase().includes(search.toLowerCase())
)

return(

<div className="space-y-6">

<div className="flex items-center justify-between">

<div>
<h1 className="text-2xl font-semibold">Customers</h1>
<p className="text-muted-foreground">
Manage your customer directory
</p>
</div>

<Button onClick={()=>setOpen(true)} className="gap-2">
<Plus size={16}/>
Add Customer
</Button>

</div>


{/* Search */}

<div className="relative max-w-sm">

<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

<Input
className="pl-9"
placeholder="Search customers..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>


{/* Customer Cards */}

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

{filtered.map((c:any)=>(

<Card key={c.id} className="p-5 space-y-3">

<h3 className="font-semibold text-lg">
{c.name}
</h3>

<p className="flex items-center gap-2 text-sm text-muted-foreground">
<Phone size={14}/>
{c.phone}
</p>

<p className="flex items-center gap-2 text-sm text-muted-foreground">
<Mail size={14}/>
{c.email}
</p>

<p className="flex items-center gap-2 text-sm text-muted-foreground">
<MapPin size={14}/>
{c.address}
</p>

</Card>

))}

</div>


{/* Add Customer Modal */}

{open && (

<div className="fixed inset-0 flex items-center justify-center bg-black/40">

<div className="bg-white rounded-xl p-6 w-[400px] space-y-4">

<h2 className="text-lg font-semibold">
Add New Customer
</h2>

<form onSubmit={submit} className="space-y-3">

<Input
placeholder="Full Name"
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
/>

<Input
placeholder="Phone"
value={form.phone}
onChange={(e)=>setForm({...form,phone:e.target.value})}
/>

<Input
placeholder="Email"
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
/>

<Input
placeholder="Address"
value={form.address}
onChange={(e)=>setForm({...form,address:e.target.value})}
/>

<Button className="w-full">
Add Customer
</Button>

</form>

</div>

</div>

)}

</div>

)

}