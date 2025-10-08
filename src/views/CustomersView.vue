<template>
  <div>
    <CustomerFormModal v-model="dialog" :customer="editedItem" @saved="handleSave" />

    <v-card elevation="3">
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h5">Manajemen Pelanggan</span>
        <v-spacer></v-spacer>

        <v-text-field v-model="search" label="Cari Pelanggan (Nama, Telepon, Email)..." prepend-inner-icon="mdi-magnify"
          variant="outlined" density="compact" hide-details single-line style="max-width: 350px;"></v-text-field>

        <v-btn v-if="authStore.userRole === 'ADMIN'" class="ml-4" color="primary" @click="openCreateDialog"
          prepend-icon="mdi-plus-circle">
          Tambah Pelanggan
        </v-btn>
      </v-card-title>

      <v-data-table-server v-model:items-per-page="options.itemsPerPage" :headers="headers"
        :items="customerStore.customers" :items-length="customerStore.totalCustomers" :loading="customerStore.loading"
        :search="search" @update:options="loadItems">
        <template #item.pets="{ item }">
          {{ item.raw._count.pets }}
        </template>

        <template #item.actions="{ item }">
          <div v-if="authStore.userRole === 'ADMIN'">
            <v-icon size="small" class="me-2" @click="openEditDialog(item.raw)">mdi-pencil</v-icon>
            <v-icon size="small" @click="deleteItem(item.raw)">mdi-delete</v-icon>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import { useAuthStore } from '@/stores/auth';
import CustomerFormModal from '@/components/CustomerFormModal.vue';

const customerStore = useCustomerStore();
const authStore = useAuthStore();

const dialog = ref(false);
const editedItem = ref(null);
const search = ref('');
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
});

const headers = ref([
  { title: 'Nama Lengkap', key: 'fullName', align: 'start' },
  { title: 'No. Telepon', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Jumlah Hewan', key: 'pets', sortable: false },
  { title: 'Aksi', key: 'actions', sortable: false, align: 'end' },
]);

/** Fungsi untuk me-refresh data tabel */
const refreshTable = () => {
  customerStore.fetchCustomers({ ...options.value, search: search.value });
};

/** Fungsi yang dipanggil oleh data table saat ada perubahan (halaman, sort, dll) */
const loadItems = (newOptions) => {
  options.value = newOptions;
  refreshTable();
};

/** Tonton perubahan pada input search dengan debounce untuk efisiensi */
let searchTimeout = null;
watch(search, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    options.value.page = 1; // Kembali ke halaman pertama saat search
    refreshTable();
  }, 500); // Tunggu 500ms setelah user berhenti mengetik
});

/** Buka modal dalam mode 'create' */
const openCreateDialog = () => {
  editedItem.value = null;
  dialog.value = true;
};

/** Buka modal dalam mode 'edit' */
const openEditDialog = (item) => {
  editedItem.value = { ...item };
  dialog.value = true;
};

/** Handler setelah data di modal disimpan, lalu refresh tabel */
const handleSave = () => {
  refreshTable();
};

/** Placeholder untuk fungsi delete */
const deleteItem = (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus pelanggan "${item.fullName}"?`)) {
    console.log('Delete:', item);
    // Di sini Anda akan memanggil aksi `deleteCustomer` dari store
  }
};
</script>
