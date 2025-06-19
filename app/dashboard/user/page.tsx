'use client'
import { useEffect, useState } from 'react'
import { getUserSession, clearUserSession } from '@/utils/auth'
import { useRouter } from 'next/navigation'

interface Product {
  id: number;
  nama_produk: string;
  harga_satuan: number;
  quantity: number;
}

export default function UserDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()
  const user = getUserSession()

  useEffect(() => {
    if (!user || user.role !== 'user') {
      router.push('/signin')
    } else {
      fetch('http://localhost:3001/products')
        .then(res => res.json())
        .then(data => setProducts(data))
    }
  }, [])

  const handleLogout = () => {
    clearUserSession()
    router.push('/signin')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Welcome, {user?.username}</h1>
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h2 className="text-lg font-semibold mb-2">Daftar Produk</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nama Produk</th>
            <th className="p-2 border">Harga Satuan</th>
            <th className="p-2 border">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.nama_produk}</td>
              <td className="p-2 border">Rp {p.harga_satuan.toLocaleString()}</td>
              <td className="p-2 border">{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
