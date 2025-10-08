import { defineStore } from 'pinia'
import axios from 'axios'
const API_URL = 'http://localhost:3001/api'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    pets: [],
    totalCustomers: 0,
    loading: false,
  }),

  actions: {
    async fetchCustomers(options) {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/customers`, { params: options })
        this.customers = response.data.items
        this.totalCustomers = response.data.total
      } catch (error) {
        console.error('Failed to fetch customers:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchPetsForCustomer(customerId) {
      if (!customerId) {
        this.pets = []
        return
      }
      try {
        const response = await axios.get(`${API_URL}/pets/customer/${customerId}`)
        this.pets = response.data
      } catch (error) {
        console.error('Failed to fetch pets:', error)
        this.pets = []
      }
    },
    async createCustomer(customerData) {
      try {
        await axios.post(`${API_URL}/customers`, customerData)
        return true
      } catch (error) {
        console.error('Failed to create customer:', error)
        alert(error.response?.data?.message || 'Gagal membuat pelanggan.')
        return false
      }
    },
    async updateCustomer(id, customerData) {
      try {
        await axios.put(`${API_URL}/customers/${id}`, customerData)
        return true
      } catch (error) {
        console.error('Failed to update customer:', error)
        alert(error.response?.data?.message || 'Gagal memperbarui pelanggan.')
        return false
      }
    },
  },
})
