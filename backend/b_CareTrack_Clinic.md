# CareTrack Clinic Backend

## 📌 About
This is the backend part of the CareTrack Clinic Medical Records Management System (MRMS).

Backend provides:
- Authentication
- Role-based authorization
- Doctor management
- Patient management
- Diagnosis management
- Appointments
- Prescriptions
- Medical records
- REST API services

---

# ⚙️ Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Swagger

---

# 📂 Project Structure

src/
controllers/
models/
routes/
middlewares/
utils/
validations/
config/

---

# 🚀 Installation

## 1. Clone project

```bash
git clone <repository-link>
```

====================================================
  SHIFOXONA BACKEND — To'liq Fayl Strukturasi
====================================================

```bash
clinic-b/
├── package.json
├── package-lock.json
├── server.js
├── .env
├── b_CareTrack_Clinic.md
├── collection.json
├── environment.json
│
├── uploads/
│   ├── avatars/
│   └── documents/
│
└── src/
    ├── app.js
    │
    ├── config/
    │   ├── db.js
    │   ├── env.js
    │   └── swagger.js
    │
    ├── controllers/
    │   ├── appointment.controller.js
    │   ├── auth.controller.js
    │   ├── clinicians.controller.js
    │   ├── diagnosis.controller.js
    │   ├── medicalRecord.controller.js
    │   ├── patient.controller.js
    │   ├── prescription.controller.js
    │   ├── profile.controller.js
    │   ├── schedule.controller.js
    │   └── user.controller.js
    │
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── error.middleware.js
    │   ├── role.middleware.js
    │   ├── upload.middleware.js
    │   └── validate.middleware.js
    │
    ├── models/
    │   ├── Appointment.model.js
    │   ├── Clinicians.model.js
    │   ├── ClinicianSchedule.model.js
    │   ├── Diagnosis.model.js
    │   ├── MedicalRecord.model.js
    │   ├── Patient.model.js
    │   ├── Prescription.model.js
    │   └── User.model.js
    │
    ├── routes/
    │   ├── appointment.routes.js
    │   ├── auth.routes.js
    │   ├── clinicians.routes.js
    │   ├── diagnosis.routes.js
    │   ├── medicalRecord.routes.js
    │   ├── patient.routes.js
    │   ├── prescription.routes.js
    │   ├── profile.routes.js
    │   ├── schedule.routes.js
    │   └── user.routes.js
    │
    ├── utils/
    │   ├── bcrypt.util.js
    │   ├── jwt.util.js
    │   ├── paginate.util.js
    │   └── response.util.js
    │
    └── validations/
        ├── appointment.validation.js
        ├── auth.validation.js
        ├── clinicians.validation.js
        ├── diagnosis.validation.js
        ├── patient.validation.js
        └── prescription.validation.js
```