import DoctorLayout from '../../layouts/DoctorLayout.vue'

export default [
  {
    path: '/clinician',
    component: DoctorLayout,
    meta: { requiresAuth: true, role: 'clinician' },
    children: [
      { path: '', redirect: '/clinician/dashboard' },
      { path: 'dashboard', name: 'DoctorDashboard', component: () => import('../../views/doctor/DoctorDashboard.vue') },
      { path: 'appointments', name: 'DoctorAppointments', component: () => import('../../views/doctor/AppointmentsView.vue') },
      { path: 'patients', name: 'MyPatients', component: () => import('../../views/doctor/MyPatients.vue') },
      { path: 'schedule', name: 'MySchedule', component: () => import('../../views/doctor/MySchedule.vue') },
      { path: 'prescriptions', name: 'Prescriptions', component: () => import('../../views/doctor/PrescriptionsView.vue') },
      { path: 'settings', name: 'DoctorSettings', component: () => import('../../views/doctor/SettingsView.vue') },
      { path: 'profile', name: 'DoctorProfile', component: () => import('../../views/doctor/DoctorProfile.vue') },
    ],
  },
]