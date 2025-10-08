<template>
  <v-dialog :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)" max-width="750px"
    persistent transition="dialog-bottom-transition">
    <v-card class="appointment-form-card">
      <v-card-title class="d-flex align-center pa-6 card-header">
        <v-icon class="mr-3" color="primary" size="28">mdi-calendar-plus</v-icon>
        <span class="text-h5 font-weight-medium">Buat Janji Temu Baru</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="formRef">
          <!-- Customer Selection -->
          <div class="form-section">
            <div class="section-label mb-3">
              <v-icon size="20" color="primary" class="mr-2">mdi-account</v-icon>
              <span class="font-weight-medium">Informasi Pelanggan</span>
            </div>
            <v-autocomplete v-model="formData.customerId" :items="customerStore.customers" item-title="fullName"
              item-value="id" label="Pilih Pelanggan" variant="outlined" prepend-inner-icon="mdi-account-search"
              :loading="customerStore.loading" @update:model-value="handleCustomerChange" class="mb-4" clearable>
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps">
                  <template #prepend>
                    <v-avatar color="primary" size="40">
                      <span class="text-caption">{{ getInitials(item.raw.fullName) }}</span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </div>

          <!-- Staff Selection -->
          <div class="form-section">
            <div class="section-label mb-3">
              <v-icon size="20" color="success" class="mr-2">mdi-account-tie</v-icon>
              <span class="font-weight-medium">Penugasan Staf</span>
            </div>
            <v-autocomplete v-model="formData.assigneeId" :items="userStore.staff" item-title="name" item-value="id"
              label="Pilih Staf (Dokter/Groomer)" variant="outlined" prepend-inner-icon="mdi-doctor"
              :loading="userStore.loading" class="mb-4" clearable>
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps">
                  <template #prepend>
                    <v-avatar color="success" size="40">
                      <span class="text-caption">{{ getInitials(item.raw.name) }}</span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </div>

          <!-- Services Section -->
          <div class="form-section services-section">
            <div class="d-flex justify-space-between align-center mb-3">
              <div class="section-label">
                <v-icon size="20" color="info" class="mr-2">mdi-medical-bag</v-icon>
                <span class="font-weight-medium">Layanan yang Dipesan</span>
              </div>
              <v-chip size="small" color="primary" variant="tonal">
                {{ formData.services.length }} Layanan
              </v-chip>
            </div>

            <v-divider class="mb-4"></v-divider>

            <v-expand-transition group>
              <v-card v-for="(item, index) in formData.services" :key="`service-${index}`" variant="outlined"
                class="service-item mb-3">
                <v-card-text class="pa-4">
                  <v-row align="center">
                    <v-col cols="12" sm="5">
                      <v-select v-model="item.petId" :items="customerStore.pets" item-title="name" item-value="id"
                        label="Pilih Hewan" variant="outlined" density="comfortable" prepend-inner-icon="mdi-paw"
                        :disabled="!formData.customerId" :loading="customerStore.loadingPets" hide-details>
                        <template #item="{ props: itemProps }">
                          <v-list-item v-bind="itemProps">
                            <template #prepend>
                              <v-icon color="warning">mdi-paw</v-icon>
                            </template>
                          </v-list-item>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete v-model="item.serviceId" :items="serviceStore.services" item-title="name"
                        item-value="id" label="Pilih Layanan" variant="outlined" density="comfortable"
                        prepend-inner-icon="mdi-medical-bag" :loading="serviceStore.loading" hide-details>
                        <template #item="{ props: itemProps, item: serviceItem }">
                          <v-list-item v-bind="itemProps">
                            <template #append>
                              <v-chip size="x-small" color="success" variant="tonal">
                                {{ formatPrice(serviceItem.raw.price) }}
                              </v-chip>
                            </template>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="1" class="d-flex justify-center">
                      <v-btn icon="mdi-delete" variant="text" color="error" size="small" class="delete-btn"
                        :disabled="formData.services.length === 1" @click="removeService(index)">
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-expand-transition>

            <v-btn prepend-icon="mdi-plus" variant="tonal" color="primary" class="text-none add-service-btn" block
              @click="addService">
              Tambah Layanan
            </v-btn>
          </div>

          <!-- Time Display -->
          <v-alert v-if="formData.startTime" type="info" variant="tonal" class="mt-6" border="start" prominent>
            <template #prepend>
              <v-icon size="28">mdi-clock-outline</v-icon>
            </template>
            <div class="d-flex flex-column">
              <span class="font-weight-medium mb-1">Waktu Janji Temu</span>
              <span class="text-h6">{{ formatDateTime(formData.startTime) }}</span>
            </div>
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-6 card-actions">
        <v-spacer></v-spacer>
        <v-btn variant="text" class="text-none" @click="close">
          Batal
        </v-btn>
        <v-btn color="primary" variant="flat" class="text-none" prepend-icon="mdi-content-save" elevation="0"
          :loading="appointmentStore.loading" :disabled="!isFormValid" @click="submit">
          Simpan Janji Temu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import { useUserStore } from '@/stores/user';
import { useServiceStore } from '@/stores/service';
import { useAppointmentStore } from '@/stores/appointment';

const props = defineProps({
  modelValue: Boolean,
  startTime: Date,
});

const emit = defineEmits(['update:modelValue', 'appointment-created']);

const customerStore = useCustomerStore();
const userStore = useUserStore();
const serviceStore = useServiceStore();
const appointmentStore = useAppointmentStore();

const formRef = ref(null);
const formData = ref({
  customerId: null,
  assigneeId: null,
  startTime: null,
  services: [],
});

// Computed untuk validasi form
const isFormValid = computed(() => {
  return (
    formData.value.customerId &&
    formData.value.assigneeId &&
    formData.value.services.some(s => s.petId && s.serviceId)
  );
});

// Fungsi untuk menambah baris layanan baru
const addService = () => {
  formData.value.services.push({ petId: null, serviceId: null });
};

// Fungsi untuk menghapus baris layanan
const removeService = (index) => {
  if (formData.value.services.length > 1) {
    formData.value.services.splice(index, 1);
  }
};

// Fungsi yang dipanggil saat pelanggan diganti
const handleCustomerChange = (customerId) => {
  // Reset services saat customer berubah
  formData.value.services = [{ petId: null, serviceId: null }];

  if (customerId) {
    customerStore.fetchPetsForCustomer(customerId);
  }
};

// Reset form saat modal dibuka/tutup
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    formData.value.startTime = props.startTime;
    formData.value.customerId = null;
    formData.value.assigneeId = null;
    formData.value.services = [{ petId: null, serviceId: null }];
  }
});

// Load data saat komponen dimount
onMounted(() => {
  customerStore.fetchCustomers();
  userStore.fetchStaff();
  serviceStore.fetchServices();
});

// Helper functions
const getInitials = (name) => {
  if (!name) return '?';
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

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

const formatPrice = (price) => {
  if (!price) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const close = () => {
  emit('update:modelValue', false);
};

const submit = async () => {
  // Filter layanan yang valid
  const validServices = formData.value.services.filter(s => s.petId && s.serviceId);

  if (validServices.length === 0) {
    alert('Silakan pilih minimal satu hewan dan layanan.');
    return;
  }

  const dataToSubmit = {
    ...formData.value,
    services: validServices
  };

  const success = await appointmentStore.createAppointment(dataToSubmit);

  if (success) {
    emit('appointment-created');
  }
};
</script>

<style scoped>
.appointment-form-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.form-section {
  margin-bottom: 24px;
}

.section-label {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.95rem;
}

.services-section {
  background-color: #fafafa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 8px;
}

.service-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: white;
}

.service-item:hover {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.1);
  transform: translateY(-1px);
}

.delete-btn {
  transition: all 0.2s ease;
}

.delete-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

.add-service-btn {
  margin-top: 8px;
  transition: all 0.2s ease;
}

.add-service-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.card-actions {
  background-color: #fafafa;
}

:deep(.v-autocomplete .v-field) {
  transition: all 0.2s ease;
}

:deep(.v-autocomplete .v-field--focused) {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.1);
}

:deep(.v-select .v-field) {
  transition: all 0.2s ease;
}

:deep(.v-select .v-field--focused) {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.1);
}

:deep(.v-avatar) {
  transition: all 0.2s ease;
}

:deep(.v-list-item:hover .v-avatar) {
  transform: scale(1.05);
}

:deep(.v-alert) {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

:deep(.v-btn) {
  transition: all 0.2s ease;
}

:deep(.v-btn:not(:disabled):hover) {
  transform: translateY(-1px);
}
</style>
