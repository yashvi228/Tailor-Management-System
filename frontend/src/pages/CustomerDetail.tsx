import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function CustomerDetail(){

  const {id} = useParams()
  const navigate = useNavigate()

  const [customer,setCustomer] = useState(null)
  const [measurements,setMeasurements] = useState([])
  const [orders,setOrders] = useState([])

  const [form,setForm] = useState({
    chest:"",
    waist:"",
    hips:"",
    shoulder:"",
    sleeve_length:"",
    inseam:"",
    outseam:"",
    neck:"",
    back_length:"",
    front_length:"",
    notes:""
  })

  useEffect(()=>{
    loadCustomer()
    loadMeasurements()
    loadOrders()
  },[])

  const loadCustomer = async ()=>{
    const res = await fetch(`http://localhost:8000/customers/${id}`)
    const data = await res.json()
    setCustomer(data)
  }

  const loadMeasurements = async ()=>{
    const res = await fetch(`http://localhost:8000/customers/${id}/measurements`)
    const data = await res.json()
    setMeasurements(data)
  }

  const loadOrders = async ()=>{
    const res = await fetch(`http://localhost:8000/customers/${id}/orders`)
    const data = await res.json()
    setOrders(data)
  }

  const addMeasurement = async (e:any)=>{
    e.preventDefault()

    await fetch("http://localhost:8000/measurements",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        ...form,
        customer_id:id
      })
    })

    setForm({
      chest:"",
      waist:"",
      hips:"",
      shoulder:"",
      sleeve_length:"",
      inseam:"",
      outseam:"",
      neck:"",
      back_length:"",
      front_length:"",
      notes:""
    })

    loadMeasurements()
  }

  const deleteCustomer = async ()=>{
    await fetch(`http://localhost:8000/customers/${id}`,{
      method:"DELETE"
    })

    navigate("/customers")
  }

  if(!customer){
    return <p>Loading...</p>
  }

  return(

    <div>

      <h2>{customer.name}</h2>

      <p>{customer.phone}</p>

      <button onClick={()=>navigate("/customers")}>
        Back
      </button>

      <button onClick={deleteCustomer}>
        Delete Customer
      </button>

      <h3>Measurements</h3>

      <form onSubmit={addMeasurement}>

        <input placeholder="Chest"
          value={form.chest}
          onChange={(e)=>setForm({...form,chest:e.target.value})}
        />

        <input placeholder="Waist"
          value={form.waist}
          onChange={(e)=>setForm({...form,waist:e.target.value})}
        />

        <input placeholder="Shoulder"
          value={form.shoulder}
          onChange={(e)=>setForm({...form,shoulder:e.target.value})}
        />

        <button type="submit">
          Add Measurement
        </button>

      </form>

      <div>

        {measurements.map((m:any)=>(
          <div key={m.id}>

            Chest: {m.chest}

            Waist: {m.waist}

          </div>
        ))}

      </div>

      <h3>Orders</h3>

      <div>

        {orders.map((o:any)=>(
          <div key={o.id}>

            Garment: {o.garment_type}

            Status: {o.status}

          </div>
        ))}

      </div>

    </div>

  )
}