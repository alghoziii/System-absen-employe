"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2 } from "lucide-react"
import { employeeApi, departmentApi } from "@/lib/api"
import { Employee, Department } from "@/types"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    employee_id: "",
    department_id: "",
    name: "",
    address: ""
  })
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setIsClient(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        employeeApi.getAll(),
        departmentApi.getAll()
      ])
      setEmployees(empRes.data?.data || [])
      setDepartments(deptRes.data?.data || [])
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        employee_id: formData.employee_id,
        department_id: Number(formData.department_id),
        name: formData.name,
        address: formData.address,
      };

      await employeeApi.create(submitData);
      await loadData();              
      setOpen(false);
      setFormData({ employee_id: "", department_id: "", name: "", address: "" });
      setError("");
    } catch (err: any) {
      console.error("Error creating employee:", err);
      setError(err.response?.data?.error || "Terjadi kesalahan saat membuat karyawan");
    }
  };

  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      employee_id: employee.employee_id,
      department_id: employee.department_id.toString(),
      name: employee.name,
      address: employee.address
    });
    setEditOpen(true);
    setError("");
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;
    
    try {
      const submitData = {
        employee_id: formData.employee_id,
        department_id: Number(formData.department_id),
        name: formData.name,
        address: formData.address,
      };

      await employeeApi.update(currentEmployee.id, submitData);
      await loadData();              
      setEditOpen(false);
      setCurrentEmployee(null);
      setFormData({ employee_id: "", department_id: "", name: "", address: "" });
      setError("");
    } catch (err: any) {
      console.error("Error updating employee:", err);
      setError(err.response?.data?.error || "Terjadi kesalahan saat mengupdate karyawan");
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) return;
    try {
      await employeeApi.delete(id);
      loadData();
      setError("");
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      setError(error.response?.data?.error || "Terjadi kesalahan saat menghapus karyawan");
    }
  }

  if (!isClient) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Karyawan</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Karyawan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Karyawan Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee_id">ID Karyawan</Label>
                <Input 
                  id="employee_id"
                  value={formData.employee_id} 
                  onChange={(e) => setFormData({...formData, employee_id: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={formData.department_id} 
                  onValueChange={(value) => setFormData({...formData, department_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input 
                  id="name"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input 
                  id="address"
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
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



      {/* Dialog Edit Employee */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Karyawan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_employee_id">ID Karyawan</Label>
              <Input 
                id="edit_employee_id"
                value={formData.employee_id} 
                onChange={(e) => setFormData({...formData, employee_id: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_department">Department</Label>
              <Select 
                value={formData.department_id} 
                onValueChange={(value) => setFormData({...formData, department_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.department_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_name">Nama</Label>
              <Input 
                id="edit_name"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_address">Alamat</Label>
              <Input 
                id="edit_address"
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
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
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map(emp => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.employee_id}</TableCell>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{departments.find(d => d.id === emp.department_id)?.department_name}</TableCell>
                <TableCell>{emp.address}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(emp)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(emp.id)}
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