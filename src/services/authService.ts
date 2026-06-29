// ==========================================
// INTERFACES & TYPES
// ==========================================

// Payload untuk data yang dikirim saat Register
export interface RegisterPayload {
  nama: string;
  username: string;
  email: string;
  password: string;
}

// ◄ BARU: Payload untuk data yang dikirim saat Login
export interface LoginPayload {
  email: string;
  password: string;
}

// ◄ BARU: Interface struktur data user yang dikembalikan backend saat login sukses
export interface UserData {
  id: number;
  nama: string;
  username: string;
  email: string;
}

// ◄ BARU: Interface khusus untuk isi data response login
export interface LoginResponseData {
  success: boolean;
  message: string;
  token: string;
  user: UserData;
}

// Interface global untuk standarisasi response API di frontend
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ==========================================
// API BASE URL CONFIGURATION
// ==========================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// ==========================================
// AUTH SERVICE OBJECT
// ==========================================
export const authService = {
  /**
   * Mengirim data pendaftaran akun pembeli baru ke backend Express.js
   * @param payload Data pendaftaran lengkap (nama, username, email, password)
   * @returns Promise berisikan struktur ApiResponse
   */
  register: async (payload: RegisterPayload): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mendaftarkan akun.');
      }

      return {
        success: true,
        message: result.message || 'Pendaftaran akun berhasil!',
        data: result.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Terjadi kesalahan jaringan atau server bermasalah.',
        error: error.toString(),
      };
    }
  },

  /**
   * ◄ BARU: Mengirim kredensial login ke backend Express.js
   * @param payload Data login (email dan password)
   * @returns Promise berisikan ApiResponse dengan data bertipe LoginResponseData
   */
  login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // Jika response gagal (400 atau 401 Unauthorized), lempar ke catch block
      if (!response.ok) {
        throw new Error(result.message || 'Gagal masuk ke akun.');
      }

      // Jika sukses, kembalikan data token dan info user
      return {
        success: true,
        message: result.message || 'Login berhasil!',
        data: result, // result di sini sudah mencakup { success, message, token, user } dari backend
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Terjadi kesalahan jaringan atau kredensial salah.',
        error: error.toString(),
      };
    }
  },
};