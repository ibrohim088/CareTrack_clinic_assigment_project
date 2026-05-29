import AdminLayout from '../../layouts/AdminLayout.vue'

export default [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('../../views/admin/AdminDashboard.vue') },
      { path: 'doctors', name: 'DoctorsList', component: () => import('../../views/admin/DoctorsView.vue') },
      { path: 'doctors/:id', name: 'DoctorDetail', component: () => import('../../views/admin/DoctorDetail.vue') },
      { path: 'patients', name: 'PatientsList', component: () => import('../../views/admin/PatientsView.vue') },
      { path: 'patients/:id', name: 'PatientProfile', component: () => import('../../views/admin/PatientProfile.vue') },
      { path: 'appointments', name: 'Appointments', component: () => import('../../views/admin/AppointmentsView.vue') },
      { path: 'schedule', name: 'Schedule', component: () => import('../../views/admin/ScheduleView.vue') },
      { path: 'reports', name: 'Reports', component: () => import('../../views/admin/ReportsView.vue') },
      { path: 'settings', name: 'Settings', component: () => import('../../views/admin/SettingsView.vue') },
      { path: 'profile', name: 'AdminProfile', component: () => import('../../views/admin/AdminProfile.vue') },
    ],
  },
]