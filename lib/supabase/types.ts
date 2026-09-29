type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      leaderboard: {
        Row: {
          id: string;
          player_name: string;
          score: number;
          game_mode: 'classic' | 'endless' | 'time-attack';
          difficulty: 'easy' | 'normal' | 'hard' | 'expert';
          duration: number;
          move_log?: Json;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_name: string;
          score: number;
          game_mode: 'classic' | 'endless' | 'time-attack';
          difficulty: 'easy' | 'normal' | 'hard' | 'expert';
          duration: number;
          move_log?: Json;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_name?: string;
          score?: number;
          game_mode?: 'classic' | 'endless' | 'time-attack';
          difficulty?: 'easy' | 'normal' | 'hard' | 'expert';
          duration?: number;
          move_log?: Json;
          verified?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      game_stats: {
        Row: {
          id: string;
          total_games_played: number;
          total_score: number;
          total_time_played: number;
          highest_score: number;
          created_at: string;
        };
      };
      settings: {
        Row: {
          id: string;
          sound_enabled: boolean;
          haptics_enabled: boolean;
          created_at: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}