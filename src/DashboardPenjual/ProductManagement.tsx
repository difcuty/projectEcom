import { useEffect, useState } from 'react'
import AddEditProduct from './AddEditProduct'
import { productService } from '../services/productService'

import {
  Plus,
  Download,
  Search,
  Calendar,
  ChevronDown,
  Edit3,
  Trash2,
  Laptop,
  MousePointer,
  Keyboard,
  Layers
} from 'lucide-react'

export default function ProductManagement() {

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const [isAddEditOpen, setIsAddEditOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  // ==============================
  // LOAD DATA DARI DATABASE
  // ==============================
  const fetchProducts = async () => {

    try {

      setLoading(true)

      const data = await productService.getProducts()

      setProducts(data)

    } catch (err: any) {

      console.error(err)
      setError('Gagal mengambil data produk')

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    fetchProducts()

  }, [])

  // ==============================
  // FORMAT RUPIAH
  // ==============================
  const formatRupiah = (val: number) => {

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val || 0)
  }

  // ==============================
  // ADD
  // ==============================
  const handleAddNewProduct = () => {

    setSelectedProduct(null)
    setIsAddEditOpen(true)
  }

  // ==============================
  // EDIT
  // ==============================
  const handleEditProduct = (product: any) => {

    setSelectedProduct(product)
    setIsAddEditOpen(true)
  }

  // ==============================
  // DELETE
  // ==============================
  const handleDeleteProduct = async (id: number) => {

    const confirmDelete = confirm(
      'Apakah yakin ingin menghapus produk ini?'
    )

    if (!confirmDelete) return

    try {

      await productService.deleteProduct(id)

      await fetchProducts()

      alert('Produk berhasil dihapus')

    } catch (err) {

      console.error(err)
      alert('Gagal menghapus produk')
    }
  }

  // ==============================
  // SAVE
  // ==============================
  const handleSaveProduct = async () => {

    setIsAddEditOpen(false)

    await fetchProducts()
  }

  // ==============================
  // FILTER SEARCH
  // ==============================
  const filteredProducts = products.filter((p) => {

    const keyword = search.toLowerCase()

    return (
      p.nama?.toLowerCase().includes(keyword) ||
      p.sku?.toLowerCase().includes(keyword)
    )
  })

  // ==============================
  // FORM PAGE
  // ==============================
  if (isAddEditOpen) {

    return (
      <AddEditProduct
        productData={selectedProduct}
        onCancel={() => setIsAddEditOpen(false)}
        onSave={handleSaveProduct}
      />
    )
  }

  // ==============================
  // LOADING
  // ==============================
  if (loading) {

    return (
      <div className="p-10 text-sm font-semibold text-stone-600">
        Loading products...
      </div>
    )
  }

  // ==============================
  // ERROR
  // ==============================
  if (error) {

    return (
      <div className="p-10 text-sm font-semibold text-red-500">
        {error}
      </div>
    )
  }

  return (

    <div
      className="p-6 bg-stone-50 min-h-screen text-stone-800"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >

      {/* HEADER */}
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-stone-900">
          Manajemen Produk Saya
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-3 flex flex-col gap-6">

          {/* TOPBAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">

            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">

              <button
                onClick={handleAddNewProduct}
                className="flex items-center gap-1.5 bg-stone-900 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors"
              >
                <Plus size={14} />
                Tambah Produk Baru
              </button>

              {/* SEARCH */}
              <div className="relative flex-1 max-w-xs">

                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 border border-stone-200 rounded-lg bg-white text-stone-600 hover:bg-stone-50">
                Kategori <ChevronDown size={12} />
              </button>

              <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 border border-stone-200 rounded-lg bg-white text-stone-600 hover:bg-stone-50">
                Status <ChevronDown size={12} />
              </button>

              <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 border border-stone-200 rounded-lg bg-white text-stone-600 hover:bg-stone-50">
                <Calendar size={12} className="mr-1" />
                Tanggal Dibuat
                <ChevronDown size={12} />
              </button>
            </div>

            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-700 hover:bg-stone-50 transition-colors">
              <Download size={14} />
              Export Data
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">

            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900">
                Daftar Produk
              </h2>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse">

                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[11px] uppercase tracking-wider">

                    <th className="p-3">SKU</th>
                    <th className="p-3">Produk</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-right">Harga</th>
                    <th className="p-3 text-center">Stok</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Aksi</th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">

                  {filteredProducts.map((prod) => {

                    return (

                      <tr
                        key={prod.id}
                        className="hover:bg-stone-50/50 transition-colors"
                      >

                        {/* SKU */}
                        <td className="p-3 text-stone-400 font-mono text-[11px]">
                          {prod.sku}
                        </td>

                        {/* NAMA */}
                        <td className="p-3">

                          <div className="flex items-center gap-3">

                            {/* IMAGE */}
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200 bg-white flex items-center justify-center">

                              {prod.icon ? (

                                <img
                                  src={`http://localhost:3000${prod.icon}`}
                                  alt={prod.nama}
                                  className="w-full h-full object-cover"
                                />

                              ) : (

                                <Layers size={18} />
                              )}
                            </div>

                            <div>

                              <div className="font-semibold text-stone-900">
                                {prod.nama}
                              </div>

                              <div className="text-[11px] text-stone-400">
                                {prod.brand || '-'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* KATEGORI */}
                        <td className="p-3 text-stone-500">
                          {prod.kategori || '-'}
                        </td>

                        {/* HARGA */}
                        <td className="p-3 text-right font-semibold">
                          {formatRupiah(prod.harga_dasar)}
                        </td>

                        {/* STOK */}
                        <td className="p-3 text-center font-mono">
                          {prod.stok_total}
                        </td>

                        {/* STATUS */}
                        <td className="p-3 text-center">

                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              prod.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-stone-100 text-stone-600 border border-stone-300'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="p-3">

                          <div className="flex items-center justify-center gap-1">

                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="p-1 border border-stone-200 rounded text-stone-600 hover:bg-stone-100"
                            >
                              <Edit3 size={12} />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1 border border-stone-200 rounded text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 size={12} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  })}

                </tbody>

              </table>

            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-6">

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">

            <h2 className="text-sm font-bold text-stone-900 mb-4">
              Statistik Produk
            </h2>

            <div className="flex flex-col gap-3 text-xs">

              <div className="flex justify-between">
                <span>Total Produk</span>
                <span className="font-bold">{products.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Produk Aktif</span>
                <span className="font-bold">
                  {
                    products.filter(
                      (p) => p.status === 'Active'
                    ).length
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span>Stok Habis</span>
                <span className="font-bold">
                  {
                    products.filter(
                      (p) => Number(p.stok_total) <= 0
                    ).length
                  }
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}