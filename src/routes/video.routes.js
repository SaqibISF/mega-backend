import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideoDetails,
  updateVideoThumbnail,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyVideoId } from "../middlewares/video.middleware.js";

const router = Router();

router.route("/").get(getAllVideos);

router.use(verifyJWT);

router.route("/publish-video").post(
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishVideo
);

router.use("/:videoId", verifyVideoId);

router
  .route("/:videoId")
  .get(getVideoById)
  .patch(updateVideoDetails)
  .delete(deleteVideo);

router
  .route("/update-thumbnail/:videoId")
  .patch(upload.single("thumbnail"), updateVideoThumbnail);

router.route("/toggle-publish-status").patch(togglePublishStatus);

export default router;
