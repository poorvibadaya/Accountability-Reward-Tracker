export interface Plan {
  id: string;
  user_id: string;
  file_url: string;
  original_filename: string | null;
  uploaded_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  plan_id: string | null;
  date: string;
  title: string;
  description: string | null;
  points: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface ParsedTask {
  title: string;
  description?: string;
  date: string;
  points: number;
}

export interface Reward {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  point_cost: number;
  active: boolean;
  created_at: string;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  created_at: string;
  reward?: Reward;
}

export interface Streak {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

export interface PointsLedgerEntry {
  id: string;
  user_id: string;
  task_id: string | null;
  reward_redemption_id: string | null;
  points: number;
  type: "earned" | "redeemed";
  created_at: string;
}

export interface AnalyticsData {
  heatmap: { date: string; completed: number; total: number }[];
  weekly: { week: string; completed: number; total: number }[];
  pointsGrowth: { date: string; cumulative: number }[];
  stats: {
    totalPoints: number;
    totalTasksCompleted: number;
    currentStreak: number;
    longestStreak: number;
  };
}
