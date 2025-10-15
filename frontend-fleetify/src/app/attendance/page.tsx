"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, User } from "lucide-react"
import { attendanceApi } from "@/lib/api"

export default function AttendancePage() {
  const [employeeId, setEmployeeId] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [lastAction, setLastAction] = useState<"clockin" | "clockout" | "">("")
  const [attendanceData, setAttendanceData] = useState<{
    clock_in?: string
    clock_out?: string
    employee_id?: string
    name?: string
    department?: string
    isLate?: boolean
    attendance_id?: string
  }>({})

  const handleClockIn = async () => {
    if (!employeeId) return
    
    setStatus("loading")
    setLastAction("clockin")
    
    try {
      const res = await attendanceApi.clockIn({ employee_id: employeeId })
      setMessage(res.data.message || "Berhasil Absen Masuk")
      setStatus("success")
      // Update dengan data dari response termasuk department dan isLate
      const responseData = res.data.data
      setAttendanceData({
        employee_id: responseData.employee_id,
        clock_in: formatDateTime(responseData.clock_in),
        name: responseData.employee_name || responseData.name,
        department: responseData.department,
        isLate: responseData.isLate || responseData.is_late, 
        attendance_id: responseData.attendance_id
      })
      setEmployeeId("")
    } catch (error: any) {
      console.error("ClockIn Error:", error.response?.data) // Debug log
      setMessage(error.response?.data?.error || "Error clocking in")
      setStatus("error")
    }
  }

  const handleClockOut = async () => {
    if (!employeeId) return
    
    setStatus("loading")
    setLastAction("clockout")
    
    try {
      const res = await attendanceApi.clockOut({ employee_id: employeeId })
      setMessage(res.data.message || "Berhasil Absen Keluar")
      setStatus("success")
      // Update dengan data lengkap dari response
      const responseData = res.data.data
      setAttendanceData(prev => ({
        ...prev, // Pertahankan data sebelumnya (termasuk status isLate dari clock in)
        employee_id: responseData.employee_id,
        clock_in: formatDateTime(responseData.clock_in),
        clock_out: formatDateTime(responseData.clock_out),
        name: responseData.employee_name || responseData.name, // Coba kedua field
        department: responseData.department,
        attendance_id: responseData.attendance_id
        // Tidak update isLate karena ClockOut tidak mengubah status keterlambatan
      }))
      setEmployeeId("")
    } catch (error: any) {
      console.error("ClockOut Error:", error.response?.data) // Debug log
      setMessage(error.response?.data?.error || "Error clocking out")
      setStatus("error")
    }
  }

// Fungsi untuk memformat tanggal dan waktu
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString('id-ID');
  }

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case "error":
        return <XCircle className="w-6 h-6 text-red-500" />
      case "loading":
        return <Clock className="w-6 h-6 text-blue-500 animate-spin" />
      default:
        return <User className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "loading":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {getStatusIcon()}
            <span>KEHADIRAN</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Karyawan ID</Label>
            <Input 
              id="employeeId"
              value={employeeId} 
              onChange={(e) => setEmployeeId(e.target.value)} 
              placeholder="Masukkan ID karyawan" 
              className="text-center"
            />
          </div>
          
         <div className="flex space-x-2">
            <Button 
              onClick={handleClockIn} 
              className="flex-1"
              variant={lastAction === "clockin" && status !== "error" ? "default" : "outline"}
              disabled={status === "loading"}
            >
              {status === "loading" && lastAction === "clockin" ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Absen Masuk
            </Button>
            <Button 
              onClick={handleClockOut} 
              variant={lastAction === "clockout" && status !== "error" ? "default" : "outline"}
              className="flex-1"
              disabled={status === "loading"}
            >
              {status === "loading" && lastAction === "clockout" ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Absen Keluar
            </Button>
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg text-center ${getStatusColor()} bg-muted`}>
              <p className="font-medium">{message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {attendanceData.employee_id && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Status Kehadiran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-medium">ID Karyawan:</div>
              <div>{attendanceData.employee_id}</div>
              
              {attendanceData.name && (
                <>
                  <div className="font-medium">Nama:</div>
                  <div>{attendanceData.name}</div>
                </>
              )}
              
              {attendanceData.department && (
                <>
                  <div className="font-medium">Department:</div>
                  <div>{attendanceData.department}</div>
                </>
              )}
              
              <div className="font-medium">Absen Masuk:</div>
              <div className={attendanceData.clock_in ? "text-green-600" : "text-gray-400"}>
                {attendanceData.clock_in || "Belum Absen Masuk"}
              </div>
              
              <div className="font-medium">Absen Keluar:</div>
              <div className={attendanceData.clock_out ? "text-blue-600" : "text-gray-400"}>
                {attendanceData.clock_out || "Belum Absen Keluar"}
              </div>
              
              {attendanceData.clock_in && (
                <> 
              <div className="font-medium">Status:</div>
               <div className={attendanceData.isLate ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                    {attendanceData.isLate ? "🔴 Terlambat" : "🟢 Ontime"}
                  </div>
                  </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Informasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Pastikan ID karyawan benar sebelum melakukan absen masuk atau keluar</p>
            <p>• Absen masuk hanya bisa dilakukan sekali per hari</p>
            <p>• Absen Keluar hanya bisa dilakukan setelah clock in</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}