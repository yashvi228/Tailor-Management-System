const API = "http://localhost:8000"


// CUSTOMERS
export const getCustomers = async () => {
  const res = await fetch(`${API}/customers/`)
  if(!res.ok) throw new Error("Failed to fetch customers")
  return res.json()
}

export const addCustomer = async (data:any) => {
  const res = await fetch(`${API}/customers/`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  })

  if(!res.ok) throw new Error("Failed to add customer")

  return res.json()
}


// ORDERS
export const getOrders = async () => {
  const res = await fetch(`${API}/orders/`)
  if(!res.ok) throw new Error("Failed to fetch orders")
  return res.json()
}

export const addOrder = async (data:any) => {
  const res = await fetch(`${API}/orders/`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  })

  if(!res.ok) throw new Error("Failed to add order")

  return res.json()
}


// MEASUREMENTS
export const getMeasurements = async () => {
  const res = await fetch(`${API}/measurements/`)
  if(!res.ok) throw new Error("Failed to fetch measurements")
  return res.json()
}

export const addMeasurement = async (data:any) => {
  const res = await fetch(`${API}/measurements/`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  })

  if(!res.ok) throw new Error("Failed to add measurement")

  return res.json()
}