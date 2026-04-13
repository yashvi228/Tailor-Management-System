import { Users, Scissors, FileText, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { getCustomers, getOrders, getInvoices } from "@/lib/api"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
    Ready: "bg-green-100 text-green-800 border-green-200",
    Delivered: "bg-gray-100 text-gray-600 border-gray-200",
}

export default function Dashboard() {

    const { data: customers = [] } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    })

    const { data: orders = [], isLoading: ordersLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    })

    const { data: invoices = [] } = useQuery({
        queryKey: ["invoices"],
        queryFn: getInvoices,
    })

    const activeOrders = orders.filter((o: any) =>
        ["Pending", "In Progress", "Ready"].includes(o.status)
    ).length

    const pendingInvoices = invoices.filter((i: any) =>
        ["Pending", "Unpaid"].includes(i.status)
    ).length

    const recentOrders = [...orders].sort((a: any, b: any) => b.id - a.id).slice(0, 5)

    const revenueData = Object.values(
        invoices.reduce((acc: any, inv: any) => {

            const month = new Date(inv.created_at || Date.now()).toLocaleString("default", { month: "short" })

            if (!acc[month]) acc[month] = { month, revenue: 0 }

            if (inv.status === "Paid") acc[month].revenue += Number(inv.amount)

            return acc

        }, {})
    )

    const statCards = [
        { title: "Total Customers", value: customers.length, icon: Users },
        { title: "Active Orders", value: activeOrders, icon: Scissors },
        { title: "Pending Invoices", value: pendingInvoices, icon: FileText },
    ]

    return (

        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back!</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>

                    </Card>
                ))}
            </div>


            {/* Revenue Chart */}

            <Card>

                <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>Revenue from paid invoices</CardDescription>
                </CardHeader>

                <CardContent>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>

                </CardContent>

            </Card>


            {/* Recent Orders */}

            <Card>

                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Recent Orders
                    </CardTitle>
                    <CardDescription>Latest orders from your shop</CardDescription>
                </CardHeader>

                <CardContent>

                    {ordersLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">

                            {recentOrders.map((order: any) => {

                                const customer = customers.find((c: any) => c.id === order.customer_id)

                                return (

                                    <div key={order.id} className="flex items-center justify-between border rounded-lg p-3">

                                        <div>
                                            <p className="font-medium">{customer?.name ?? "Unknown"}</p>
                                            <p className="text-sm text-muted-foreground">{order.description}</p>
                                        </div>

                                        <div className="text-right">
                                            <Badge variant="outline" className={statusColors[order.status]}>
                                                {order.status}
                                            </Badge>
                                        </div>

                                    </div>

                                )

                            })}

                        </div>
                    )}

                </CardContent>

            </Card>

        </div>

    )

}