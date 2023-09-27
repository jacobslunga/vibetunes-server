import { prisma } from "../prismaClient";
import { Request, Response } from "express";
import { generateJwtToken, generateRefreshToken } from "../middleware/jwt";
import { User } from "../types";
import jwt from "jsonwebtoken";

// GET /users/:id
export const getUserById = async (req: Request, res: Response) => {
  const { id }: any = req.params;
  const user = await prisma.user.findUnique({
    where: {
      userId: id,
    },
    include: {
      playlists: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    return res.json(user);
  }
};

// GET /users/me
export const getMe = async (req: Request, res: Response) => {
  const { userId }: any = req.user;

  const user = await prisma.user.findUnique({
    where: {
      userId,
    },
    include: {
      playlists: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    return res.json(user);
  }
};

// GET /users/username/:username
export const getUserByUsername = async (req: Request, res: Response) => {
  const { username }: any = req.params;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    return res.json(user);
  }
};

// AUTHENTICATION

// POST /users/auth/login
export const authenticateWithSpotify = async (req: Request, res: Response) => {
  try {
    const { email, spotifyId, username, imageUrl, spotifyUrl } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      const accessToken = generateJwtToken(existingUser as User);
      const refreshToken = generateRefreshToken(existingUser as User);

      const expiresIn = 86400;

      const nowInMilliseconds = Date.now();

      const expiresAt = Math.floor(nowInMilliseconds / 1000) + expiresIn;

      return res.json({
        existingUser,
        vibeTunesAccessToken: accessToken,
        vibeTunesRefreshToken: refreshToken,
        vibeTunesExpiresAt: expiresAt,
      });
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          spotifyId,
          username,
          imageUrl,
          spotifyUrl,
        },
      });

      const accessToken = generateJwtToken(newUser as User);
      const refreshToken = generateRefreshToken(newUser as User);

      const expiresIn = 86400;

      const nowInMilliseconds = Date.now();

      const expiresAt = Math.floor(nowInMilliseconds / 1000) + expiresIn;

      return res.json({
        newUser,
        vibeTunesAccessToken: accessToken,
        vibeTunesRefreshToken: refreshToken,
        vibeTunesExpiresAt: expiresAt,
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /users/auth/refresh
export const refreshToken = (req: Request, res: Response) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
  const refreshHeader = req.headers["x-refresh"];

  if (!refreshHeader) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const user = jwt.verify(refreshHeader as string, refreshSecret) as User;
    const accessToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user);
    const nowInMilliseconds = Date.now();

    const expiresIn = 86400;

    const expiresAt = Math.floor(nowInMilliseconds / 1000) + expiresIn;

    res.status(200).json({
      accessToken,
      refreshToken,
      expiresAt,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
