import { useState } from 'react'
import {
  Upload,
  Bold,
  Italic,
  List,
  ListOrdered,
  X,
  ChevronDown
} from 'lucide-react'

import { productService } from '../services/productService'

interface AddEditProductProps {
  productData?: any
  onCancel: () => void
  onSave?: (data: any) => void
}

export default function AddEditProduct({
  productData,
  onCancel,
  onSave
}: AddEditProductProps) {

  const isEditMode = !!productData

  // ==========================================
  // STATE FORM
  // ==========================================

  const [productName, setProductName] = useState(productData?.nama || '')
  const [sku, setSku] = useState(productData?.sku || '')
  const [category, setCategory] = useState(productData?.kategori_id || 1)
  const [brand, setBrand] = useState(productData?.brand_id || 1)
  const [description, setDescription] = useState(productData?.deskripsi || '')
  const [price, setPrice] = useState(productData?.harga_dasar || '')
  const [stock, setStock] = useState(productData?.stok_total || '')
  const [weight, setWeight] = useState(productData?.berat || '')
  const [dimensions, setDimensions] = useState(productData?.dimensi || '')
  const [status, setStatus] = useState(productData?.status || 'Active')

  // ==========================================
  // IMAGE STATE
  // ==========================================

  const [image, setImage] = useState<File | null>(null)

  const [previewImage, setPreviewImage] = useState(
    productData?.icon
      ? `http://localhost:3000${productData.icon}`
      : ''
  )

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(false)

  // ==========================================
  // HANDLE IMAGE
  // ==========================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]

    if (!file) return

    setImage(file)

    setPreviewImage(URL.createObjectURL(file))
  }

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    try {

      setLoading(true)

      const formData = new FormData()

      formData.append('nama', productName)
      formData.append('sku', sku)
      formData.append('kategori_id', String(category))
      formData.append('brand_id', String(brand))
      formData.append('deskripsi', description)
      formData.append('harga_dasar', String(price))
      formData.append('stok_total', String(stock))
      formData.append('berat', String(weight))
      formData.append('dimensi', dimensions)
      formData.append('status', status)

      if (image) {
        formData.append('image', image)
      }

      let result

      // EDIT
      if (isEditMode) {

        formData.append(
          'oldImage',
          productData?.icon || ''
        )

        result = await productService.updateProduct(
          productData.id,
          formData
        )

      } else {

        // ADD
        result = await productService.createProduct(
          formData
        )
      }

      console.log(result)

      if (onSave) {
        onSave(result)
      }

      alert(
        isEditMode
          ? 'Produk berhasil diupdate'
          : 'Produk berhasil ditambahkan'
      )

    } catch (error) {

      console.error(error)

      alert('Terjadi kesalahan')

    } finally {

      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-stone-50 min-h-screen text-stone-800" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* JUDUL */}
      <div className="mb-5 border-b border-stone-200 pb-3">
        <h1 className="text-lg font-bold tracking-tight text-stone-900">
          {isEditMode
            ? `Add / Edit Product: [${productName || 'Product Name'}]`
            : 'Add / Edit Product: [Product Name]'
          }
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >

        {/* KOLOM KIRI */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* PRODUCT DETAILS */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm relative">

            <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-stone-500 border border-stone-200 rounded">
              Product Details
            </span>

            <div className="flex flex-col gap-4 mt-2">

              {/* PRODUCT NAME */}
              <div className="flex flex-col gap-1">

                <label className="text-xs font-semibold text-stone-600">
                  Product Name
                </label>

                <input
                  type="text"
                  value={productName}
                  onChange={(e) =>
                    setProductName(e.target.value)
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="Masukkan nama produk..."
                  required
                />
              </div>

              {/* SKU */}
              <div className="flex flex-col gap-1">

                <label className="text-xs font-semibold text-stone-600">
                  SKU (Stock Keeping Unit)
                </label>

                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-semibold focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="Contoh: 1000001"
                  required
                />
              </div>

              {/* CATEGORY & BRAND */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* CATEGORY */}
                <div className="flex flex-col gap-1">

                  <label className="text-xs font-semibold text-stone-600">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(Number(e.target.value))
                    }
                    className="w-full h-24 p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-stone-400 overflow-y-auto"
                  >
                    <option value={1}>Ultrabook</option>
                    <option value={2}>Mouse</option>
                    <option value={3}>Keyboard</option>
                    <option value={4}>Aksesoris</option>
                  </select>
                </div>

                {/* BRAND */}
                <div className="flex flex-col gap-1">

                  <label className="text-xs font-semibold text-stone-600">
                    Brand
                  </label>

                  <div className="relative">

                    <select
                      value={brand}
                      onChange={(e) =>
                        setBrand(Number(e.target.value))
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold appearance-none focus:outline-none focus:border-stone-400"
                    >
                      <option value={1}>ASUS</option>
                      <option value={2}>Logitech</option>
                      <option value={3}>Keychron</option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm relative">

            <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-stone-500 border border-stone-200 rounded">
              Product Description
            </span>

            <div className="mt-2 border border-stone-200 rounded-lg overflow-hidden bg-stone-50">

              <div className="flex items-center gap-1 p-1.5 bg-stone-200/60 border-b border-stone-200">

                <button type="button" className="p-1 rounded hover:bg-stone-300 text-stone-700">
                  <Bold size={14} />
                </button>

                <button type="button" className="p-1 rounded hover:bg-stone-300 text-stone-700">
                  <Italic size={14} />
                </button>

                <div className="w-px h-4 bg-stone-300 mx-1"></div>

                <button type="button" className="p-1 rounded hover:bg-stone-300 text-stone-700">
                  <List size={14} />
                </button>

                <button type="button" className="p-1 rounded hover:bg-stone-300 text-stone-700">
                  <ListOrdered size={14} />
                </button>

              </div>

              <textarea
                rows={6}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="w-full p-3 bg-white text-xs font-medium focus:outline-none resize-none leading-relaxed text-stone-800"
                placeholder="Tulis deskripsi lengkap produk di sini..."
              />
            </div>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="flex flex-col gap-5">

          {/* MEDIA */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm relative">

            <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-stone-500 border border-stone-200 rounded">
              Media
            </span>

            <label className="mt-2 border-2 border-dashed border-stone-200 hover:border-stone-400 bg-stone-50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              {
                previewImage ? (
                  <div className="relative w-full">

                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setImage(null)
                        setPreviewImage('')
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>

                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 group-hover:bg-stone-300 transition-colors">
                      <Upload size={16} />
                    </div>

                    <p className="text-xs font-bold text-stone-800">
                      Upload Images
                    </p>

                    <p className="text-[10px] text-stone-400 font-medium">
                      (Max 5 MB)
                    </p>
                  </>
                )
              }

            </label>
          </div>

          {/* INVENTORY */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm relative">

            <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-stone-500 border border-stone-200 rounded">
              Inventory & Pricing
            </span>

            <div className="flex flex-col gap-3 mt-2">

              <div className="flex flex-col gap-1">

                <label className="text-xs font-semibold text-stone-600">
                  Price (Rp)
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div className="flex flex-col gap-1">

                <label className="text-xs font-semibold text-stone-600">
                  Quantity in Stock
                </label>

                <input
                  type="number"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>
          </div>

          {/* SHIPPING */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm relative">

            <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-stone-500 border border-stone-200 rounded">
              Shipping
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">

              <div className="flex flex-col gap-1">

                <label className="text-[10px] font-semibold text-stone-500">
                  Weight (kg)
                </label>

                <input
                  type="text"
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value)
                  }
                  className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">

                <label className="text-[10px] font-semibold text-stone-500">
                  Dimensions
                </label>

                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) =>
                    setDimensions(e.target.value)
                  }
                  className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-4">

            <div className="flex items-center gap-4 text-xs font-semibold text-stone-700">

              <span className="text-stone-500">
                Status
              </span>

              <label className="flex items-center gap-1.5 cursor-pointer">

                <input
                  type="radio"
                  checked={status === 'Active'}
                  onChange={() =>
                    setStatus('Active')
                  }
                />

                Active
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">

                <input
                  type="radio"
                  checked={status === 'Inactive'}
                  onChange={() =>
                    setStatus('Inactive')
                  }
                />

                Inactive
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">

                <input
                  type="radio"
                  checked={status === 'Draft'}
                  onChange={() =>
                    setStatus('Draft')
                  }
                />

                Draft
              </label>
            </div>

            {/* BUTTON */}
            <div className="flex items-center justify-end gap-2 border-t border-stone-100 pt-3">

              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-1.5 text-xs font-bold border border-stone-300 rounded bg-white text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 text-xs font-bold border border-stone-800 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-50"
              >
                {
                  loading
                    ? 'Saving...'
                    : 'Save Product'
                }
              </button>

            </div>
          </div>
        </div>
      </form>
    </div>
  )
}