import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getOrders, addOrder, getCustomers } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Search, Plus } from "lucide-react"

export default function Orders(){

const queryClient = useQueryClient()

const [open,setOpen] = useState(false)

const [form,setForm] = useState({
customer_id:"",
description:"",
due_date:"",
amount:""
})

const {data:orders=[]} = useQuery({
queryKey:["orders"],
queryFn:getOrders
})

const {data:customers=[]} = useQuery({
queryKey:["customers"],
queryFn:getCustomers
})

const mutation = useMutation({
mutationFn:addOrder,
onSuccess:()=>{
queryClient.invalidateQueries({queryKey:["orders"]})
setOpen(false)
}
})

const submit=(e:any)=>{
e.preventDefault()
mutation.mutate(form)
}

return(

<div className="space-y-6">

<div className="flex items-center justify-between">

<div>
<h1 className="text-2xl font-semibold">Orders</h1>
<p className="text-muted-foreground">
Track and manage tailoring orders
</p>
</div>

<Button onClick={()=>setOpen(true)} className="gap-2">
<Plus size={16}/>
New Order
</Button>

</div>


{/* Search */}

<div className="flex gap-3 max-w-xl">

<div className="relative w-full">

<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

<Input
className="pl-9"
placeholder="Search orders..."
/>

</div>

<select className="border rounded-md p-2">

<option>All Status</option>
<option>Pending</option>
<option>Delivered</option>

</select>

</div>


{/* Orders Table */}

<div className="border rounded-lg overflow-hidden">

<table className="w-full">

<thead className="bg-muted">

<tr className="text-left text-sm">

<th className="p-3">Customer</th>
<th>Description</th>
<th>Status</th>
<th>Due Date</th>
<th>Amount</th>

</tr>

</thead>

<tbody>

{orders.map((o:any)=>{

const customer = customers.find((c:any)=>c.id===o.customer_id)

return(

<tr key={o.id} className="border-t">

<td className="p-3">
{customer?.name}
</td>

<td>
{o.description}
</td>

<td>

<span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
{o.status || "Pending"}
</span>

</td>

<td>
{o.due_date}
</td>

<td>
₹{o.amount}
</td>

</tr>

)

})}

</tbody>

</table>

</div>


{/* Modal */}

{open && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white rounded-xl w-[450px] p-6 space-y-4">

<h2 className="text-lg font-semibold">
Create New Order
</h2>

<form onSubmit={submit} className="space-y-3">

<select
className="border rounded-md p-2 w-full"
onChange={(e)=>setForm({...form,customer_id:e.target.value})}
>

<option>Select customer</option>

{customers.map((c:any)=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>

<Input
placeholder="Description"
onChange={(e)=>setForm({...form,description:e.target.value})}
/>

<div className="grid grid-cols-2 gap-3">

<Input
type="date"
onChange={(e)=>setForm({...form,due_date:e.target.value})}
/>

<Input
type="number"
placeholder="Amount"
onChange={(e)=>setForm({...form,amount:e.target.value})}
/>

</div>

<Button className="w-full">
Create Order
</Button>

</form>

</div>

</div>

)}

</div>

)

}