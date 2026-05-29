import { Router } from "express";
import * as ctrl from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import verifyAuth from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), ctrl.register);
router.post("/login", validate(loginSchema), ctrl.login);
router.get("/me", verifyAuth, ctrl.getMe);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);

export default router;
