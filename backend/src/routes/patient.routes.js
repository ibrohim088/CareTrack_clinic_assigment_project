import { Router } from "express";
import * as ctrl from "../controllers/patient.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";
import { isOwnerOrAdmin, allowRoles } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { patientSchema } from "../validations/patient.validation.js";

const router = Router();

router.get("/", verifyAuth, allowRoles("admin", "clinician"), ctrl.getAll);

router.get("/:id/profile", verifyAuth, isOwnerOrAdmin(), ctrl.getPatientProfile);

router.get("/:id", verifyAuth, isOwnerOrAdmin(), ctrl.getById);

router.post("/", verifyAuth, allowRoles("admin", "clinician"), validate(patientSchema), ctrl.create);

router.put("/:id", verifyAuth, isOwnerOrAdmin(), ctrl.update);

router.delete("/:id", verifyAuth, allowRoles("admin"), ctrl.remove);

export default router;