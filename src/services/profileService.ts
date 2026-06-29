import axios from 'axios';

// Sesuaikan URL dengan port backend Express Anda
const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/profil`;

// Fungsi pembantu untuk mengambil token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const profileService = {
  // Ambil data profil dari backend
  getProfile: async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },

  // Kirim pembaruan data profil ke backend
  updateProfile: async (profileData: { nama: string; email: string; no_telepon: string; alamat: string }) => {
    const response = await axios.put(API_URL, profileData, getAuthHeader());
    return response.data;
  },
};