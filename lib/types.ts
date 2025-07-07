// Central types for the app, based on schema.prisma
import { PublicUser } from "@/types/user";

export type TypingStats = {
  id: string;
  userId: string;
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  wordsCompleted: number;
  mode: string;
  createdAt: string | Date;
};

export type Leaderboard = {
  id: string;
  userId: string;
  wpm: number;
  accuracy: number;
  mode: string;
  createdAt: string | Date;
};

export type LeaderboardEntry = {
  id: string;
  userId: string;
  wpm: number;
  accuracy: number;
  mode: string;
  rank: number;
  createdAt: string | Date;
  user: Omit<PublicUser, "id" | "email" | "rank">;
};


export type Testimonial = {
  id: string;
  userId?: string | null;
  userName: string;
  role: string;
  image: string;
  rating: number;
  text: string;
  createdAt: string | Date;
};

export type Achievement = {
  id: string;
  userId: string;
  title: string;
  description: string;
  achievedAt: string | Date;
  unlockedAt?: string | Date | null;
};
