import { useState } from "react"
import { Plus, Search, Ruler, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMeasurements, addMeasurement, updateMeasurement, deleteMeasurement, getCustomers } from "@/lib/api"

const emptyForm = {
  customer_id: "",
  garment_type: "",
  chest: "",
  waist: "",
  hips: "",
  shoulder: "",
  sleeve: "",
  inseam: "",
  neck: "",
  notes: "",
}

function MeasurementForm({
  form,
  setForm,
  file,
  setFile,
  onSubmit,
  isPending,
  submitLabel,
  customers,
}: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Customer</Label>
        <Select
          value={form.customer_id}
          onValueChange={(v) => setForm({ ...form, customer_id: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((c: any) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Garment Type</Label>
        <Select
          value={form.garment_type}
          onValueChange={(v) => setForm({ ...form, garment_type: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select garment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Shirt">Shirt</SelectItem>
            <SelectItem value="Pant">Pant</SelectItem>
            <SelectItem value="Suit">Suit</SelectItem>
            <SelectItem value="Kurta">Kurta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(["chest", "waist", "hips", "shoulder", "sleeve", "inseam", "neck"] as const).map(
          (field) => (
            <Input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          )
        )}
      </div>

      <div className="space-y-2">
        <Label>Upload Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) setFile(e.target.files[0])
          }}
        />
      </div>

      <Input
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}

export default function Measurements() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")

  // Add
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState(emptyForm)
  const [addFile, setAddFile] = useState<File | null>(null)

  // Edit
  const [editOpen, setEditOpen] = useState(false)
  const [editingMeasurement, setEditingMeasurement] = useState<any>(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [editFile, setEditFile] = useState<File | null>(null)

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingMeasurement, setDeletingMeasurement] = useState<any>(null)

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  })

  const { data: measurements = [] } = useQuery({
    queryKey: ["measurements"],
    queryFn: getMeasurements,
  })

  const buildFormData = (form: typeof emptyForm, file: File | null) => {
    const fd = new FormData()
    fd.append("customer_id", form.customer_id)
    fd.append("garment_type", form.garment_type)
    const fields = ["chest", "waist", "hips", "shoulder", "sleeve", "inseam", "neck", "notes"] as const
    fields.forEach((f) => { if (form[f]) fd.append(f, form[f]) })
    if (file) fd.append("file", file)
    return fd
  }

  const addMutation = useMutation({
    mutationFn: addMeasurement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] })
      setAddOpen(false)
      setAddFile(null)
      setAddForm(emptyForm)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: any; data: FormData }) => updateMeasurement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] })
      setEditOpen(false)
      setEditingMeasurement(null)
      setEditFile(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: any) => deleteMeasurement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] })
      setDeleteOpen(false)
      setDeletingMeasurement(null)
    },
  })

  const openEdit = (m: any) => {
    setEditingMeasurement(m)
    setEditForm({
      customer_id: String(m.customer_id ?? ""),
      garment_type: m.garment_type ?? "",
      chest: m.chest ?? "",
      waist: m.waist ?? "",
      hips: m.hips ?? "",
      shoulder: m.shoulder ?? "",
      sleeve: m.sleeve ?? "",
      inseam: m.inseam ?? "",
      neck: m.neck ?? "",
      notes: m.notes ?? "",
    })
    setEditOpen(true)
  }

  const openDelete = (m: any) => {
    setDeletingMeasurement(m)
    setDeleteOpen(true)
  }

  const filtered = measurements.filter((m: any) => {
    const customer = customers.find((c: any) => c.id === m.customer_id)
    return customer?.name?.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Measurements</h1>
          <p className="text-muted-foreground">Customer body measurements record</p>
        </div>

        {/* Add */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Measurement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Record Measurements</DialogTitle>
            </DialogHeader>
            <MeasurementForm
              form={addForm}
              setForm={setAddForm}
              file={addFile}
              setFile={setAddFile}
              onSubmit={(e: any) => {
                e.preventDefault()
                addMutation.mutate(buildFormData(addForm, addFile))
              }}
              isPending={addMutation.isPending}
              submitLabel="Save Measurements"
              customers={customers}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((m: any) => {
          const customer = customers.find((c: any) => c.id === m.customer_id)
          return (
            <Card key={m.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    {customer?.name}
                    {m.garment_type && (
                      <span className="text-sm font-normal text-muted-foreground">
                        — {m.garment_type}
                      </span>
                    )}
                  </CardTitle>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(m)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => openDelete(m)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  {m.chest    && <p>Chest: {m.chest}"</p>}
                  {m.waist    && <p>Waist: {m.waist}"</p>}
                  {m.hips     && <p>Hips: {m.hips}"</p>}
                  {m.shoulder && <p>Shoulder: {m.shoulder}"</p>}
                  {m.sleeve   && <p>Sleeve: {m.sleeve}"</p>}
                  {m.inseam   && <p>Inseam: {m.inseam}"</p>}
                  {m.neck     && <p>Neck: {m.neck}"</p>}
                </div>
                {m.notes && (
                  <p className="mt-3 text-xs text-muted-foreground">📝 {m.notes}</p>
                )}
              </CardContent>
            </Card>
          )
        })}

        {filtered.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-8">
            No measurements found
          </p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Measurements</DialogTitle>
          </DialogHeader>
          <MeasurementForm
            form={editForm}
            setForm={setEditForm}
            file={editFile}
            setFile={setEditFile}
            onSubmit={(e: any) => {
              e.preventDefault()
              updateMutation.mutate({
                id: editingMeasurement?.id,
                data: buildFormData(editForm, editFile),
              })
            }}
            isPending={updateMutation.isPending}
            submitLabel="Save Changes"
            customers={customers}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Measurement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the measurement record for{" "}
              <strong>
                {customers.find((c: any) => c.id === deletingMeasurement?.customer_id)?.name}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(deletingMeasurement?.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}