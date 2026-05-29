import { Router } from "express";
import * as ctrl from "../controllers/appointment.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { appointmentSchema } from "../validations/appointment.validation.js";

const router = Router();

router.get("/", verifyAuth, ctrl.getAll);
router.get("/:id", verifyAuth, ctrl.getById);
router.post("/", verifyAuth, validate(appointmentSchema), ctrl.create);
router.patch("/:id/status", verifyAuth, allowRoles("admin", "clinician"), ctrl.updateStatus);
router.delete("/:id", verifyAuth, allowRoles("admin"), ctrl.remove);

export default router;
