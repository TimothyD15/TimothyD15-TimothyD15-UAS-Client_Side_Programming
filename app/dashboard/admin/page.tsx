'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserSession, clearUserSession } from '@/utils/auth'

interface Product {
  id: number;
  nama_produk: string;
  harga_satuan: number;
  quantity: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<Partial<Product>>({})
  const [editId, setEditId] = useState<number | null>(null)

  const router = useRouter()
  const user = getUserSession()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/signin')
    } else {
      fetchProducts()
    }
  }, [])

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:3001/products')
    const data = await res.json()
    setProducts(data)
  }

  const handleLogout = () => {
    clearUserSession()
    router.push('/signin')
  }

  const handleSubmit = async () => {
    const method = editId ? 'PUT' : 'POST'
    const url = editId
      ? `http://localhost:3001/products/${editId}`
      : 'http://localhost:3001/products'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      fetchProducts()
      setForm({})
      setEditId(null)
    }
  }

  const handleEdit = (product: Product) => {
    setForm(product)
    setEditId(product.id)
  }

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3001/products/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Welcome, {user?.username} (Admin)</h1>
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Form Produk */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{editId ? 'Edit Produk' : 'Tambah Produk'}</h2>
        <input
          className="border p-2 mr-2 mb-2"
          placeholder="Nama Produk"
          value={form.nama_produk || ''}
          onChange={(e) => setForm({ ...form, nama_produk: e.target.value })}
        />
        <input
          type="number"
          className="border p-2 mr-2 mb-2"
          placeholder="Harga Satuan"
          value={form.harga_satuan || ''}
          onChange={(e) => setForm({ ...form, harga_satuan: Number(e.target.value) })}
        />
        <input
          type="number"
          className="border p-2 mr-2 mb-2"
          placeholder="Quantity"
          value={form.quantity || ''}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 mr-2"
          onClick={handleSubmit}
        >
          {editId ? 'Update' : 'Tambah'}
        </button>
        {editId && (
          <button
            className="bg-gray-400 text-white px-4 py-2"
            onClick={() => {
              setEditId(null)
              setForm({})
            }}
          >
            Batal
          </button>
        )}
      </div>

      {/* Tabel Produk */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nama Produk</th>
            <th className="p-2 border">Harga Satuan</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.nama_produk}</td>
              <td className="p-2 border">Rp {p.harga_satuan.toLocaleString()}</td>
              <td className="p-2 border">{p.quantity}</td>
              <td className="p-2 border text-center">
                <button
                  className="text-blue-600 mr-2"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
