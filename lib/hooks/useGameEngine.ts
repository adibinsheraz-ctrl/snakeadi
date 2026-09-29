/**
 * React hook for the Snake game engine
 * Provides reactive state and controls
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Direction, GameMode, Difficulty } from '@/lib/game/types';
import { SnakeEngine, getEngine } from '@/lib/game/engine';

export function useGameEngine() {
  const [state, setState] = useState<GameState>(() => {
    if (typeof window === 'undefined') {
      return getEngine().getState();
    }
    return getEngine().getState();
  });
  const engineRef = useRef<SnakeEngine | null>(null);
  const initializedRef = useRef(false);

  // Initialize engine
  useEffect(() => {
    engineRef.current = getEngine();
    initializedRef.current = true;

    const unsubscribe = engineRef.current.subscribe(setState);
    return unsubscribe;
  }, []);

  // Game controls
  const start = useCallback((gameMode: GameMode = 'classic', difficulty: Difficulty = 'normal') => {
    engineRef.current?.start(gameMode, difficulty);
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    engineRef.current?.resume();
  }, []);

  const restart = useCallback(() => {
    engineRef.current?.restart();
  }, []);

  const setDirection = useCallback((direction: Direction) => {
    engineRef.current?.setDirection(direction);
  }, []);

  const setGameMode = useCallback((mode: GameMode) => {
    engineRef.current?.setGameMode(mode);
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    engineRef.current?.setDifficulty(difficulty);
  }, []);

  const setCameraView = useCallback((view: GameState['cameraView']) => {
    engineRef.current?.setCameraView(view);
  }, []);

  const toggleSound = useCallback(() => {
    engineRef.current?.toggleSound();
  }, []);

  const toggleHaptics = useCallback(() => {
    engineRef.current?.toggleHaptics();
  }, []);

  const setReducedMotion = useCallback((enabled: boolean) => {
    engineRef.current?.setReducedMotion(enabled);
  }, []);

  const setColorblindMode = useCallback((enabled: boolean) => {
    engineRef.current?.setColorblindMode(enabled);
  }, []);

  const setSkin = useCallback((skinId: string) => {
    engineRef.current?.setSkin(skinId);
  }, []);

  const setTheme = useCallback((themeId: string) => {
    engineRef.current?.setTheme(themeId);
  }, []);

  const getMoveLog = useCallback(() => {
    return engineRef.current?.getMoveLog() ?? [];
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setDirection('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setDirection('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setDirection('right');
          break;
        case ' ':
        case 'Escape':
          e.preventDefault();
          if (state.isPlaying && !state.isPaused) {
            pause();
          } else if (state.isPaused) {
            resume();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isPlaying, state.isPaused, setDirection, pause, resume]);

  // Touch/swipe controls
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const threshold = 30; // minimum swipe distance

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > threshold) {
        setDirection(dx > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(dy) > threshold) {
        setDirection(dy > 0 ? 'down' : 'up');
      }
    }

    touchStartRef.current = null;
  }, [setDirection]);

  // Gamepad support
  useEffect(() => {
    const gamepadPoll = () => {
      const gamepads = navigator.getGamepads();
      for (const gp of gamepads) {
        if (!gp) continue;

        const deadzone = 0.5;
        const axes = gp.axes;

        // D-pad / left stick
        if (axes[1] < -deadzone) setDirection('up');
        else if (axes[1] > deadzone) setDirection('down');
        else if (axes[0] < -deadzone) setDirection('left');
        else if (axes[0] > deadzone) setDirection('right');

        // Buttons: A (0) = pause/resume, Start (9) = start
        if (gp.buttons[0]?.pressed && state.isPlaying && !state.isPaused) pause();
        else if (gp.buttons[0]?.pressed && state.isPaused) resume();
        if (gp.buttons[9]?.pressed && !state.isPlaying && !state.isGameOver) start();
      }
      requestAnimationFrame(gamepadPoll);
    };

    if ('getGamepads' in navigator) {
      requestAnimationFrame(gamepadPoll);
    }
  }, [state.isPlaying, state.isPaused, state.isGameOver, setDirection, pause, resume, start]);

  // Haptic feedback
  const triggerHaptic = useCallback((pattern: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!state.hapticsEnabled) return;
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30],
      };
      navigator.vibrate(patterns[pattern]);
    }
  }, [state.hapticsEnabled]);

  return {
    state,
    // Controls
    start,
    pause,
    resume,
    restart,
    setDirection,
    setGameMode,
    setDifficulty,
    setCameraView,
    toggleSound,
    toggleHaptics,
    setReducedMotion,
    setColorblindMode,
    setSkin,
    setTheme,
    getMoveLog,
    // Touch handlers
    handleTouchStart,
    handleTouchEnd,
    // Haptics
    triggerHaptic,
  };
}