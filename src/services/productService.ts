const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/products`;

export const productService = {

    /*
    |--------------------------------------------------------------------------
    | GET ALL PRODUCTS
    |--------------------------------------------------------------------------
    */
    async getProducts() {

        const response = await fetch(API_URL)

        const result = await response.json()

        if (!response.ok) {

            throw new Error(
                result.message || 'Gagal mengambil produk'
            )
        }

        // Backend kamu:
        // {
        //   success: true,
        //   data: [...]
        // }

        return Array.isArray(result.data)
            ? result.data
            : []
    },

    /*
    |--------------------------------------------------------------------------
    | GET PRODUCT BY ID
    |--------------------------------------------------------------------------
    */
    async getProductById(id: number) {

        const response = await fetch(`${API_URL}/${id}`)

        const result = await response.json()

        if (!response.ok) {

            throw new Error(
                result.message || 'Gagal mengambil detail produk'
            )
        }

        return result.data
    },

    /*
    |--------------------------------------------------------------------------
    | CREATE PRODUCT
    |--------------------------------------------------------------------------
    */
    async createProduct(formData: FormData) {

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        })

        const result = await response.json()

        if (!response.ok) {

            throw new Error(
                result.message || 'Gagal menambahkan produk'
            )
        }

        return result
    },

    /*
    |--------------------------------------------------------------------------
    | UPDATE PRODUCT
    |--------------------------------------------------------------------------
    */
    async updateProduct(id: number, formData: FormData) {

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            body: formData
        })

        const result = await response.json()

        if (!response.ok) {

            throw new Error(
                result.message || 'Gagal update produk'
            )
        }

        return result
    },

    /*
    |--------------------------------------------------------------------------
    | DELETE PRODUCT
    |--------------------------------------------------------------------------
    */
    async deleteProduct(id: number) {

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })

        const result = await response.json()

        if (!response.ok) {

            throw new Error(
                result.message || 'Gagal menghapus produk'
            )
        }

        return result
    }
}