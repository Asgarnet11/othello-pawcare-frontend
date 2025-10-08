<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" class="app-drawer" elevation="1" width="280">
      <!-- Drawer Header -->
      <div class="drawer-header pa-6">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="48" class="mr-3">
            <v-icon color="white" size="28">mdi-hospital-box</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold">PetCare Clinic</div>
            <div class="text-caption text-grey">Sistem Manajemen</div>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <!-- User Profile Section -->
      <div v-if="auth.user" class="user-profile pa-4">
        <div class="d-flex align-center">
          <v-avatar color="success" size="40" class="mr-3">
            <span class="text-body-1 font-weight-medium">
              {{ getUserInitials(auth.user.name) }}
            </span>
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-body-2 font-weight-medium text-truncate">
              {{ auth.user.name || 'User' }}
            </div>
            <v-chip size="x-small" :color="getRoleColor(auth.userRole)" variant="tonal" class="mt-1">
              {{ getRoleLabel(auth.userRole) }}
            </v-chip>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <!-- Navigation Menu -->
      <v-list density="comfortable" nav class="navigation-menu pa-2">
        <v-list-item v-for="item in visibleMenuItems" :key="item.to" :prepend-icon="item.icon" :title="item.title"
          :to="item.to" rounded="lg" class="mb-1 menu-item">
        </v-list-item>
      </v-list>

      <!-- Drawer Footer -->
      <template #append>
        <div class="pa-4">
          <v-divider class="mb-4"></v-divider>

          <v-list density="comfortable" nav>
            <v-list-item prepend-icon="mdi-cog" title="Pengaturan" to="/settings" rounded="lg" class="menu-item mb-2">
            </v-list-item>

            <v-list-item prepend-icon="mdi-logout" title="Keluar" rounded="lg" class="menu-item logout-item"
              @click="handleLogout">
            </v-list-item>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar elevation="1" class="app-bar">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="font-weight-medium">
        {{ currentPageTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Notifications Icon -->
      <v-btn icon variant="text">
        <v-badge color="error" content="3" offset-x="5" offset-y="5">
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>

      <!-- User Menu -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon variant="text">
            <v-avatar color="primary" size="36">
              <span class="text-caption">{{ getUserInitials(auth.user?.name) }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title class="font-weight-medium">
              {{ auth.user?.name || 'User' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ auth.user?.email || '' }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item prepend-icon="mdi-account" title="Profil" to="/profile">
          </v-list-item>
          <v-list-item prepend-icon="mdi-cog" title="Pengaturan" to="/settings">
          </v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item prepend-icon="mdi-logout" title="Keluar" @click="handleLogout">
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="app-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const route = useRoute();
const drawer = ref(true);

// Definisi menu items dengan roles
const menuItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/dashboard',
    roles: ['ADMIN', 'DOCTOR', 'GROOMER']
  },
  {
    title: 'Kalender',
    icon: 'mdi-calendar-month',
    to: '/calendar',
    roles: ['ADMIN', 'DOCTOR', 'GROOMER']
  },
  {
    title: 'Pelanggan',
    icon: 'mdi-account-group',
    to: '/customers',
    roles: ['ADMIN']
  },
  {
    title: 'Layanan',
    icon: 'mdi-medical-bag',
    to: '/services',
    roles: ['ADMIN']
  },
  {
    title: 'Staf',
    icon: 'mdi-account-tie',
    to: '/staff',
    roles: ['ADMIN']
  },
  {
    title: 'Laporan',
    icon: 'mdi-chart-box',
    to: '/reports',
    roles: ['ADMIN']
  },
];

// Filter menu berdasarkan role
const visibleMenuItems = computed(() => {
  if (!auth.userRole) return [];
  return menuItems.filter(item => item.roles.includes(auth.userRole));
});

// Get current page title
const currentPageTitle = computed(() => {
  const currentItem = menuItems.find(item => item.to === route.path);
  return currentItem?.title || 'PetCare Clinic';
});

// Helper functions
const getUserInitials = (name) => {
  if (!name) return '?';
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const getRoleLabel = (role) => {
  const labels = {
    ADMIN: 'Administrator',
    DOCTOR: 'Dokter',
    GROOMER: 'Groomer',
  };
  return labels[role] || role;
};

const getRoleColor = (role) => {
  const colors = {
    ADMIN: 'error',
    DOCTOR: 'primary',
    GROOMER: 'success',
  };
  return colors[role] || 'grey';
};

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    auth.logout();
  }
};
</script>

<style scoped>
.app-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.drawer-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(255, 255, 255, 0) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.drawer-header .v-avatar {
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.2);
}

.user-profile {
  background-color: #fafafa;
}

.navigation-menu {
  flex: 1;
  overflow-y: auto;
}

.menu-item {
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.menu-item:hover {
  transform: translateX(4px);
}

.menu-item :deep(.v-list-item__prepend) {
  transition: all 0.2s ease;
}

.menu-item:hover :deep(.v-list-item__prepend) {
  transform: scale(1.1);
}

.menu-item :deep(.v-list-item--active) {
  background: linear-gradient(90deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.logout-item {
  color: rgb(var(--v-theme-error));
}

.logout-item:hover {
  background-color: rgba(var(--v-theme-error), 0.05);
}

.app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.app-main {
  background-color: #f5f5f5;
}

:deep(.v-badge__badge) {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

:deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}

:deep(.v-avatar) {
  transition: all 0.2s ease;
}

:deep(.v-avatar:hover) {
  transform: scale(1.05);
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
