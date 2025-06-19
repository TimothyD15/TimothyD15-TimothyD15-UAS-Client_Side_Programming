'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserSession } from '@/utils/auth'

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    const user = getUserSession()
    if (!user) {
      router.push('/signin')
    } else {
      router.push(`/dashboard/${user.role}`)
    }
  }, [])

  return <p className="text-center mt-10">Redirecting...</p>
}
