import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";
import { verifyVideoId } from "../middlewares/video.middleware.js";
import { verifyCommentId } from "../middlewares/comment.middleware.js";
import { verifyTweetId } from "../middlewares/tweet.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/toggle-video-like/:videoId")
  .patch(verifyVideoId, toggleVideoLike);

router
  .route("/toggle-comment-like/:commentId")
  .patch(verifyCommentId, toggleCommentLike);

router
  .route("/toggle-tweet-like/:tweetId")
  .patch(verifyTweetId, toggleTweetLike);

router.route("/get-liked-videos").get(getLikedVideos);

export default router;
