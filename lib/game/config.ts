/**
 * Game configuration constants
 * All tunable values in one place for easy balancing
 */

import type { GameConfig, Skin, Theme } from './types';

export const GAME_CONFIG: GameConfig = {
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

// Grid dimensions (logical, not pixels)
export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;

// Initial snake position (center)
export const INITIAL_SNAKE: import('./types').SnakeSegment[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

// Direction vectors
export const DIRECTION_VECTORS: Record<import('./types').Direction, import('./types').Vector2> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

// Opposite directions (prevent 180° turns)
export const OPPOSITE_DIRECTIONS: Record<import('./types').Direction, import('./types').Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

// Snake Skins (5+ unlockable)
export const SNAKE_SKINS: Skin[] = [
  {
    id: 'classic',
    name: 'Classic Green',
    description: 'The original snake look',
    previewColor: '#22c55e',
    headColor: '#16a34a',
    bodyColor: '#22c55e',
    tailColor: '#4ade80',
    unlockRequirement: { type: 'score', value: 0 },
    rarity: 'common',
  },
  {
    id: 'neon',
    name: 'Neon Pulse',
    description: 'Cyberpunk aesthetic with glow',
    previewColor: '#a855f7',
    headColor: '#9333ea',
    bodyColor: '#a855f7',
    tailColor: '#d8b4fe',
    unlockRequirement: { type: 'score', value: 500 },
    rarity: 'rare',
  },
  {
    id: 'fire',
    name: 'Inferno',
    description: 'Burning through the grid',
    previewColor: '#ef4444',
    headColor: '#dc2626',
    bodyColor: '#ef4444',
    tailColor: '#fca5a5',
    unlockRequirement: { type: 'score', value: 1500 },
    rarity: 'epic',
  },
  {
    id: 'ice',
    name: 'Frostbite',
    description: 'Cold precision',
    previewColor: '#06b6d4',
    headColor: '#0891b2',
    bodyColor: '#06b6d4',
    tailColor: '#67e8f9',
    unlockRequirement: { type: 'score', value: 3000 },
    rarity: 'epic',
  },
  {
    id: 'gold',
    name: 'Golden Legend',
    description: 'For the true champions',
    previewColor: '#fbbf24',
    headColor: '#f59e0b',
    bodyColor: '#fbbf24',
    tailColor: '#fde68a',
    unlockRequirement: { type: 'score', value: 5000 },
    rarity: 'legendary',
  },
  {
    id: 'rainbow',
    name: 'Prism',
    description: 'Shifting colors every segment',
    previewColor: '#ec4899',
    headColor: '#db2777',
    bodyColor: '#ec4899',
    tailColor: '#f9a8d4',
    unlockRequirement: { type: 'score', value: 10000 },
    rarity: 'legendary',
  },
];

// Themes (5+ unlockable)
export const THEMES: Theme[] = [
  {
    id: 'dark',
    name: 'Midnight',
    description: 'Classic dark arena',
    backgroundColors: ['#0f172a', '#1e293b'],
    gridColor: '#334155',
    foodColor: '#ef4444',
    accentColor: '#22c55e',
    unlockRequirement: { type: 'score', value: 0 },
    rarity: 'common',
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Retro-futuristic sunset',
    backgroundColors: ['#1a0033', '#3d0066'],
    gridColor: '#ff00ff',
    foodColor: '#00ffff',
    accentColor: '#ffcc00',
    unlockRequirement: { type: 'score', value: 1000 },
    rarity: 'rare',
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Green code rain aesthetic',
    backgroundColors: ['#000000', '#001100'],
    gridColor: '#003300',
    foodColor: '#ff0000',
    accentColor: '#00ff00',
    unlockRequirement: { type: 'games-played', value: 25 },
    rarity: 'rare',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    description: 'Calm underwater depths',
    backgroundColors: ['#001122', '#002244'],
    gridColor: '#004466',
    foodColor: '#ffaa00',
    accentColor: '#00ccff',
    unlockRequirement: { type: 'time-played', value: 3600000 }, // 1 hour
    rarity: 'epic',
  },
  {
    id: 'void',
    name: 'Void',
    description: 'Minimalist high-contrast',
    backgroundColors: ['#000000', '#000000'],
    gridColor: '#ffffff',
    foodColor: '#ffffff',
    accentColor: '#ffffff',
    unlockRequirement: { type: 'score', value: 7500 },
    rarity: 'legendary',
  },
  {
    id: 'colorblind',
    name: 'Accessibility',
    description: 'Colorblind-safe palette',
    backgroundColors: ['#1a1a2e', '#16213e'],
    gridColor: '#4a4e69',
    foodColor: '#e94560',
    accentColor: '#00b4d8',
    unlockRequirement: { type: 'score', value: 0 },
    rarity: 'common',
  },
];

// Power-up configurations
export const POWER_UP_CONFIG = {
  'slowmo': {
    label: 'SLOW-MO',
    color: '#3b82f6',
    duration: 10_000,
    speedMultiplier: 0.5,
  },
  'double-points': {
    label: '2X POINTS',
    color: '#fbbf24',
    duration: 10_000,
    scoreMultiplier: 2,
  },
  'ghost-mode': {
    label: 'GHOST',
    color: '#a855f7',
    duration: 5_000,
    canPassWalls: true,
    canPassSelf: true,
  },
} as const;

// Audio file paths (to be placed in public/audio/)
export const AUDIO_PATHS = {
  ambient: '/audio/ambient.mp3',
  eat: '/audio/eat.mp3',
  turn: '/audio/turn.mp3',
  gameOver: '/audio/game-over.mp3',
  powerUp: '/audio/powerup.mp3',
  levelUp: '/audio/levelup.mp3',
};

// LocalStorage keys
export const STORAGE_KEYS = {
  highScore: 'snake-arena-high-score',
  gameStats: 'snake-arena-stats',
  settings: 'snake-arena-settings',
  unlockedSkins: 'snake-arena-unlocked-skins',
  unlockedThemes: 'snake-arena-unlocked-themes',
  currentSkin: 'snake-arena-current-skin',
  currentTheme: 'snake-arena-current-theme',
  soundEnabled: 'snake-arena-sound',
  hapticsEnabled: 'snake-arena-haptics',
  reducedMotion: 'snake-arena-reduced-motion',
  colorblindMode: 'snake-arena-colorblind',
} as const;