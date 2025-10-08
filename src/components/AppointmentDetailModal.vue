<template>
  <v-dialog :model-value="modelValue" @update:model-value="close" max-width="650px" persistent
    transition="dialog-bottom-transition">
    <v-card class="appointment-detail-card" :loading="appointmentStore.loading">
      <v-card-title class="d-flex justify-space-between align-center pa-6 card-header">
        <div class="d-flex align-center">
          <v-icon class="mr-3" color="primary" size="28">mdi-calendar-clock</v-icon>
          <span class="text-h5 font-weight-medium">Detail Janji Temu</span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" class="close-btn" @click="close">
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div v-if="appointmentStore.selectedAppointment" class="appointment-content">
        <v-card-text class="pa-6">
          <v-list lines="two" class="detail-list">
            <v-list-item class="px-0 mb-2">
              <template #prepend>
                <v-avatar color="primary" size="40">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium mb-1">Pelanggan</v-list-item-title>
              <v-list-item-subtitle class="text-body-2">
                {{ appointmentStore.selectedAppointment.customer?.fullName || '-' }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item class="px-0 mb-2">
              <template #prepend>
                <v-avatar color="success" size="40">
                  <v-icon color="white">mdi-account-tie</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium mb-1">Staf</v-list-item-title>
              <v-list-item-subtitle class="text-body-2">
                {{ appointmentStore.selectedAppointment.assignee?.name || '-' }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item class="px-0 mb-2">
              <template #prepend>
                <v-avatar color="info" size="40">
                  <v-icon color="white">mdi-clock-outline</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium mb-1">Waktu</v-list-item-title>
              <v-list-item-subtitle class="text-body-2">
                <div class="d-flex flex-column">
                  <span class="mb-1">
                    <v-icon size="14" class="mr-1">mdi-calendar-start</v-icon>
                    {{ formatDateTime(appointmentStore.selectedAppointment.startTime) }}
                  </span>
                  <span>
                    <v-icon size="14" class="mr-1">mdi-calendar-end</v-icon>
                    {{ formatDateTime(appointmentStore.selectedAppointment.endTime) }}
                  </span>
                </div>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item class="px-0 mb-2">
              <template #prepend>
                <v-avatar :color="getStatusAvatarColor(appointmentStore.selectedAppointment.status)" size="40">
                  <v-icon color="white">{{ getStatusIcon(appointmentStore.selectedAppointment.status) }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium mb-1">Status</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip size="small" :color="statusColor(appointmentStore.selectedAppointment.status)" variant="tonal"
                  class="font-weight-medium">
                  {{ getStatusText(appointmentStore.selectedAppointment.status) }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="appointmentStore.selectedAppointment.notes" class="px-0">
              <template #prepend>
                <v-avatar color="warning" size="40">
                  <v-icon color="white">mdi-note-text</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium mb-1">Catatan</v-list-item-title>
              <v-list-item-subtitle class="text-body-2">
                {{ appointmentStore.selectedAppointment.notes }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6 card-actions">
          <v-btn v-if="canCancel" color="error" variant="tonal" prepend-icon="mdi-cancel" class="text-none"
            @click="handleCancel">
            Batalkan Jadwal
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="close">
            Tutup
          </v-btn>
          <v-btn v-if="canEdit" color="primary" variant="flat" prepend-icon="mdi-pencil" class="text-none"
            elevation="0">
            Edit
          </v-btn>
        </v-card-actions>
      </div>

      <div v-else class="d-flex flex-column align-center justify-center py-16">
        <v-progress-circular indeterminate color="primary" size="48" width="4">
        </v-progress-circular>
        <p class="text-body-2 text-grey mt-4">Memuat detail...</p>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useAppointmentStore } from '@/stores/appointment';
import { watch, computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  appointmentId: String,
});

const emit = defineEmits(['update:modelValue']);
const appointmentStore = useAppointmentStore();

// Watch untuk fetch data saat modal dibuka
watch(
  () => [props.modelValue, props.appointmentId],
  ([isOpen, id]) => {
    if (isOpen && id) {
      appointmentStore.fetchAppointmentById(id);
    }
  },
  { immediate: true }
);

// Computed untuk validasi action buttons
const canCancel = computed(() => {
  const status = appointmentStore.selectedAppointment?.status;
  return status === 'SCHEDULED';
});

const canEdit = computed(() => {
  const status = appointmentStore.selectedAppointment?.status;
  return status === 'SCHEDULED' || status === 'CONFIRMED';
});

const close = () => {
  emit('update:modelValue', false);
  // Delay clear untuk smooth transition
  setTimeout(() => {
    appointmentStore.clearSelectedAppointment();
  }, 300);
};

const handleCancel = async () => {
  if (confirm('Apakah Anda yakin ingin membatalkan janji temu ini?')) {
    const success = await appointmentStore.cancelAppointment(props.appointmentId);
    if (success) {
      close();
    }
  }
};

// Helper functions
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const statusColor = (status) => {
  const colors = {
    COMPLETED: 'success',
    CANCELED: 'error',
    CANCELLED: 'error',
    SCHEDULED: 'primary',
    CONFIRMED: 'info',
    IN_PROGRESS: 'warning',
  };
  return colors[status] || 'grey';
};

const getStatusText = (status) => {
  const texts = {
    COMPLETED: 'Selesai',
    CANCELED: 'Dibatalkan',
    CANCELLED: 'Dibatalkan',
    SCHEDULED: 'Terjadwal',
    CONFIRMED: 'Dikonfirmasi',
    IN_PROGRESS: 'Berlangsung',
  };
  return texts[status] || status;
};

const getStatusIcon = (status) => {
  const icons = {
    COMPLETED: 'mdi-check-circle',
    CANCELED: 'mdi-close-circle',
    CANCELLED: 'mdi-close-circle',
    SCHEDULED: 'mdi-calendar-clock',
    CONFIRMED: 'mdi-calendar-check',
    IN_PROGRESS: 'mdi-progress-clock',
  };
  return icons[status] || 'mdi-information';
};

const getStatusAvatarColor = (status) => {
  const colors = {
    COMPLETED: 'success',
    CANCELED: 'error',
    CANCELLED: 'error',
    SCHEDULED: 'primary',
    CONFIRMED: 'info',
    IN_PROGRESS: 'warning',
  };
  return colors[status] || 'grey';
};
</script>

<style scoped>
.appointment-detail-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.close-btn {
  transition: all 0.2s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}

.appointment-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-list {
  background: transparent;
}

.detail-list :deep(.v-list-item) {
  padding: 12px 0;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.detail-list :deep(.v-list-item:hover) {
  background-color: rgba(var(--v-theme-primary), 0.02);
  padding-left: 8px;
  padding-right: 8px;
}

.detail-list :deep(.v-list-item__prepend) {
  margin-right: 16px;
}

.detail-list :deep(.v-avatar) {
  transition: all 0.2s ease;
}

.detail-list :deep(.v-list-item:hover .v-avatar) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detail-list :deep(.v-list-item-title) {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
}

.detail-list :deep(.v-list-item-subtitle) {
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.95rem;
  margin-top: 4px;
}

.card-actions {
  background-color: #fafafa;
}

.v-chip {
  font-size: 0.75rem;
  padding: 0 12px;
  height: 24px;
}

:deep(.v-progress-circular) {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}

:deep(.v-btn) {
  transition: all 0.2s ease;
}

:deep(.v-btn:hover) {
  transform: translateY(-1px);
}

:deep(.v-btn.text-none) {
  text-transform: none;
  letter-spacing: normal;
}
</style>
