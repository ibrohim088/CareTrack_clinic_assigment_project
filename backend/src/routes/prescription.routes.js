import { Router } from "express";
import * as ctrl from "../controllers/prescription.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { prescriptionSchema } from "../validations/prescription.validation.js";

const router = Router();

router.get("/", verifyAuth, ctrl.getAll);
router.get("/:id", verifyAuth, ctrl.getById);
router.post("/", verifyAuth, allowRoles("clinician", "admin"), validate(prescriptionSchema), ctrl.create);
router.delete("/:id", verifyAuth, allowRoles("admin", "clinician"), ctrl.remove);

export default router;
