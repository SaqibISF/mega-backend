import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyChannelId } from "../middlewares/subscription.middleware.js";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(verifyJWT);

router.use(verifyChannelId);

router.route("/get-channel-stats/:channelId").get(getChannelStats);
router.route("/get-channel-videos/:channelId").get(getChannelVideos);

export default router;
