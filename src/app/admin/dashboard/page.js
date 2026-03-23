import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import AdminDashboard from './AdminDashboard'

export default async function DashboardPage() {
  if (!(await isAuthenticated())) {
    redirect('/admin')
  }

  return <AdminDashboard />
}
