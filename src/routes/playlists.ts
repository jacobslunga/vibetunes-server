import { Router } from "express";
import {
  createPlaylist,
  getPlaylistById,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlists";

const router = Router();

// GET
router.get("/:id", getPlaylistById);

// POST
router.post("/", createPlaylist);

// PUT
router.put("/:id", updatePlaylist);

// DELETE
router.delete("/:id", deletePlaylist);

export default router;
