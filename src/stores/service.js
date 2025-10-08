import { defineStore } from 'pinia'
import axios from 'axios'
const API_URL = 'http://localhost:3001/api'

export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],
    loading: false,
  }),
  actions: {
    async fetchServices() {
      if (this.services.length > 0) return
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/services`)
        this.services = response.data
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
