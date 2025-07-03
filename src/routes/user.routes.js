import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/refresh-token").post(refreshAccessToken);

router.use(verifyJWT);

router.route("/logout").post(logoutUser);

router.route("/change-password").post(changeCurrentPassword);
router.route("/current-user").get(getCurrentUser);
router.route("/update-account-details").patch(updateAccountDetails);

router.route("/update-avatar").patch(upload.single("avatar"), updateUserAvatar);

router
  .route("/update-cover-image")
  .patch(upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:username").get(getUserChannelProfile);

router.route("/watch-history").get(getWatchHistory);

export default router;
