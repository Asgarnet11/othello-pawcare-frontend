import { defineStore } from 'pinia'
import axios from 'axios'
const API_URL = 'http://localhost:3001/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    staff: [], // Untuk menyimpan dokter & groomer
    loading: false,
  }),
  actions: {
    async fetchStaff() {
      this.loading = true
      try {
        // Asumsi kita perlu endpoint baru untuk mengambil staf, mari kita buat di backend nanti
        // Untuk sekarang, kita buat data dummy
        const response = await axios.get(`${API_URL}/users?role=DOCTOR&role=GROOMER`)
        this.staff = response.data
      } catch (error) {
        console.error('Failed to fetch staff:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
