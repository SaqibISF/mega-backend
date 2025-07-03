import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  verifyChannelId,
  verifySubscriberId,
} from "../middlewares/subscription.middleware.js";
import {
  isSubscribed,
  subscribe,
  unsubscribe,
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT);

router.use(verifyChannelId);
router.use(verifySubscriberId);

router.route("/").get(isSubscribed).post(subscribe).delete(unsubscribe);

export default router;
