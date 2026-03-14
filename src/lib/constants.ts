export const POINTS = {
  EASY: 5,
  MEDIUM: 10,
  HARD: 20,
} as const;

export const ACCEPTED_FILE_TYPES = {
  "text/plain": [".txt"],
  "text/markdown": [".md"],
  "application/pdf": [".pdf"],
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const STREAK_MILESTONE = 7; // days for weekly celebration
