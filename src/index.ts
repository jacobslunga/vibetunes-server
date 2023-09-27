import express from "express";
import cors from "cors";
import { authenticateJwtRequestToken } from "./middleware/jwt";
import userRoutes from "./routes/users";
import playlistRoutes from "./routes/playlists";

async function main(): Promise<any> {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(authenticateJwtRequestToken());

  app.use("/users", userRoutes);
  app.use("/playlists", playlistRoutes);

  const PORT = process.env.PORT || 5001;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. 🌈`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
