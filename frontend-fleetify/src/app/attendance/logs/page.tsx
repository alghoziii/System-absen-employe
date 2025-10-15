"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Building2, Filter, Clock } from "lucide-react"
import { attendanceApi, departmentApi } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { Department } from "@/types"

export default function AttendanceLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    department: "all"
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDepartments()
    loadLogs()
  }, [])

  const loadDepartments = async () => {
    try {
      const res = await departmentApi.getAll()
      setDepartments(res.data?.data || [])
    } catch (error) {
      console.error("Error loading departments:", error)
    }
  }

  const loadLogs = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filters.date) params.date = filters.date
      if (filters.department && filters.department !== 'all') {
        params.department = filters.department
      }
      
      const res = await attendanceApi.getLogs(params)
      const items = Array.isArray(res.data?.data?.data) ? res.data.data.data : []
      setLogs(items)
    } catch (error) {
      console.error("Error loading logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    loadLogs()
  }

  const stats = {
    total: logs.length,
    completed: logs.filter(log => log.clock_out).length,
    working: logs.filter(log => !log.clock_out).length,
    uniqueEmployees: new Set(logs.map(log => log.employee_id)).size
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Data Kehadiran</h1>
        <p className="text-gray-600">Pantau kehadiran karyawan secara real-time</p>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader className="pb-1">
          <div className="flex items-center gap-1">
            <Filter className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Filter Data</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tanggal
              </Label>
              <Input
                id="date"
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Department
              </Label>
              <Select
                value={filters.department}
                onValueChange={(value) => handleFilterChange("department", value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Semua Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Department</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.department_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleApplyFilters} className="w-full" disabled={loading}>
                {loading ? "Memuat..." : "Terapkan Filter"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {logs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-sm text-blue-800">Total Kehadiran</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-sm text-green-800">Selesai Bekerja</p>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.working}</div>
              <p className="text-sm text-orange-800">Sedang Bekerja</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.uniqueEmployees}</div>
              <p className="text-sm text-purple-800">Karyawan Hadir</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Data Kehadiran</CardTitle>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {logs.length} data
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {logs.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Karyawan</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Absen Masuk</TableHead>
                    <TableHead className="font-semibold">Absen Keluar</TableHead>
                    <TableHead className="font-semibold text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map(log => (
                    <TableRow key={log.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{log.employee_id}</span>
                          <span className="text-sm text-gray-600">{log.name || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{log.department || "-"}</TableCell>
                      <TableCell className="text-gray-700">
                        {log.clock_in ? formatDate(log.clock_in) : "-"}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {log.clock_out ? formatDate(log.clock_out) : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={log.clock_out ? "outline" : "default"}
                          className={
                            log.clock_out 
                              ? "bg-green-100 text-green-800 border-green-200" 
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          {log.clock_out ? "Selesai" : "Bekerja"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="text-gray-400">
                <Clock className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">Tidak ada data kehadiran</p>
                <p className="text-sm text-gray-500">Coba ubah filter atau pilih tanggal lain</p>
              </div>
              <Button variant="outline" onClick={loadLogs}>
                Coba Lagi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}