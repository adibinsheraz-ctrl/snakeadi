/**
 * Core game types for Snake Arena
 * Shared between client (game engine) and server (validation)
 */

export type GameMode = 'classic' | 'endless' | 'time-attack';
export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert';
export type CameraView = 'top-down' | 'angled-3d';
export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Vector2 {
  x: number;
  y: number;
}

export interface GridPosition {
  x: number;
  y: number;
}

export interface SnakeSegment extends GridPosition {
  // Interpolation data for smooth rendering
  prevX?: number;
  prevY?: number;
  lerpFactor?: number;
}

export interface Food {
  position: GridPosition;
  type: 'normal' | 'powerup-slowmo' | 'powerup-double' | 'powerup-ghost';
  spawnTime: number;
}

export interface PowerUp {
  type: 'slowmo' | 'double-points' | 'ghost-mode';
  duration: number; // milliseconds
  expiresAt: number;
  active: boolean;
}

export interface GameState {
  // Core state
  snake: SnakeSegment[];
  direction: Direction;
  nextDirection: Direction;
  food: Food | null;
  score: number;
  highScore: number;
  gameMode: GameMode;
  difficulty: Difficulty;

  // Game flow
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isLoading: boolean;

  // Timing
  gameStartTime: number;
  lastUpdateTime: number;
  timeRemaining: number; // for Time Attack mode
  speedMultiplier: number;

  // Power-ups
  activePowerUps: PowerUp[];

  // Camera
  cameraView: CameraView;
  cameraPosition: Vector2;
  cameraTarget: Vector2;

  // Settings
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  colorblindMode: boolean;

  // Skin/Theme
  currentSkin: string;
  currentTheme: string;
  unlockedSkins: string[];
  unlockedThemes: string[];
}

export interface GameConfig {
  gridSize: number;
  initialSpeed: number; // ms per tick
  speedIncreaseInterval: number; // score threshold
  speedIncreaseAmount: number; // ms reduction
  maxSpeed: number; // minimum ms per tick
  timeAttackDuration: number; // ms
  powerUpSpawnChance: number; // 0-1
  powerUpDuration: number; // ms
  ghostModeDuration: number; // ms
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  gridSize: 20,
  initialSpeed: 150,
  speedIncreaseInterval: 50,
  speedIncreaseAmount: 5,
  maxSpeed: 60,
  timeAttackDuration: 90_000,
  powerUpSpawnChance: 0.15,
  powerUpDuration: 10_000,
  ghostModeDuration: 5_000,
};

export interface MoveLogEntry {
  tick: number;
  direction: Direction;
  timestamp: number;
  position: GridPosition;
}

export interface ScoreSubmission {
  playerName: string;
  score: number;
  gameMode: GameMode;
  difficulty: Difficulty;
  moveLog: MoveLogEntry[];
  duration: number;
  timestamp: number;
  // Client-side hash for basic tamper detection
  clientHash: string;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  game_mode: GameMode;
  difficulty: Difficulty;
  duration: number;
  created_at: string;
  verified: boolean;
}

export interface LeaderboardParams {
  mode?: GameMode;
  difficulty?: Difficulty;
  period?: 'daily' | 'weekly' | 'all-time';
  limit?: number;
  offset?: number;
}

export interface Skin {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  headColor: string;
  bodyColor: string;
  tailColor: string;
  unlockRequirement: {
    type: 'score' | 'games-played' | 'time-played';
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  backgroundColors: string[];
  gridColor: string;
  foodColor: string;
  accentColor: string;
  unlockRequirement: {
    type: 'score' | 'games-played' | 'time-played';
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AudioAssets {
  ambient: string;
  eat: string;
  turn: string;
  gameOver: string;
  powerUp: string;
  levelUp: string;
}

export interface GameStats {
  totalGamesPlayed: number;
  totalScore: number;
  totalTimePlayed: number;
  highestScore: number;
  highestScoreMode: GameMode;
  highestScoreDifficulty: Difficulty;
  favoriteMode: GameMode;
  currentStreak: number;
  bestStreak: number;
}