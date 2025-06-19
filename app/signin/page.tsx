'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { setUserSession } from '@/utils/auth'

export default function SigninPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const res = await fetch('http://localhost:3001/users')
    const users = await res.json()
    const user = users.find((u: { username: string; password: string }) => u.username === username && u.password === password)
    
    if (user) {
      setUserSession(user)
      if (user.role === 'admin') {
        router.push('/dashboard/admin')
      } else {
        router.push('/dashboard/user')
      }
    } else {
      alert('Login gagal: Username atau password salah')
    }
  }

  return (
    <div>
      <h1>Sign In</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}