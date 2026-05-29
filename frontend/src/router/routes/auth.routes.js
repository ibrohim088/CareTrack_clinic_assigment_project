import LoginView from '../../views/auth/LoginView.vue'
import RegisterView from '../../views/auth/RegisterView.vue'
import ForgotPass from '../../views/auth/ForgotPassword.vue'

export default [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { guest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPass,
    meta: { guest: true }
  },
]