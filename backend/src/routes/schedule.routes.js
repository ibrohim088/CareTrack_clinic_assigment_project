import { Router } from "express";
import * as ctrl from "../controllers/schedule.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Hammaga ochiq (login bo'lgan)
router.get("/", verifyAuth, ctrl.getAll);
router.get("/my", verifyAuth, allowRoles("clinician"), ctrl.getMy);
router.get("/:id", verifyAuth, ctrl.getById);

// Faqat clinician yaratadi
router.post("/", verifyAuth, allowRoles("clinician"), ctrl.create);

// Clinician o'zi yoki admin yangilaydi/o'chiradi
router.put("/:id", verifyAuth, allowRoles("clinician", "admin"), ctrl.update);
router.delete("/:id", verifyAuth, allowRoles("clinician", "admin"), ctrl.remove);

export default router;