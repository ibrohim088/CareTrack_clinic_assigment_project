import { Router } from "express";
import * as ctrl from "../controllers/diagnosis.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { uploadDocument } from "../middlewares/upload.middleware.js";
import { diagnosisSchema } from "../validations/diagnosis.validation.js";

const router = Router();

router.get("/", verifyAuth, ctrl.getAll);
router.get("/:id", verifyAuth, ctrl.getById);
router.post("/", verifyAuth, allowRoles("clinician", "admin"), uploadDocument.array("documents", 5), validate(diagnosisSchema), ctrl.create);
router.put("/:id", verifyAuth, allowRoles("clinician", "admin"), ctrl.update);
router.delete("/:id", verifyAuth, allowRoles("admin"), ctrl.remove);

export default router;
