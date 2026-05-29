import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { swaggerSpec, swaggerUi } from '../src/config/swagger.js'

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import diagnosisRoutes from "./routes/diagnosis.routes.js";
import cliniciansRoutes from "./routes/clinicians.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import medicalRecordRoutes from "./routes/medicalRecord.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/diagnoses", diagnosisRoutes);
app.use("/api/clinicians", cliniciansRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use(errorMiddleware);

export default app;
