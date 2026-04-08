import { useState } from "react"
import { loginUser, signupUser } from "@/lib/api"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Scissors } from "lucide-react"

export default function Auth(){

const [mode,setMode]=useState<"login" | "signup">("login")

const [form,setForm]=useState({
email:"",
password:""
})

const submit=async(e:any)=>{
e.preventDefault()

try{

let res

if(mode==="login"){

res=await loginUser({
email:form.email,
password:form.password
})

localStorage.setItem("token",res.access_token)

window.location.href="/"

}else{

await signupUser({
email:form.email,
password:form.password
})

alert("Account created successfully")

setMode("login")

}

}catch(err){

alert("Error: Unable to connect server")

console.log(err)

}

}

return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">

<div className="bg-white w-[420px] p-8 rounded-xl shadow">

<div className="flex flex-col items-center mb-6">

<div className="bg-emerald-600 p-3 rounded-lg mb-3">
<Scissors className="text-white"/>
</div>

<h1 className="text-xl font-semibold">
Welcome back
</h1>

<p className="text-sm text-gray-500">
Sign in to TailorPro Management System
</p>

</div>

<form onSubmit={submit} className="space-y-4">

<div>
<label>Email</label>
<Input
placeholder="you@example.com"
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
/>
</div>

<div>
<label>Password</label>
<Input
type="password"
value={form.password}
onChange={(e)=>setForm({...form,password:e.target.value})}
/>
</div>

<Button className="w-full">
{mode==="login" ? "Sign in" : "Sign up"}
</Button>

</form>

<p className="text-sm text-center mt-4">

{mode==="login" ? "Don't have an account? " : "Already have account? "}

<button
type="button"
className="text-emerald-600 ml-1"
onClick={()=>setMode(mode==="login"?"signup":"login")}
>

{mode==="login" ? "Sign up" : "Sign in"}

</button>

</p>

</div>

</div>

)

}