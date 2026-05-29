import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards/auth.guard.js'

import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import doctorRoutes from './routes/doctor.routes.js'
import patientRoutes from './routes/patient.routes.js'

const routes = [
  ...authRoutes,
  ...adminRoutes,
  ...doctorRoutes,
  ...patientRoutes,

  { path: '/', redirect: '/login' },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global Guard ni qo‘shamiz
router.beforeEach(authGuard)

export default router