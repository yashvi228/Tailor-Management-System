import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
getCustomers,
getMeasurements,
addMeasurement,
updateMeasurement,
deleteMeasurement
} from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

import { Search, Plus } from "lucide-react"

export default function Measurements(){

const queryClient = useQueryClient()

const [open,setOpen] = useState(false)
const [editId,setEditId] = useState<number | null>(null)

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


const addMutation = useMutation({
mutationFn:addMeasurement,
onSuccess:()=>{
queryClient.invalidateQueries({queryKey:["measurements"]})
setOpen(false)
resetForm()
}
})


const updateMutation = useMutation({
mutationFn:(data:any)=>updateMeasurement(editId,data),
onSuccess:()=>{
queryClient.invalidateQueries({queryKey:["measurements"]})
setOpen(false)
setEditId(null)
resetForm()
}
})


const deleteMutation = useMutation({
mutationFn:deleteMeasurement,
onSuccess:()=>{
queryClient.invalidateQueries({queryKey:["measurements"]})
}
})


const resetForm=()=>{
setForm({
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
}


const submit=(e:any)=>{
e.preventDefault()

const data={
customer_id:Number(form.customer_id),
chest:Number(form.chest),
waist:Number(form.waist),
hips:Number(form.hips),
shoulder:Number(form.shoulder),
sleeve:Number(form.sleeve),
inseam:Number(form.inseam),
neck:Number(form.neck),
notes:form.notes
}

if(editId){
updateMutation.mutate(data)
}else{
addMutation.mutate(data)
}
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


<div className="relative max-w-md">

<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

<Input
className="pl-9"
placeholder="Search by customer..."
/>

</div>


<div className="grid gap-4">

{measurements.map((m:any)=>{

const customer=customers.find((c:any)=>c.id===m.customer_id)

return(

<Card key={m.id} className="p-4">

<div className="flex justify-between items-start">

<div>

<h3 className="font-semibold">
{customer?.name}
</h3>

<div className="grid grid-cols-4 gap-4 mt-3 text-sm">

<p>Chest {m.chest}"</p>
<p>Waist {m.waist}"</p>
<p>Hips {m.hips}"</p>
<p>Shoulder {m.shoulder}"</p>
<p>Sleeve {m.sleeve}"</p>
<p>Inseam {m.inseam}"</p>
<p>Neck {m.neck}"</p>

</div>

</div>

<div className="flex gap-2">

<Button
variant="outline"
onClick={()=>{

setEditId(m.id)

setForm({
customer_id:m.customer_id,
chest:m.chest,
waist:m.waist,
hips:m.hips,
shoulder:m.shoulder,
sleeve:m.sleeve,
inseam:m.inseam,
neck:m.neck,
notes:m.notes
})

setOpen(true)

}}
>
Edit
</Button>

<Button
variant="destructive"
onClick={()=>deleteMutation.mutate(m.id)}
>
Delete
</Button>

</div>

</div>

</Card>

)

})}

</div>


{open && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white w-[500px] rounded-xl p-6 space-y-4">

<h2 className="text-lg font-semibold">

{editId ? "Edit Measurements" : "Record Measurements"}

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

<Input placeholder="Chest" value={form.chest} onChange={(e)=>setForm({...form,chest:e.target.value})}/>

<Input placeholder="Waist" value={form.waist} onChange={(e)=>setForm({...form,waist:e.target.value})}/>

<Input placeholder="Hips" value={form.hips} onChange={(e)=>setForm({...form,hips:e.target.value})}/>

<Input placeholder="Shoulder" value={form.shoulder} onChange={(e)=>setForm({...form,shoulder:e.target.value})}/>

<Input placeholder="Sleeve" value={form.sleeve} onChange={(e)=>setForm({...form,sleeve:e.target.value})}/>

<Input placeholder="Inseam" value={form.inseam} onChange={(e)=>setForm({...form,inseam:e.target.value})}/>

<Input placeholder="Neck" value={form.neck} onChange={(e)=>setForm({...form,neck:e.target.value})}/>

</div>


<Input
placeholder="Notes"
value={form.notes}
onChange={(e)=>setForm({...form,notes:e.target.value})}
/>


<Button className="w-full">

{editId ? "Update Measurements" : "Save Measurements"}

</Button>

</form>

</div>

</div>

)}

</div>

)

}