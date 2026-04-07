import { useQuery } from "@tanstack/react-query"
import { Users, ShoppingBag, Clock, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCustomers, getOrders } from "@/lib/api"

export default function Dashboard(){

const {data:customers=[]} = useQuery({
 queryKey:["customers"],
 queryFn:getCustomers
})

const {data:orders=[]} = useQuery({
 queryKey:["orders"],
 queryFn:getOrders
})

const activeOrders = orders.filter((o:any)=>o.status !== "delivered")

return(

<div className="space-y-6">

<div>
<h1 className="text-2xl font-semibold">Dashboard</h1>
<p className="text-muted-foreground">Welcome back, yashvi!</p>
</div>

{/* Stats Cards */}

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

<Card>

<CardHeader className="flex flex-row items-center justify-between pb-2">

<CardTitle className="text-sm font-medium">
Total Customers
</CardTitle>

<Users className="h-4 w-4 text-muted-foreground"/>

</CardHeader>

<CardContent>

<div className="text-2xl font-bold">
{customers.length}
</div>

</CardContent>

</Card>

<Card>

<CardHeader className="flex flex-row items-center justify-between pb-2">

<CardTitle className="text-sm font-medium">
Active Orders
</CardTitle>

<Clock className="h-4 w-4 text-muted-foreground"/>

</CardHeader>

<CardContent>

<div className="text-2xl font-bold">
{activeOrders.length}
</div>

</CardContent>

</Card>

<Card>

<CardHeader className="flex flex-row items-center justify-between pb-2">

<CardTitle className="text-sm font-medium">
Pending Invoices
</CardTitle>

<FileText className="h-4 w-4 text-muted-foreground"/>

</CardHeader>

<CardContent>

<div className="text-2xl font-bold">
0
</div>

</CardContent>

</Card>

</div>


{/* Recent Orders */}

<Card>

<CardHeader>

<CardTitle className="flex items-center gap-2">

<ShoppingBag className="h-5 w-5 text-muted-foreground"/>

Recent Orders

</CardTitle>

<p className="text-sm text-muted-foreground">
Latest orders from your shop
</p>

</CardHeader>

<CardContent>

{orders.length === 0 ? (

<p className="text-muted-foreground text-sm text-center py-8">
No orders yet. Create your first order!
</p>

) : (

<div className="space-y-3">

{orders.slice(0,5).map((order:any)=>(
<div key={order.id} className="border rounded-lg p-3">

<p className="font-medium">
{order.garment_type}
</p>

<p className="text-sm text-muted-foreground">
Order #{order.id}
</p>

</div>
))}

</div>

)}

</CardContent>

</Card>

</div>

)

}