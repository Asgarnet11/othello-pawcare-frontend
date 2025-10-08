<template>
  <div class="calendar-container">
    <AppointmentFormModal v-model="isCreateModalOpen" :start-time="selectedDate"
      @appointment-created="handleAppointmentCreated" />

    <AppointmentDetailModal v-model="isDetailModalOpen" :appointment-id="selectedAppointmentId" />

    <v-card elevation="2" class="calendar-card">
      <v-card-title class="d-flex align-center justify-space-between pa-6 card-header">
        <div class="d-flex align-center">
          <v-icon class="mr-3" color="primary" size="28">mdi-calendar-month</v-icon>
          <span class="text-h5 font-weight-medium">Kalender Penjadwalan</span>
        </div>
        <v-fade-transition>
          <v-progress-circular v-if="appointmentStore.loading" indeterminate color="primary" size="24" width="3">
          </v-progress-circular>
        </v-fade-transition>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <div class="calendar-wrapper">
          <FullCalendar :options="calendarOptions" />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAppointmentStore } from '@/stores/appointment';
import AppointmentFormModal from '@/components/AppointmentFormModal.vue';
import AppointmentDetailModal from '@/components/AppointmentDetailModal.vue';

const appointmentStore = useAppointmentStore();

// State untuk mengontrol modal create
const isCreateModalOpen = ref(false);
const selectedDate = ref(null);

// State untuk mengontrol modal detail
const isDetailModalOpen = ref(false);
const selectedAppointmentId = ref(null);

/** Handler saat appointment berhasil dibuat */
const handleAppointmentCreated = () => {
  isCreateModalOpen.value = false;
  // Refresh events jika diperlukan
  if (appointmentStore.refreshCurrentView) {
    appointmentStore.refreshCurrentView();
  }
};

/** Handler saat slot kosong diklik */
const handleDateClick = (clickInfo) => {
  selectedDate.value = clickInfo.date;
  isCreateModalOpen.value = true;
};

/** Handler saat event yang ada diklik */
const handleEventClick = (clickInfo) => {
  selectedAppointmentId.value = clickInfo.event.id;
  isDetailModalOpen.value = true;
};

/** Handler saat kalender berpindah rentang tanggal */
const handleDatesSet = (dateInfo) => {
  appointmentStore.fetchAppointments(dateInfo.start, dateInfo.end);
};

// Konfigurasi lengkap untuk FullCalendar
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  initialView: 'timeGridWeek',
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  locale: 'id',
  buttonText: {
    today: 'Hari Ini',
    month: 'Bulan',
    week: 'Minggu',
    day: 'Hari',
  },
  slotMinTime: '08:00:00',
  slotMaxTime: '20:00:00',
  allDaySlot: false,
  events: appointmentStore.events || [],

  // Event Handlers
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  datesSet: handleDatesSet,

  // Styling
  eventDisplay: 'block',
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
}));

// Load initial data
onMounted(() => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  appointmentStore.fetchAppointments(startOfWeek, endOfWeek);
});
</script>

<style scoped>
.calendar-container {
  width: 100%;
  height: 100%;
}

.calendar-card {
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.calendar-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.calendar-wrapper {
  background: white;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
}

:deep(.fc) {
  font-family: 'Roboto', sans-serif;
}

:deep(.fc .fc-button-primary) {
  background-color: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
  text-transform: capitalize;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: none;
}

:deep(.fc .fc-button-primary:hover) {
  background-color: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}

:deep(.fc .fc-button-primary:not(:disabled):active),
:deep(.fc .fc-button-primary:not(:disabled).fc-button-active) {
  background-color: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
  opacity: 1;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.fc .fc-button-primary:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.fc-theme-standard .fc-scrollgrid) {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

:deep(.fc .fc-col-header-cell) {
  background-color: #f5f5f5;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  padding: 12px 4px;
  border-color: #e0e0e0;
}

:deep(.fc .fc-daygrid-day-number) {
  padding: 8px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}

:deep(.fc .fc-daygrid-day.fc-day-today) {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

:deep(.fc .fc-timegrid-slot) {
  height: 3em;
}

:deep(.fc-event) {
  border-radius: 4px;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.fc-event:hover) {
  opacity: 0.9;
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:deep(.fc .fc-toolbar-title) {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

:deep(.fc-daygrid-event-harness) {
  margin: 2px 0;
}

:deep(.fc .fc-timegrid-axis) {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.875rem;
}

:deep(.fc .fc-timegrid-slot-label) {
  border-color: #e0e0e0;
}

:deep(.fc-timegrid-event) {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

:deep(.fc-direction-ltr .fc-timegrid-slot-label-frame) {
  text-align: center;
}

:deep(.fc .fc-button-group) {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  overflow: hidden;
}
</style>
