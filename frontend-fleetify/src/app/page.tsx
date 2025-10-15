import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";


export default function Home() {
  return (
  <div className="container mx-auto p-4 space-y-8">
  <h1 className="text-3xl font-bold text-center">Sistem Absen Karyawan</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>Karyawan</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">Kelola data karyawan Anda dengan mudah.</p>
        <Link href="/employees">
        <Button>Kelola Karyawan</Button>
        </Link>
      </CardContent>
    </Card>

     <Card>
          <CardHeader>
            <CardTitle>Departemen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Kelola Departemen</p>
            <Link href="/departments">
              <Button>Kelola Departments</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Kehadiran in/out</p>
            <Link href="/attendance">
              <Button>Kehadiran In/Out</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Lihat History Kehadiran</p>
            <Link href="/attendance/logs">
              <Button>Lihat History</Button>
            </Link>
          </CardContent>
        </Card>
  </div>
  </div>
  );
}
