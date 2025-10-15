"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Pencil, Trash2 } from "lucide-react"
import { departmentApi } from "@/lib/api"
import { Department } from "@/types"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    department_name: "",
    max_clock_in_time: "",
    max_clock_out_time: ""
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await departmentApi.getAll()
      setDepartments(res.data?.data || [])
    } catch (error) {
      console.error("Error loading departments:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await departmentApi.create(formData)
      setOpen(false)
      setFormData({ department_name: "", max_clock_in_time: "", max_clock_out_time: "" })
      loadData()
    } catch (error) {
      console.error("Error creating department:", error)
    }
  }

  const handleEdit = (department: Department) => {
    setCurrentDepartment(department)
    setFormData({
      department_name: department.department_name,
      max_clock_in_time: department.max_clock_in_time,
      max_clock_out_time: department.max_clock_out_time
    })
    setEditOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentDepartment) return
    
    try {
      await departmentApi.update(currentDepartment.id, formData)
      setEditOpen(false)
      setCurrentDepartment(null)
      setFormData({ department_name: "", max_clock_in_time: "", max_clock_out_time: "" })
      loadData()
    } catch (error) {
      console.error("Error updating department:", error)
    }
  }

const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus department ini?Penghapusan tidak dapat dilakukan jika masih ada karyawan yang terdaftar di department ini")) return
    try {
      await departmentApi.delete(id)
      loadData()
    } catch (error) {
      console.error("Error deleting department:", error)
    }
  }

  if (!isClient) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Departemen</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Departemen</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Departemen Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department_name">Nama Departemen</Label>
                <Input 
                  id="department_name"
                  value={formData.department_name} 
                  onChange={(e) => setFormData({...formData, department_name: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_clock_in_time">Batas Absen Masuk</Label>
                <Input 
                  id="max_clock_in_time"
                  type="time"
                  value={formData.max_clock_in_time} 
                  onChange={(e) => setFormData({...formData, max_clock_in_time: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_clock_out_time">Batas Absen keluar</Label>
                <Input 
                  id="max_clock_out_time"
                  type="time"
                  value={formData.max_clock_out_time} 
                  onChange={(e) => setFormData({...formData, max_clock_out_time: e.target.value})} 
                  required 
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Batal</Button>
                </DialogClose>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog Edit Department */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Departemen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_department_name">Nama Departemen</Label>
              <Input 
                id="edit_department_name"
                value={formData.department_name} 
                onChange={(e) => setFormData({...formData, department_name: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_max_clock_in_time">Batas Absen Masuk</Label>
              <Input 
                id="edit_max_clock_in_time"
                type="time"
                value={formData.max_clock_in_time} 
                onChange={(e) => setFormData({...formData, max_clock_in_time: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_max_clock_out_time">Batas Absen Keluar</Label>
              <Input 
                id="edit_max_clock_out_time"
                type="time"
                value={formData.max_clock_out_time} 
                onChange={(e) => setFormData({...formData, max_clock_out_time: e.target.value})} 
                required 
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Batal</Button>
              </DialogClose>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Batas Absen Masuk</TableHead>
              <TableHead>Batas Absen Keluar</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map(dept => (
              <TableRow key={dept.id}>
                <TableCell className="font-medium">{dept.department_name}</TableCell>
                <TableCell>{dept.max_clock_in_time}</TableCell>
                <TableCell>{dept.max_clock_out_time}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(dept)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(dept.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}