import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (to, from, next) => {
        if (useAuthStore().isAuthenticated) {
          next('/dashboard')
        } else {
          next()
        }
      },
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { roles: ['ADMIN', 'DOCTOR', 'GROOMER'] },
        },
        {
          path: 'calendar',
          name: 'calendar',
          component: () => import('../views/CalendarView.vue'),
          meta: { roles: ['ADMIN', 'DOCTOR', 'GROOMER'] },
        },
        {
          path: 'customers',
          name: 'customers',
          component: () => import('../views/CustomersView.vue'),
          meta: { roles: ['ADMIN'] },
        },
        {
          path: '',
          redirect: '/dashboard',
        },
      ],
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('../views/NotFoundView.vue'),
    // },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const allowedRoles = to.meta.roles

  // 1. Cek apakah rute butuh login
  if (requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login' })
  }

  if (requiresAuth && allowedRoles && !allowedRoles.includes(auth.userRole)) {
    alert('Anda tidak memiliki izin untuk mengakses halaman ini.')
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
