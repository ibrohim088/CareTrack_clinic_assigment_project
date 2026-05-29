import { useAuthStore } from '../../stores/auth.store.js'

export const authGuard = async (to, from, next) => {
  const authStore = useAuthStore()

  // Guest routes (login va register)
  if (to.meta.guest) {
    if (authStore.isAuthenticated) {
      if (!authStore.user) await authStore.fetchMe()
      const role = authStore.user?.role
      return next(role ? `/${role}/dashboard` : '/login')
    }
    return next()
  }

  // Himoyalangan marshrutlar
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next('/login')
    }

    if (!authStore.user) {
      await authStore.fetchMe()
    }

    const userRole = authStore.user?.role

    // Agar rol mos kelmasa, foydalanuvchini o‘z rolidagi dashboardga yo‘naltir
    if (to.meta.role && to.meta.role !== userRole) {
      return next(`/${userRole}/dashboard`)
    }

    return next()
  }

  next()
}