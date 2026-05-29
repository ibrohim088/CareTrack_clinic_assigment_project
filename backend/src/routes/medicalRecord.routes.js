import { Router } from "express";
import * as ctrl from "../controllers/medicalRecord.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";
import {allowRoles} from "../middlewares/role.middleware.js";
import { uploadDocument } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", verifyAuth, ctrl.getAll);
router.get("/:id", verifyAuth, ctrl.getById);
router.post("/", verifyAuth, allowRoles("clinician", "admin"), uploadDocument.single("file"), ctrl.create);
router.delete("/:id", verifyAuth, allowRoles("admin"), ctrl.remove);

export default router;
