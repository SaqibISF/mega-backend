import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyTweetId } from "../middlewares/tweet.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createTweet).get(getUserTweets);
router
  .route("/tweetId/:tweetId")
  .patch(verifyTweetId, updateTweet)
  .delete(verifyTweetId, deleteTweet);

export default router;
