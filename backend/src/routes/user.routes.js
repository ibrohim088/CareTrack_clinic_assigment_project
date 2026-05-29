import { Router } from "express";
import * as ctrl from "../controllers/user.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", verifyAuth, allowRoles("admin"), ctrl.getAll);
router.get("/:id", verifyAuth, ctrl.getById);
router.put("/:id", verifyAuth, ctrl.update);
router.delete("/:id", verifyAuth, allowRoles("admin"), ctrl.remove);

export default router;
