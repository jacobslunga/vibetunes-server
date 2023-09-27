import jwt from "jsonwebtoken";
import { User } from "../types";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

function authenticateJwtRequestToken() {
  return (req: Request, res: Response, next: NextFunction) => {
    const { path } = req;
    const excludedPaths = ["/users/auth/login", "/users/auth/refresh"];

    if (excludedPaths.includes(path)) {
      next();
    } else {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          const decoded = jwt.verify(token, jwtSecret) as User;
          req.user = decoded;
          next();
        } catch (error) {
          res.status(401).json({ message: "Invalid token" });
        }
      } else {
        res.status(401).json({ message: "No token provided" });
      }
    }
  };
}

function generateJwtToken(user: User) {
  return jwt.sign(
    {
      id: user.userId,
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      spotifyId: user.spotifyId,
    },
    jwtSecret,
    {
      algorithm: "HS512",
      expiresIn: "1d",
    }
  );
}

function generateRefreshToken(user: User) {
  return jwt.sign(
    {
      id: user.userId,
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      spotifyId: user.spotifyId,
    },
    refreshSecret,
    {
      algorithm: "HS512",
    }
  );
}

export { authenticateJwtRequestToken, generateJwtToken, generateRefreshToken };
