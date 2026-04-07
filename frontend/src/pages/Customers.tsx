import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
getCustomers,
addCustomer,
updateCustomer,
deleteCustomer
} from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

import { Plus } from "lucide-react"

export default function Customers(){

const queryClient = useQueryClient()

const [open,setOpen] = useState(false)
const [editId,setEditId] = useState<number|null>(null)

const [form,setForm] = useState({
name:"",
phone:"",
email:"",
address:""
})

const {data:customers=[]}=useQuery({
queryKey:["customers"],
queryFn:getCustomers
})


const addMutation=useMutation({
mutationFn:addCustomer,
onSuccess:()=>{
queryClient.invalidateQueries({queryKey:["customers"]})
setOpen(false)
resetForm()
}
})


const updateMutation=useMutation({
mutationFn:(data:any)=>updateCustomer(editId,data),
onSuccess:()=>{
queryClient.invalidateQueries({queryKey:["customers"]})
setOpen(false)
setEditId(null)
resetForm()
}
})


const deleteMutation=useMutation({
mutationFn:deleteCustomer,
onSuccess:()=>{
queryClient.invalidateQueries({queryKey:["customers"]})
}
})


const resetForm=()=>{
setForm({
name:"",
phone:"",
email:"",
address:""
})
}


const submit=(e:any)=>{
e.preventDefault()

if(editId){
updateMutation.mutate(form)
}else{
addMutation.mutate(form)
}

}


return(

<div className="space-y-6">

<div className="flex justify-between">

<h1 className="text-2xl font-semibold">
Customers
</h1>

<Button onClick={()=>setOpen(true)} className="gap-2">
<Plus size={16}/>
Add Customer
</Button>

</div>


<div className="grid gap-4">

{customers.map((c:any)=>(

<Card key={c.id} className="p-4 flex justify-between items-center">

<div>

<h3 className="font-semibold">
{c.name}
</h3>

<p className="text-sm text-muted-foreground">
{c.phone}
</p>

</div>


<div className="flex gap-2">

<Button
variant="outline"
onClick={()=>{

setEditId(c.id)

setForm({
name:c.name,
phone:c.phone,
email:c.email,
address:c.address
})

setOpen(true)

}}
>
Edit
</Button>


<Button
variant="destructive"
onClick={()=>deleteMutation.mutate(c.id)}
>
Delete
</Button>

</div>

</Card>

))}

</div>


{open &&(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white w-[400px] p-6 rounded-xl space-y-3">

<h2 className="font-semibold">

{editId ? "Edit Customer" : "Add Customer"}

</h2>


<form onSubmit={submit} className="space-y-3">

<Input
placeholder="Name"
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

{editId ? "Update Customer" : "Save Customer"}

</Button>

</form>

</div>

</div>

)}

</div>

)

}