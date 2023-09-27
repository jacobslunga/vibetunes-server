import { Router } from "express";
import {
  authenticateWithSpotify,
  getUserById,
  getUserByUsername,
  getMe,
  refreshToken,
} from "../controllers/users";

const router = Router();

// GET
router.get("/:id", getUserById);
router.get("/me", getMe);
router.get("/username/:username", getUserByUsername);

// POST
router.post("/auth/login", authenticateWithSpotify);
router.post("/auth/refresh", refreshToken);

export default router;
