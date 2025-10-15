import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Employee Attendance System',
  description: 'Employee attendance management system',
}

// Komponen navigasi yang dipisah untuk menghindari hydration error
function Navigation() {
  return (
    <nav className="flex gap-2">
      <Button variant="ghost" asChild>
        <Link href="/employees">Karyawan</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/departments">Departemen</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/attendance">Kehadiran</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/attendance/logs">History</Link>
      </Button>
    </nav>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Sistem Absensi Karyawan</Link>
            <Navigation />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}