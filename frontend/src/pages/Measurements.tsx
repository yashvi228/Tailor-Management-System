import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCustomers, getMeasurements, addMeasurement } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

import { Search, Plus } from "lucide-react"

export default function Measurements(){

const queryClient = useQueryClient()

const [open,setOpen] = useState(false)

const [form,setForm] = useState({
customer_id:"",
chest:"",
waist:"",
hips:"",
shoulder:"",
sleeve:"",
inseam:"",
neck:"",
notes:""
})

const {data:customers=[]} = useQuery({
queryKey:["customers"],
queryFn:getCustomers
})

const {data:measurements=[]} = useQuery({
queryKey:["measurements"],
queryFn:getMeasurements
})

const mutation = useMutation({
mutationFn:addMeasurement,
onSuccess:()=>{
queryClient.invalidateQueries({queryKey:["measurements"]})
setOpen(false)
}
})
const submit=(e:any)=>{
  e.preventDefault()
  
  mutation.mutate({
    customer_id:Number(form.customer_id),
    chest:Number(form.chest),
    waist:Number(form.waist),
    hips:Number(form.hips),
    shoulder:Number(form.shoulder),
    sleeve:Number(form.sleeve),
    inseam:Number(form.inseam),
    neck:Number(form.neck),
    notes:form.notes
  })
  
  }
return(

<div className="space-y-6">

<div className="flex items-center justify-between">

<div>
<h1 className="text-2xl font-semibold">Measurements</h1>
<p className="text-muted-foreground">
Customer body measurements record
</p>
</div>

<Button onClick={()=>setOpen(true)} className="gap-2">
<Plus size={16}/>
Add Measurement
</Button>

</div>


{/* Search */}

<div className="relative max-w-md">

<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

<Input
className="pl-9"
placeholder="Search by customer..."
/>

</div>


{/* Measurements List */}
{measurements.length > 0 && (

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

{measurements.map((m:any)=>{

const customer = customers.find((c:any)=>c.id === m.customer_id)

return(

<Card key={m.id} className="p-4 space-y-2">

<h3 className="font-semibold text-lg">
{customer?.name || "Customer"}
</h3>

<div className="text-sm text-muted-foreground space-y-1">

<p>Chest: {m.chest}</p>
<p>Waist: {m.waist}</p>
<p>Hips: {m.hips}</p>
<p>Shoulder: {m.shoulder}</p>
<p>Sleeve: {m.sleeve}</p>
<p>Inseam: {m.inseam}</p>
<p>Neck: {m.neck}</p>

{m.notes && (
<p>Notes: {m.notes}</p>
)}

</div>

</Card>

)

})}

</div>

)}



{/* Modal */}

{open && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white w-[500px] rounded-xl p-6 space-y-4">

<h2 className="text-lg font-semibold">
Record Measurements
</h2>


<form onSubmit={submit} className="space-y-3">

<select
className="border rounded-md p-2 w-full"
value={form.customer_id}
onChange={(e)=>setForm({...form,customer_id:e.target.value})}
>
<option>Select customer</option>

{customers.map((c:any)=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>


<div className="grid grid-cols-2 gap-3">

<Input
placeholder="Chest"
onChange={(e)=>setForm({...form,chest:e.target.value})}
/>

<Input
placeholder="Waist"
onChange={(e)=>setForm({...form,waist:e.target.value})}
/>

<Input
placeholder="Hips"
onChange={(e)=>setForm({...form,hips:e.target.value})}
/>

<Input
placeholder="Shoulder"
onChange={(e)=>setForm({...form,shoulder:e.target.value})}
/>

<Input
placeholder="Sleeve"
onChange={(e)=>setForm({...form,sleeve:e.target.value})}
/>

<Input
placeholder="Inseam"
onChange={(e)=>setForm({...form,inseam:e.target.value})}
/>

<Input
placeholder="Neck"
onChange={(e)=>setForm({...form,neck:e.target.value})}
/>

</div>


<Input
placeholder="Notes"
onChange={(e)=>setForm({...form,notes:e.target.value})}
/>


<Button className="w-full">
Save Measurements
</Button>

</form>

</div>

</div>

)}

</div>

)

}