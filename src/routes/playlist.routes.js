import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyPlaylistId } from "../middlewares/playlist.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getUserPlaylists).post(createPlaylist);

router.use(verifyPlaylistId);

router
  .route("/playlist/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

router.route("/playlist/:playlistId/add-video").patch(addVideoToPlaylist);

router.route("/playlist/:playlistId/remove-video").patch(removeVideoFromPlaylist);

export default router;
