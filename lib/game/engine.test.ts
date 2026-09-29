import { describe, it, expect, beforeEach } from 'vitest';
import { SnakeEngine } from '@/lib/game/engine';
import type { GameState } from '@/lib/game/types';

describe('SnakeEngine', () => {
  let engine: SnakeEngine;

  beforeEach(() => {
    engine = new SnakeEngine();
  });

  describe('initialization', () => {
    it('should create engine with default config', () => {
      const state = engine.getState();
      expect(state).toBeDefined();
      expect(state.snake).toHaveLength(3);
      expect(state.isPlaying).toBe(false);
      expect(state.score).toBe(0);
    });

    it('should have correct initial snake position', () => {
      const state = engine.getState();
      expect(state.snake[0]).toEqual({ x: 10, y: 10, prevX: 10, prevY: 10, lerpFactor: 0 });
    });

    it('should start game in paused state', () => {
      const state = engine.getState();
      expect(state.isPaused).toBe(false);
      expect(state.isGameOver).toBe(false);
    });
  });

  describe('game controls', () => {
    it('should start game with specified mode and difficulty', () => {
      engine.start('classic', 'normal');
      const state = engine.getState();
      expect(state.isPlaying).toBe(true);
      expect(state.gameMode).toBe('classic');
      expect(state.difficulty).toBe('normal');
    });

    it('should pause and resume game', () => {
      engine.start();
      engine.pause();
      expect(engine.getState().isPaused).toBe(true);

      engine.resume();
      expect(engine.getState().isPaused).toBe(false);
    });

    it('should prevent 180-degree turns', () => {
      engine.start();
      engine.setDirection('right');
      engine.setDirection('left'); // Should be ignored
      expect(engine.getState().direction).toBe('right');
    });
  });

  describe('settings', () => {
    it('should toggle sound', () => {
      let state = engine.getState();
      const initialSound = state.soundEnabled;

      engine.toggleSound();
      state = engine.getState();
      expect(state.soundEnabled).toBe(!initialSound);
    });

    it('should toggle haptics', () => {
      let state = engine.getState();
      const initialHaptics = state.hapticsEnabled;

      engine.toggleHaptics();
      state = engine.getState();
      expect(state.hapticsEnabled).toBe(!initialHaptics);
    });

    it('should set reduced motion', () => {
      engine.setReducedMotion(true);
      expect(engine.getState().reducedMotion).toBe(true);

      engine.setReducedMotion(false);
      expect(engine.getState().reducedMotion).toBe(false);
    });

    it('should set colorblind mode', () => {
      engine.setColorblindMode(true);
      const state = engine.getState();
      expect(state.colorblindMode).toBe(true);
      expect(state.currentTheme).toBe('colorblind');
    });
  });

  describe('skin and theme system', () => {
    it('should only allow unlocked skins', () => {
      engine.setSkin('neon');
      expect(engine.getState().currentSkin).not.toBe('neon');

      engine.setSkin('classic');
      expect(engine.getState().currentSkin).toBe('classic');
    });

    it('should only allow unlocked themes', () => {
      engine.setTheme('synthwave');
      expect(engine.getState().currentTheme).not.toBe('synthwave');

      engine.setTheme('dark');
      expect(engine.getState().currentTheme).toBe('dark');
    });
  });

  describe('subscriptions', () => {
    it('should notify subscribers on state change', () => {
      let callCount = 0;
      const unsubscribe = engine.subscribe(() => {
        callCount++;
      });

      engine.toggleSound();
      expect(callCount).toBeGreaterThan(0);

      unsubscribe();
      const previousCount = callCount;
      engine.toggleHaptics();
      expect(callCount).toBe(previousCount);
    });
  });

  describe('cleanup', () => {
    it('should properly destroy engine', () => {
      engine.start();
      engine.destroy();
      // After destroy, state should still be accessible but no updates
      expect(engine.getState()).toBeDefined();
    });
  });
});