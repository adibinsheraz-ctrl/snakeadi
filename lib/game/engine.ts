/**
 * Snake Game Engine
 * Fixed timestep game loop separated from render loop
 * Deterministic, frame-rate independent gameplay
 */

import type {
  GameState,
  GameConfig,
  Direction,
  GridPosition,
  Food,
  PowerUp,
  MoveLogEntry,
  SnakeSegment,
} from './types';
import {
  GAME_CONFIG,
  GRID_WIDTH,
  GRID_HEIGHT,
  INITIAL_SNAKE,
  DIRECTION_VECTORS,
  OPPOSITE_DIRECTIONS,
  POWER_UP_CONFIG,
} from './config';

export class SnakeEngine {
  private state: GameState;
  private config: GameConfig;
  private inputQueue: Direction[] = [];
  private lastTimestamp = 0;
  private accumulator = 0;
  private tickCount = 0;
  private moveLog: MoveLogEntry[] = [];
  private listeners: Set<(state: GameState) => void> = new Set();
  private animationFrameId: number | null = null;
  private isRunning = false;

  constructor(config: Partial<GameConfig> = {}) {
    this.config = { ...GAME_CONFIG, ...config };
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      snake: [...INITIAL_SNAKE],
      direction: 'right',
      nextDirection: 'right',
      food: null,
      score: 0,
      highScore: this.loadHighScore(),
      gameMode: 'classic',
      difficulty: 'normal',
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      isLoading: false,
      gameStartTime: 0,
      lastUpdateTime: 0,
      timeRemaining: this.config.timeAttackDuration,
      speedMultiplier: 1,
      activePowerUps: [],
      cameraView: 'top-down',
      cameraPosition: { x: GRID_WIDTH / 2, y: GRID_HEIGHT / 2 },
      cameraTarget: { x: GRID_WIDTH / 2, y: GRID_HEIGHT / 2 },
      soundEnabled: true,
      hapticsEnabled: true,
      reducedMotion: false,
      colorblindMode: false,
      currentSkin: 'classic',
      currentTheme: 'dark',
      unlockedSkins: ['classic'],
      unlockedThemes: ['dark', 'colorblind'],
    };
  }

  // ========== PUBLIC API ==========

  getState(): Readonly<GameState> {
    return this.state;
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  start(gameMode: GameState['gameMode'] = 'classic', difficulty: GameState['difficulty'] = 'normal'): void {
    this.state = {
      ...this.createInitialState(),
      gameMode,
      difficulty,
      isPlaying: true,
      isGameOver: false,
      isPaused: false,
      gameStartTime: performance.now(),
      lastUpdateTime: performance.now(),
      timeRemaining: gameMode === 'time-attack' ? this.config.timeAttackDuration : 0,
    };
    this.inputQueue = [];
    this.moveLog = [];
    this.tickCount = 0;
    this.spawnFood();
    this.notify();
    this.startLoop();
  }

  pause(): void {
    if (this.state.isPlaying && !this.state.isPaused) {
      this.state.isPaused = true;
      this.notify();
    }
  }

  resume(): void {
    if (this.state.isPlaying && this.state.isPaused) {
      this.state.isPaused = false;
      this.lastTimestamp = performance.now();
      this.notify();
    }
  }

  restart(): void {
    this.start(this.state.gameMode, this.state.difficulty);
  }

  setDirection(direction: Direction): void {
    // Prevent 180-degree turns
    if (this.state.direction === OPPOSITE_DIRECTIONS[direction]) return;
    // Prevent duplicate queued directions
    if (this.inputQueue.length > 0 && this.inputQueue[this.inputQueue.length - 1] === direction) return;
    // Prevent queueing opposite of last queued
    if (this.inputQueue.length > 0 && this.inputQueue[this.inputQueue.length - 1] === OPPOSITE_DIRECTIONS[direction]) return;

    this.inputQueue.push(direction);
  }

  setGameMode(mode: GameState['gameMode']): void {
    if (!this.state.isPlaying) {
      this.state.gameMode = mode;
      this.notify();
    }
  }

  setDifficulty(difficulty: GameState['difficulty']): void {
    if (!this.state.isPlaying) {
      this.state.difficulty = difficulty;
      this.notify();
    }
  }

  setCameraView(view: GameState['cameraView']): void {
    this.state.cameraView = view;
    this.notify();
  }

  toggleSound(): void {
    this.state.soundEnabled = !this.state.soundEnabled;
    this.notify();
  }

  toggleHaptics(): void {
    this.state.hapticsEnabled = !this.state.hapticsEnabled;
    this.notify();
  }

  setReducedMotion(enabled: boolean): void {
    this.state.reducedMotion = enabled;
    this.notify();
  }

  setColorblindMode(enabled: boolean): void {
    this.state.colorblindMode = enabled;
    if (enabled) {
      this.state.currentTheme = 'colorblind';
    }
    this.notify();
  }

  setSkin(skinId: string): void {
    if (this.state.unlockedSkins.includes(skinId)) {
      this.state.currentSkin = skinId;
      this.notify();
    }
  }

  setTheme(themeId: string): void {
    if (this.state.unlockedThemes.includes(themeId)) {
      this.state.currentTheme = themeId;
      this.notify();
    }
  }

  getMoveLog(): MoveLogEntry[] {
    return [...this.moveLog];
  }

  // ========== GAME LOOP ==========

  private startLoop(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  private loop: FrameRequestCallback = (timestamp) => {
    if (!this.isRunning) return;

    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Cap delta time to prevent spiral of death on tab background
    const cappedDelta = Math.min(deltaTime, 100);

    this.accumulator += cappedDelta;
    const tickInterval = this.getCurrentTickInterval();

    while (this.accumulator >= tickInterval) {
      this.fixedUpdate(tickInterval);
      this.accumulator -= tickInterval;
    }

    // Interpolation factor for smooth rendering (0-1)
    const interpolationFactor = this.accumulator / tickInterval;
    this.updateInterpolation(interpolationFactor);

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private getCurrentTickInterval(): number {
    let baseSpeed = this.config.initialSpeed;

    // Difficulty scaling
    switch (this.state.difficulty) {
      case 'easy':
        baseSpeed *= 1.5;
        break;
      case 'normal':
        baseSpeed *= 1.0;
        break;
      case 'hard':
        baseSpeed *= 0.7;
        break;
      case 'expert':
        baseSpeed *= 0.5;
        break;
    }

    // Score-based speed increase
    const speedIncreases = Math.floor(this.state.score / this.config.speedIncreaseInterval);
    baseSpeed -= speedIncreases * this.config.speedIncreaseAmount;

    // Apply power-ups
    const slowmoActive = this.state.activePowerUps.some(
      (p) => p.type === 'slowmo' && p.active && p.expiresAt > performance.now()
    );
    if (slowmoActive) {
      baseSpeed *= POWER_UP_CONFIG.slowmo.speedMultiplier;
    }

    // Clamp to max speed
    return Math.max(baseSpeed, this.config.maxSpeed) * this.state.speedMultiplier;
  }

  private fixedUpdate(tickInterval: number): void {
    if (!this.state.isPlaying || this.state.isPaused || this.state.isGameOver) return;

    this.tickCount++;

    // Process input queue (only first valid input per tick)
    if (this.inputQueue.length > 0) {
      const nextDir = this.inputQueue.shift()!;
      if (nextDir !== OPPOSITE_DIRECTIONS[this.state.direction]) {
        this.state.direction = nextDir;
      }
    }

    this.state.nextDirection = this.state.direction;

    // Move snake
    this.moveSnake();

    // Check collisions
    this.checkCollisions();

    // Check food
    this.checkFood();

    // Update power-ups
    this.updatePowerUps();

    // Time attack mode
    if (this.state.gameMode === 'time-attack') {
      this.state.timeRemaining -= tickInterval;
      if (this.state.timeRemaining <= 0) {
        this.state.timeRemaining = 0;
        this.gameOver();
      }
    }

    // Log move for anti-cheat
    const head = this.state.snake[0];
    this.moveLog.push({
      tick: this.tickCount,
      direction: this.state.direction,
      timestamp: performance.now(),
      position: { x: head.x, y: head.y },
    });

    this.state.lastUpdateTime = performance.now();
    this.notify();
  }

  private moveSnake(): void {
    const head = this.state.snake[0];
    const dirVector = DIRECTION_VECTORS[this.state.direction];

    let newX = head.x + dirVector.x;
    let newY = head.y + dirVector.y;

    // Handle wrapping for endless mode
    if (this.state.gameMode === 'endless') {
      newX = (newX + GRID_WIDTH) % GRID_WIDTH;
      newY = (newY + GRID_HEIGHT) % GRID_HEIGHT;
    }

    const newHead: SnakeSegment = {
      x: newX,
      y: newY,
      prevX: head.x,
      prevY: head.y,
      lerpFactor: 0,
    };

    this.state.snake.unshift(newHead);

    // Don't remove tail if eating food (handled in checkFood)
    const justAte = this.state.food && head.x === this.state.food.position.x && head.y === this.state.food.position.y;
    if (!justAte) {
      this.state.snake.pop();
    }
  }

  private checkCollisions(): void {
    const head = this.state.snake[0];

    // Wall collision (classic mode only)
    if (this.state.gameMode === 'classic') {
      if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        this.gameOver();
        return;
      }
    }

    // Self collision (unless ghost mode active)
    const ghostActive = this.state.activePowerUps.some(
      (p) => p.type === 'ghost-mode' && p.active && p.expiresAt > performance.now()
    );

    if (!ghostActive) {
      for (let i = 1; i < this.state.snake.length; i++) {
        if (head.x === this.state.snake[i].x && head.y === this.state.snake[i].y) {
          this.gameOver();
          return;
        }
      }
    }
  }

  private checkFood(): void {
    if (!this.state.food) return;

    const head = this.state.snake[0];
    if (head.x === this.state.food.position.x && head.y === this.state.food.position.y) {
      this.eatFood();
    }
  }

  private eatFood(): void {
    if (!this.state.food) return;

    // Calculate points
    let points = 10;
    const doublePointsActive = this.state.activePowerUps.some(
      (p) => p.type === 'double-points' && p.active && p.expiresAt > performance.now()
    );
    if (doublePointsActive) points *= POWER_UP_CONFIG['double-points'].scoreMultiplier;

    // Power-up food gives bonus
    if (this.state.food.type !== 'normal') {
      points += 20;
      this.activatePowerUp(this.state.food.type.replace('powerup-', '') as PowerUp['type']);
    }

    this.state.score += points;

    // Update high score
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      this.saveHighScore(this.state.highScore);
    }

    // Speed increase notification (for UI)
    const newSpeedIncreases = Math.floor(this.state.score / this.config.speedIncreaseInterval);
    const oldSpeedIncreases = Math.floor((this.state.score - points) / this.config.speedIncreaseInterval);
    if (newSpeedIncreases > oldSpeedIncreases) {
      // Trigger level up sound/event
    }

    this.spawnFood();
    this.notify();
  }

  private spawnFood(): void {
    let position: GridPosition;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      position = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
      attempts++;
    } while (this.isPositionOccupied(position) && attempts < maxAttempts);

    // Determine food type
    let type: Food['type'] = 'normal';
    const rand = Math.random();

    if (rand < this.config.powerUpSpawnChance / 3) {
      type = 'powerup-slowmo';
    } else if (rand < (this.config.powerUpSpawnChance * 2) / 3) {
      type = 'powerup-double';
    } else if (rand < this.config.powerUpSpawnChance) {
      type = 'powerup-ghost';
    }

    this.state.food = {
      position,
      type,
      spawnTime: performance.now(),
    };
  }

  private isPositionOccupied(pos: GridPosition): boolean {
    return this.state.snake.some((seg) => seg.x === pos.x && seg.y === pos.y);
  }

  private activatePowerUp(type: PowerUp['type']): void {
    const now = performance.now();
    const duration = this.config.powerUpDuration;

    // Remove existing same-type power-up
    this.state.activePowerUps = this.state.activePowerUps.filter((p) => p.type !== type);

    this.state.activePowerUps.push({
      type,
      duration,
      expiresAt: now + duration,
      active: true,
    });
  }

  private updatePowerUps(): void {
    const now = performance.now();
    this.state.activePowerUps = this.state.activePowerUps.map((p) => ({
      ...p,
      active: p.expiresAt > now,
    })).filter((p) => p.expiresAt > now);
  }

  private updateInterpolation(factor: number): void {
    this.state.snake = this.state.snake.map((segment, index) => {
      if (index === 0) {
        // Head: interpolate from previous position
        return {
          ...segment,
          lerpFactor: factor,
        };
      }
      // Body segments: interpolate toward previous segment's previous position
      const prevSegment = this.state.snake[index - 1];
      return {
        ...segment,
        prevX: prevSegment.prevX ?? prevSegment.x,
        prevY: prevSegment.prevY ?? prevSegment.y,
        lerpFactor: factor,
      };
    });
  }

  private gameOver(): void {
    this.state.isPlaying = false;
    this.state.isGameOver = true;
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.notify();
  }

  // ========== PERSISTENCE ==========

  private loadHighScore(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const stored = localStorage.getItem('snake-arena-high-score');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  }

  private saveHighScore(score: number): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('snake-arena-high-score', score.toString());
    } catch {
      // Ignore storage errors
    }
  }

  // ========== CLEANUP ==========

  destroy(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.listeners.clear();
  }
}

// Singleton instance for global access (client-side only)
let engineInstance: SnakeEngine | null = null;

export function getEngine(config?: Partial<GameConfig>): SnakeEngine {
  if (!engineInstance) {
    engineInstance = new SnakeEngine(config);
  }
  return engineInstance;
}

export function resetEngine(): void {
  if (engineInstance) {
    engineInstance.destroy();
    engineInstance = null;
  }
}