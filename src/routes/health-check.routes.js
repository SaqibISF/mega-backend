import { Router } from "express";
import { checkCode, healthCheck } from "../controllers/health-check.controller.js";

const router = Router();

router.route("/").get(healthCheck);

router.route("/check-code").get(checkCode);

export default router;
