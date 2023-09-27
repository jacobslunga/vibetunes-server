import { prisma } from "../prismaClient";
import { Request, Response } from "express";
import getDominantColor from "../lib/util/getDominantColor";

// GET /playlists/:id
export const getPlaylistById = async (req: Request, res: Response) => {
  const { id }: any = req.params;

  try {
    const playlist = await prisma.playlist.findUnique({
      where: {
        playlistId: id,
      },
    });

    if (!playlist) {
      res.status(404).json({ message: "Playlist not found" });
    } else {
      res.json(playlist);
    }
  } catch (error) {
    return res.json(error);
  }
};

// POST /playlists
export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { tracks, mood, diversity, intensity, duration, userId } = req.body;

    const tracksWithColors = await Promise.all(
      tracks.map(async (track: any) => {
        const color = await getDominantColor(track.imageUrl);
        return {
          ...track,
          color,
        };
      })
    );

    const user = await prisma.user.findUnique({
      where: {
        userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const playlist = await prisma.playlist.create({
      data: {
        tracks: {
          create: tracksWithColors,
        },
        diversity,
        intensity,
        duration,
        name: `${mood} Playlist`,
        userId,
        mood,
      },
    });

    res.json(playlist);
  } catch (error) {
    return res.json(error);
  }
};

// PUT /playlists/:id
export const updatePlaylist = async (req: Request, res: Response) => {
  const { id }: any = req.params;

  try {
    const playlist = await prisma.playlist.update({
      where: {
        playlistId: id,
      },
      data: req.body,
    });

    if (!playlist) {
      res.status(404).json({ message: "Playlist not found" });
    } else {
      res.json(playlist);
    }
  } catch (error) {
    return res.json(error);
  }
};

// DELETE /playlists/:id
export const deletePlaylist = async (req: Request, res: Response) => {
  const { id }: any = req.params;

  try {
    const playlist = await prisma.playlist.delete({
      where: {
        playlistId: id,
      },
    });

    if (!playlist) {
      res.status(404).json({ message: "Playlist not found" });
    } else {
      res.json(playlist);
    }
  } catch (error) {
    return res.json(error);
  }
};
