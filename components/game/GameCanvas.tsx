'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useGameEngine } from '@/lib/hooks/useGameEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Zap, Pause, Play, RotateCcw, Settings, Menu } from 'lucide-react';

export function GameCanvas() {
  const {
    state,
    start,
    pause,
    resume,
    restart,
    setDirection,
    setGameMode,
    setDifficulty,
    setCameraView,
    setSkin,
    setTheme,
    toggleSound,
    toggleHaptics,
    setColorblindMode,
    setReducedMotion,
    triggerHaptic,
  } = useGameEngine();

  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const threshold = 30;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > threshold) {
        setDirection(dx > 0 ? 'right' : 'left');
        triggerHaptic('light');
      }
    } else {
      if (Math.abs(dy) > threshold) {
        setDirection(dy > 0 ? 'down' : 'up');
        triggerHaptic('light');
      }
    }

    touchStartRef.current = null;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

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

  return (
    <div
      className="relative w-full h-screen bg-black text-white overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 15, 15], fov: 50 }} dpr={[1, 2]}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[0, 0, 0]} intensity={2} color="#a855f7" />

          {/* Grid background */}
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#0f172a" roughness={1} metalness={0} />
          </mesh>

          {/* Grid lines */}
          <gridHelper args={[30, 30]} position={[0, 0, 0]} />

          <Environment preset="night" />
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Game Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Top HUD */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/70 backdrop-blur border border-white/20 rounded-lg p-4"
          >
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {state.score}
            </div>
            <div className="text-xs text-white/60 mt-1">
              High: {state.highScore}
            </div>
            {state.gameMode === 'time-attack' && (
              <div className="text-xs text-white/60 mt-1">
                Time: {Math.ceil(state.timeRemaining / 1000)}s
              </div>
            )}
          </motion.div>

          {/* Game Status */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/70 backdrop-blur border border-white/20 rounded-lg p-3 text-sm text-center"
          >
            <div className="font-bold capitalize">
              {state.gameMode.replace('-', ' ')}
            </div>
            <div className="text-xs text-white/60 capitalize">
              {state.difficulty}
            </div>
          </motion.div>

          {/* Control Buttons */}
          <div className="flex gap-2 pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="bg-black/70 backdrop-blur border border-white/20 rounded-lg p-3 hover:border-white/40 transition"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSound}
              className="bg-black/70 backdrop-blur border border-white/20 rounded-lg p-3 hover:border-white/40 transition"
            >
              {state.soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Center Controls */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!state.isPlaying ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => start(state.gameMode, state.difficulty)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-purple-500/50 transition transform hover:scale-105 pointer-events-auto"
            >
              ▶ Start Game
            </motion.button>
          ) : state.isPaused ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 pointer-events-auto"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={resume}
                className="px-6 py-3 bg-green-600 rounded-full font-bold hover:bg-green-500 transition"
              >
                <Play className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={restart}
                className="px-6 py-3 bg-red-600 rounded-full font-bold hover:bg-red-500 transition"
              >
                <RotateCcw className="w-6 h-6" />
              </motion.button>
            </motion.div>
          ) : null}
        </div>

        {/* Bottom Mobile Controls */}
        <div className="absolute bottom-4 left-4 right-4 md:hidden pointer-events-auto">
          <div className="grid grid-cols-3 gap-2 bg-black/70 backdrop-blur border border-white/20 rounded-lg p-4">
            <div></div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDirection('up');
                triggerHaptic('light');
              }}
              className="bg-white/10 hover:bg-white/20 rounded-lg py-2 text-xl transition"
            >
              ↑
            </motion.button>
            <div></div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDirection('left');
                triggerHaptic('light');
              }}
              className="bg-white/10 hover:bg-white/20 rounded-lg py-2 text-xl transition"
            >
              ←
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (state.isPlaying && !state.isPaused) pause();
                else if (state.isPaused) resume();
              }}
              className="bg-white/10 hover:bg-white/20 rounded-lg py-2 text-xl transition"
            >
              {state.isPaused ? '▶' : '⏸'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDirection('right');
                triggerHaptic('light');
              }}
              className="bg-white/10 hover:bg-white/20 rounded-lg py-2 text-xl transition"
            >
              →
            </motion.button>
            <div></div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDirection('down');
                triggerHaptic('light');
              }}
              className="bg-white/10 hover:bg-white/20 rounded-lg py-2 text-xl transition col-span-3"
            >
              ↓
            </motion.button>
          </div>
        </div>

        {/* Game Over Screen */}
        <AnimatePresence>
          {state.isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center pointer-events-auto z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Game Over
                </h2>
                <div className="text-4xl font-bold mb-6">Score: {state.score}</div>
                <div className="mb-6 text-white/70">
                  High Score: {state.highScore}
                </div>
                <div className="flex gap-4 justify-center mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={restart}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold hover:shadow-xl transition"
                  >
                    Play Again
                  </motion.button>
                </div>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  maxLength={30}
                  className="w-full max-w-xs px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 mb-4 focus:outline-none focus:border-white/40"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Submit score to leaderboard
                      console.log('Score submitted:', state.score);
                    }
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="absolute top-0 left-0 bottom-0 w-80 bg-black/95 backdrop-blur border-r border-white/20 z-40 overflow-y-auto pointer-events-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-xl">
                  ✕
                </button>
              </div>

              {/* Game Mode */}
              <div>
                <h4 className="font-bold mb-2">Game Mode</h4>
                <div className="space-y-1">
                  {(['classic', 'endless', 'time-attack'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setGameMode(mode)}
                      className={`w-full text-left px-3 py-2 rounded transition ${
                        state.gameMode === mode
                          ? 'bg-purple-600'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <h4 className="font-bold mb-2">Difficulty</h4>
                <div className="space-y-1">
                  {(['easy', 'normal', 'hard', 'expert'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                        state.difficulty === diff
                          ? 'bg-green-600'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera */}
              <div>
                <h4 className="font-bold mb-2">Camera</h4>
                <div className="space-y-1">
                  {(['top-down', 'angled-3d'] as const).map((view) => (
                    <button
                      key={view}
                      onClick={() => setCameraView(view)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                        state.cameraView === view
                          ? 'bg-blue-600'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {view === 'top-down' ? 'Top View' : '3D View'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessibility */}
              <div>
                <h4 className="font-bold mb-2">Accessibility</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.reducedMotion}
                      onChange={(e) => setReducedMotion(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Reduced Motion</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.colorblindMode}
                      onChange={(e) => setColorblindMode(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Colorblind Mode</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.hapticsEnabled}
                      onChange={(e) => toggleHaptics()}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Haptic Feedback</span>
                  </label>
                </div>
              </div>

              {/* Skins */}
              <div>
                <h4 className="font-bold mb-2">Skins ({state.unlockedSkins.length}/6)</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {state.unlockedSkins.map((skinId) => (
                    <button
                      key={skinId}
                      onClick={() => setSkin(skinId)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition capitalize ${
                        state.currentSkin === skinId
                          ? 'bg-yellow-600'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {skinId}
                    </button>
                  ))}
                </div>
              </div>

              {/* Themes */}
              <div>
                <h4 className="font-bold mb-2">Themes ({state.unlockedThemes.length}/6)</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {state.unlockedThemes.map((themeId) => (
                    <button
                      key={themeId}
                      onClick={() => setTheme(themeId)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition capitalize ${
                        state.currentTheme === themeId
                          ? 'bg-cyan-600'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {themeId}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}