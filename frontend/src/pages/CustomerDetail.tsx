import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Ruler, Phone, Mail, MapPin, ShoppingBag, FileText, ArrowLeft } from "lucide-react"
import { getCustomers, getMeasurements, getOrders, getInvoices } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const GARMENT_TEMPLATES: Record<string, {
  label: string
  emoji: string
  fields: { key: string; label: string }[]
}> = {
  Kurta: {
    label: "Kurta (Straight Kurti)", emoji: "👗",
    fields: [
      { key: "bust", label: "Bust / Chest" }, { key: "waist", label: "Waist" },
      { key: "hip", label: "Hip" }, { key: "shoulder", label: "Shoulder Width" },
      { key: "armhole", label: "Armhole" }, { key: "sleeve_length", label: "Sleeve Length" },
      { key: "sleeve_round", label: "Sleeve Round" }, { key: "length", label: "Kurta Length" },
      { key: "neck_depth", label: "Neck Depth (Front & Back)" }, { key: "neck_width", label: "Neck Width" },
    ],
  },
  Pants: {
    label: "Pants (Straight / Trouser)", emoji: "👖",
    fields: [
      { key: "waist", label: "Waist" }, { key: "hip", label: "Hip" },
      { key: "thigh", label: "Thigh Round" }, { key: "knee", label: "Knee Round" },
      { key: "ankle", label: "Bottom / Ankle Round" }, { key: "length", label: "Length (Waist to Ankle)" },
      { key: "rise", label: "Rise (Crotch Depth)" },
    ],
  },
  Plazo: {
    label: "Plazo (Palazzo Pants)", emoji: "👗",
    fields: [
      { key: "waist", label: "Waist" }, { key: "hip", label: "Hip" },
      { key: "length", label: "Length" }, { key: "bottom_width", label: "Bottom Width" },
      { key: "rise", label: "Rise" },
    ],
  },
  Gown: {
    label: "Gown", emoji: "👗",
    fields: [
      { key: "bust", label: "Bust" }, { key: "waist", label: "Waist" },
      { key: "hip", label: "Hip" }, { key: "shoulder", label: "Shoulder" },
      { key: "armhole", label: "Armhole" }, { key: "sleeve_length", label: "Sleeve Length" },
      { key: "length", label: "Length (Shoulder to Floor)" }, { key: "neck_depth", label: "Neck Depth & Width" },
    ],
  },
  Shirt: {
    label: "Shirt (Men / Women)", emoji: "👔",
    fields: [
      { key: "chest", label: "Chest" }, { key: "waist", label: "Waist" },
      { key: "hip", label: "Hip (for long shirts)" }, { key: "shoulder", label: "Shoulder" },
      { key: "sleeve_length", label: "Sleeve Length" }, { key: "sleeve_round", label: "Sleeve Round" },
      { key: "collar", label: "Neck / Collar Size" }, { key: "length", label: "Shirt Length" },
    ],
  },
  Leggings: {
    label: "Leggings", emoji: "👖",
    fields: [
      { key: "waist", label: "Waist" }, { key: "hip", label: "Hip" },
      { key: "thigh", label: "Thigh" }, { key: "length", label: "Length" },
      { key: "ankle", label: "Ankle" },
    ],
  },
  Anarkali: {
    label: "Anarkali Kurti", emoji: "👗",
    fields: [
      { key: "bust", label: "Bust" }, { key: "waist", label: "Waist" },
      { key: "shoulder", label: "Shoulder" }, { key: "armhole", label: "Armhole" },
      { key: "sleeve_length", label: "Sleeve Length" }, { key: "length", label: "Length (below knee / floor)" },
      { key: "neck_depth", label: "Neck Depth & Width" }, { key: "flare", label: "Flare (Umbrella fabric)" },
    ],
  },
}


function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const s = status?.toLowerCase()
  if (s === "completed" || s === "paid") return "default"
  if (s === "pending") return "secondary"
  if (s === "cancelled") return "destructive"
  return "outline"
}

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<any>(null)
  const [measurements, setMeasurements] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const [customers, allMeasurements, allOrders, allInvoices] = await Promise.all([
        getCustomers(), getMeasurements(), getOrders(), getInvoices(),
      ])
      const c = customers.find((x: any) => x.id === Number(id))
      setCustomer(c)
      setMeasurements(allMeasurements.filter((m: any) => m.customer_id === Number(id)))
      setOrders(allOrders.filter((o: any) => o.customer_id === Number(id)))
      setInvoices(allInvoices.filter((i: any) => i.customer_id === Number(id)))
    }
    load()
  }, [id])

  if (!customer) return <p className="p-6 text-muted-foreground">Loading...</p>

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">

      <Button variant="outline" size="sm" onClick={() => navigate("/customers")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Customers
      </Button>

      {/* ── Customer Profile ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{customer.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            {customer.phone || "—"}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            {customer.email || "—"}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
            <MapPin className="h-4 w-4 shrink-0" />
            {customer.address || "—"}
          </div>
        </CardContent>
      </Card>

      {/* ── Measurements ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Measurements
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {measurements.length} record{measurements.length !== 1 ? "s" : ""}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {measurements.length === 0 && (
            <p className="text-sm text-muted-foreground">No measurements recorded yet.</p>
          )}

          {measurements.map((m: any) => {
            const template = m.garment_type ? GARMENT_TEMPLATES[m.garment_type] : null
            const filledFields = template
              ? template.fields.filter((f) => m[f.key] != null && m[f.key] !== "")
              : []

            return (
              <div key={m.id} className="border rounded-lg p-4 space-y-3">
             
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{template?.emoji ?? "📏"}</span>
                  <div>
                    <p className="font-semibold text-sm">
                      {template?.label ?? m.garment_type}
                    </p>
                    {m.created_at && (
                      <p className="text-xs text-muted-foreground">
                        Recorded on{" "}
                        {new Date(m.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>

        
                {filledFields.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                    {filledFields.map((f) => (
                      <div key={f.key} className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{f.label}</span>
                        <span className="text-sm font-medium">{m[f.key]}"</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No values recorded.</p>
                )}

                {/* Notes */}
                {m.notes && (
                  <p className="text-xs text-muted-foreground border-t pt-2">
                    📝 {m.notes}
                  </p>
                )}

                {/* Image */}
                {m.image && (
                  <img
                    src={`http://127.0.0.1:8000/${m.image}`}
                    className="w-40 rounded border mt-1"
                    alt="measurement sketch"
                  />
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* ── Orders ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Orders
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {orders.length === 0 && (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          )}
          {orders.map((o: any) => (
            <div key={o.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{o.description}</p>
                <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span>₹{o.amount}</span>
                {o.due_date && (
                  <span>
                    Due:{" "}
                    {new Date(o.due_date).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Invoices ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoices
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {invoices.length === 0 && (
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          )}
          {invoices.map((i: any) => (
            <div key={i.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Invoice #{i.id}
                </p>
                <Badge variant={statusVariant(i.status)}>{i.status}</Badge>
              </div>
              <div className="flex gap-6 text-sm">
                <span className="font-medium">₹{i.amount}</span>
                {i.created_at && (
                  <span className="text-muted-foreground">
                    {new Date(i.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  )
}