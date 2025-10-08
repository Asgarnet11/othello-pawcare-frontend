import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    /** @type {any[]} */
    appointments: [],
    /** @type {any|null} */
    selectedAppointment: null,
    loading: false,
    // Menyimpan rentang tanggal kalender saat ini untuk refresh
    currentDateRange: { start: new Date(), end: new Date() },
  }),

  getters: {
    /** Mengubah data appointment dari API menjadi format event untuk FullCalendar. */
    events: (state) => {
      return state.appointments.map((appt) => ({
        id: appt.id,
        title: `${appt.customer.fullName} (${appt.assignee.name})`,
        start: appt.startTime,
        end: appt.endTime,
        // Properti tambahan untuk digunakan saat event diklik
        extendedProps: {
          customer: appt.customer,
          assignee: appt.assignee,
          status: appt.status,
        },
        // Beri warna berdasarkan status
        color: state.getStatusColor(appt.status),
      }))
    },
  },

  actions: {
    /** Memberi warna pada event kalender berdasarkan statusnya. */
    getStatusColor(status) {
      if (status === 'COMPLETED') return '#4CAF50' // Hijau
      if (status === 'CANCELED') return '#F44336' // Merah
      if (status === 'SCHEDULED') return '#2196F3' // Biru
      return '#9E9E9E' // Abu-abu
    },

    /** Menyimpan rentang tanggal yang sedang dilihat di kalender. */
    setCurrentDateRange(start, end) {
      this.currentDateRange = { start, end }
    },

    /** Mengambil data janji temu dari backend untuk rentang tanggal tertentu. */
    async fetchAppointments(start, end) {
      this.loading = true
      this.setCurrentDateRange(start, end)
      try {
        const response = await axios.get(`${API_URL}/appointments`, {
          params: { from: start.toISOString(), to: end.toISOString() },
        })
        this.appointments = response.data
      } catch (error) {
        console.error('Failed to fetch appointments:', error)
        this.appointments = []
      } finally {
        this.loading = false
      }
    },

    /** Mengambil detail satu janji temu berdasarkan ID. */
    async fetchAppointmentById(id) {
      this.loading = true
      this.selectedAppointment = null
      try {
        // Asumsi backend punya endpoint GET /api/appointments/:id
        const response = await axios.get(`${API_URL}/appointments/${id}`)
        this.selectedAppointment = response.data
      } catch (error) {
        console.error('Failed to fetch appointment details:', error)
      } finally {
        this.loading = false
      }
    },

    /** Membuat janji temu baru. */
    async createAppointment(appointmentData) {
      this.loading = true
      try {
        await axios.post(`${API_URL}/appointments`, appointmentData)
        // Setelah berhasil, refresh data di kalender
        await this.fetchAppointments(this.currentDateRange.start, this.currentDateRange.end)
        return true
      } catch (error) {
        console.error('Failed to create appointment:', error)
        alert(error.response?.data?.message || 'Gagal membuat janji temu.')
        return false
      } finally {
        this.loading = false
      }
    },

    /** Membatalkan janji temu. */
    async cancelAppointment(id) {
      this.loading = true
      try {
        // Asumsi backend punya endpoint PATCH /api/appointments/:id
        await axios.patch(`${API_URL}/appointments/${id}`, { status: 'CANCELED' })
        // Refresh data di kalender
        await this.fetchAppointments(this.currentDateRange.start, this.currentDateRange.end)
        return true
      } catch (error) {
        console.error('Failed to cancel appointment:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    /** Membersihkan state appointment yang dipilih. */
    clearSelectedAppointment() {
      this.selectedAppointment = null
    },
  },
})
