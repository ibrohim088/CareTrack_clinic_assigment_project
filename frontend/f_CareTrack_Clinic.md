
---

# `README.md` uchun Frontend qo‘llanma

```md
# CareTrack Clinic Frontend

## 📌 About

This is the frontend part of the CareTrack Clinic Medical Records Management System (MRMS).

Frontend provides:
- Dashboard
- Authentication pages
- Doctor management UI
- Patient management UI
- Diagnosis management
- Appointment scheduling
- Responsive design

---

# ⚙️ Technologies

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- CSS

---

# 📂 Project Structure

src/
api/
components/
layouts/
router/
stores/
views/
assets/

---

# 🚀 Installation

## 1. Install dependencies

```bash
npm install

====================================================
  SHIFOXONA FRONTEND — To'liq Fayl Strukturasi
====================================================


```bash
clinic-f/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
│
└── src/
    ├── App.vue
    ├── main.js
    │
    ├── api/
    │   ├── appointment.api.js
    │   ├── auth.api.js
    │   ├── axios.js
    │   ├── diagnosis.api.js
    │   ├── doctor.api.js
    │   ├── patient.api.js
    │   ├── prescription.api.js
    │   ├── profile.api.js
    │   ├── schedule.api.js
    │   └── user.api.js
    │
    ├── assets/
    │   └── styles/
    │       ├── auth.css
    │       ├── main.css
    │       ├── modal-shared.css
    │       ├── settings-view.css
    │       │
    │       ├── layouts/
    │       │   ├── admin-layout.css
    │       │   ├── doctor-layout.css
    │       │   └── patient-layout.css
    │       │
    │       └── views/
    │           ├── admin/
    │           ├── doctor/
    │           └── patient/
    │
    ├── components/
    │   ├── common/
    │   │   ├── AppointmentCard.vue
    │   │   ├── ConfirmModal.vue
    │   │   ├── DataTable.vue
    │   │   ├── DoctorCard.vue
    │   │   ├── FormWrapper.vue
    │   │   ├── PatientRow.vue
    │   │   │
    │   │   └── layout/
    │   │       ├── AppFooter.vue
    │   │       ├── AppHeader.vue
    │   │       ├── AppNavItem.vue
    │   │       └── AppSidebar.vue
    │   │
    │   ├── features/
    │   │   └── schedule/
    │   │       ├── ScheduleCalendar.vue
    │   │       ├── ScheduleHeader.vue
    │   │       └── ScheduleSlots.vue
    │   │
    │   └── ui/
    │       ├── AppAvatar.vue
    │       ├── AppBadge.vue
    │       ├── AppButton.vue
    │       ├── AppCalendar.vue
    │       ├── AppEmptyState.vue
    │       ├── AppInput.vue
    │       ├── AppModal.vue
    │       ├── AppPagination.vue
    │       ├── AppSelect.vue
    │       ├── AppSpinner.vue
    │       ├── BaseCard.vue
    │       ├── CalendarDay.vue
    │       ├── CalendarGrid.vue
    │       ├── StatCard.vue
    │       ├── StatusBadge.vue
    │       └── index.js
    │
    ├── composables/
    │   ├── useAuth.js
    │   └── usePaginate.js
    │
    ├── layouts/
    │   ├── AdminLayout.vue
    │   ├── DoctorLayout.vue
    │   └── PatientLayout.vue
    │
    ├── router/
    │   ├── index.js
    │   │
    │   ├── guards/
    │   │   └── auth.guard.js
    │   │
    │   └── routes/
    │       ├── admin.routes.js
    │       ├── auth.routes.js
    │       ├── doctor.routes.js
    │       └── patient.routes.js
    │
    ├── stores/
    │   ├── appointment.store.js
    │   ├── auth.store.js
    │   ├── clinician.store.js
    │   ├── dashboard.store.js
    │   ├── medicalRecord.store.js
    │   ├── patient.store.js
    │   ├── prescription.store.js
    │   └── schedule.store.js
    │
    └── views/
        ├── admin/
        │   ├── AdminDashboard.vue
        │   ├── AdminProfile.vue
        │   ├── AppointmentsView.vue
        │   ├── DoctorDetail.vue
        │   ├── DoctorsView.vue
        │   ├── PatientProfile.vue
        │   ├── PatientsView.vue
        │   ├── ReportsView.vue
        │   ├── ScheduleView.vue
        │   └── SettingsView.vue
        │
        ├── auth/
        │   ├── ForgotPassword.vue
        │   ├── LoginView.vue
        │   └── RegisterView.vue
        │
        ├── doctor/
        │   ├── AppointmentsView.vue
        │   ├── DoctorDashboard.vue
        │   ├── DoctorProfile.vue
        │   ├── MyPatients.vue
        │   ├── MySchedule.vue
        │   ├── PrescriptionsView.vue
        │   └── SettingsView.vue
        │
        └── patient/
            ├── FindDoctor.vue
            ├── MedicalRecords.vue
            ├── MyAppointments.vue
            ├── MyPrescriptions.vue
            ├── PatientDashboard.vue
            ├── PatientProfile.vue
            └── SettingsView.vue
```
