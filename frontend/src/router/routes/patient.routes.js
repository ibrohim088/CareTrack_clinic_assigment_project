import PatientLayout from '../../layouts/PatientLayout.vue'

export default [
  {
    path: '/patient',
    component: PatientLayout,
    meta: { requiresAuth: true, role: 'patient' },
    children: [
      { path: '', redirect: '/patient/dashboard' },
      { path: 'dashboard', name: 'PatientDashboard', component: () => import('../../views/patient/PatientDashboard.vue') },
      { path: 'appointments', name: 'MyAppointments', component: () => import('../../views/patient/MyAppointments.vue') },
      { path: 'records', name: 'MedicalRecords', component: () => import('../../views/patient/MedicalRecords.vue') },
      { path: 'prescriptions', name: 'MyPrescriptions', component: () => import('../../views/patient/MyPrescriptions.vue') },
      { path: 'find-doctor', name: 'FindDoctor', component: () => import('../../views/patient/FindDoctor.vue') },
      { path: 'settings', name: 'PatientSettings', component: () => import('../../views/patient/SettingsView.vue') },
      { path: 'profile', name: 'PatientProfile', component: () => import('../../views/patient/PatientProfile.vue') },
    ],
  },
]