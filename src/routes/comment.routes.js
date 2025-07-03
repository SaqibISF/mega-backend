import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyCommentId } from "../middlewares/comment.middleware.js";
import { verifyVideoId } from "../middlewares/video.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:videoId")
  .get(verifyVideoId, getVideoComments)
  .post(verifyVideoId, addComment);

router
  .route("/:commentId")
  .delete(verifyCommentId, deleteComment)
  .patch(verifyCommentId, updateComment);

export default router;
