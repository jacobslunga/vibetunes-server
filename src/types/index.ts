interface User {
  userId: string;
  username: string;
  spotifyId?: string;
  name?: string;
  password: string;
  email: string;
  spotifyUrl?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { User };
