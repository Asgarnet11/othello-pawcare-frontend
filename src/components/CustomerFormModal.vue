<template>
  <v-dialog :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)" max-width="500px"
    persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="formData.fullName" label="Nama Lengkap" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="formData.phone" label="No. Telepon" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="formData.email" label="Email" type="email" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="formData.address" label="Alamat" variant="outlined" rows="3"></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="close">Batal</v-btn>
        <v-btn color="blue-darken-1" variant="flat" @click="save">Simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCustomerStore } from '@/stores/customer';

const props = defineProps({
  modelValue: Boolean,
  customer: Object, // Menerima data customer untuk mode edit
});
const emit = defineEmits(['update:modelValue', 'saved']);

const customerStore = useCustomerStore();
const formData = ref({});

const formTitle = computed(() => {
  return props.customer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru';
});

// Awasi perubahan pada prop 'customer'. Jika ada, isi form (mode edit). Jika tidak, kosongkan (mode create).
watch(() => props.customer, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal };
  } else {
    formData.value = { fullName: '', phone: '', email: '', address: '' };
  }
});

const close = () => {
  emit('update:modelValue', false);
};

const save = async () => {
  let success = false;
  if (props.customer) { // Mode Edit
    success = await customerStore.updateCustomer(props.customer.id, formData.value);
  } else { // Mode Create
    success = await customerStore.createCustomer(formData.value);
  }

  if (success) {
    emit('saved'); // Kirim event bahwa data berhasil disimpan
    close();
  }
};
</script>
