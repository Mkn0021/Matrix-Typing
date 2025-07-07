import type { TypingStats, Leaderboard, Testimonial, Achievement } from "@/lib/types";

// Base user type with only core fields
export type BaseUser = {
  id: string;
  username: string;
  email: string;
  image?: string | null;
  level: number;
  country: string;
  rank: number;
};

// Full user type for backend/internal use
export type User = BaseUser & {
  passwordHash: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  stats?: TypingStats[];
  leaderboard?: Leaderboard[];
  testimonials?: Testimonial[];
  achievements?: Achievement[];
  bestWpm?: number;
  bestAccuracy?: number;
  totalTests?: number;
  streak?: number;
};

// Public user for client-side or API responses (no sensitive or heavy fields)
export type PublicUser = Omit<
  User,
  | "passwordHash"
  | "stats"
  | "leaderboard"
  | "testimonials"
  | "achievements"
  | "createdAt"
  | "updatedAt"
>;

export type UserWithStats = Omit<User, 'passwordHash'>;


