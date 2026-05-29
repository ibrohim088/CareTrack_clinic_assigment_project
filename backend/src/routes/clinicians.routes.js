import { Router } from "express";
import * as ctrl from "../controllers/clinicians.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { cliniciansSchema } from "../validations/clinicians.validation.js";

const router = Router();

router.get("/", verifyAuth, ctrl.getAll);
router.get("/:id", verifyAuth, ctrl.getById);
router.post("/", verifyAuth, allowRoles("admin"), validate(cliniciansSchema), ctrl.create);
router.put("/:id", verifyAuth, allowRoles("admin", "clinician"), ctrl.update);
router.delete("/:id", verifyAuth, allowRoles("admin"), ctrl.remove);

export default router;
