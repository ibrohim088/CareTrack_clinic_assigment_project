import { Router } from "express";
import * as ctrl from "../controllers/profile.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", verifyAuth, ctrl.getMyProfile);
router.put("/me", verifyAuth, ctrl.updateMyProfile);
router.get("/clinician/:id", verifyAuth, ctrl.getClinicianProfile);
router.get("/patient/:id", verifyAuth, ctrl.getPatientProfile);

export default router;