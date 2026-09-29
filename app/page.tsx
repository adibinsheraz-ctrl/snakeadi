'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Hero } from '@/components/landing/Hero';
import { motion } from 'framer-motion';

export default function Home() {
  const gameRef = useRef<HTMLDivElement>(null);

  const scrollToGame = () => {
    gameRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <Hero onPlayClick={scrollToGame} />
      </section>

      {/* Game Preview Section */}
      <section ref={gameRef} className="relative min-h-screen w-full bg-gradient-to-b from-black via-purple-950 to-black px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Three Game Modes
            </h2>
            <p className="text-xl text-white/70">Master classic gameplay, endless runs, or time-attack challenges</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Classic',
                desc: 'Traditional snake with walls',
                color: 'from-green-400 to-emerald-600',
              },
              {
                title: 'Endless',
                desc: 'Wrap around edges forever',
                color: 'from-blue-400 to-cyan-600',
              },
              {
                title: 'Time Attack',
                desc: '90 seconds of pure speed',
                color: 'from-orange-400 to-red-600',
              },
            ].map((mode, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 backdrop-blur hover:border-white/40 transition"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${mode.color} mb-4`} />
                <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
                <p className="text-white/60">{mode.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative min-h-screen w-full bg-black px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Premium Features
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🎮',
                title: 'Multiple Controls',
                desc: 'Keyboard, touch swipes, and gamepad support. Mobile-optimized with thumb-friendly layout.',
              },
              {
                icon: '🎨',
                title: '6 Unlockable Skins',
                desc: 'Classic, Neon, Inferno, Frostbite, Gold, and Rainbow. Unlock through score milestones.',
              },
              {
                icon: '🌍',
                title: 'Real-time Leaderboard',
                desc: 'Daily, weekly, and all-time rankings. Server-validated with anti-cheat protection.',
              },
              {
                icon: '✨',
                title: 'Power-ups',
                desc: 'Slow-mo, Double Points, and Ghost Mode. Strategic gameplay enhancement.',
              },
              {
                icon: '♿',
                title: 'Full Accessibility',
                desc: 'Keyboard navigation, screen reader support, colorblind mode, reduced motion.',
              },
              {
                icon: '⚡',
                title: 'High Performance',
                desc: '90+ Lighthouse score. Runs smooth at 60+ FPS even on older devices.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="flex gap-4 p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl backdrop-blur hover:border-white/40 transition"
              >
                <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                  <p className="text-white/60 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skins Showcase */}
      <section className="relative min-h-screen w-full bg-gradient-to-b from-black via-purple-950 to-black px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Unlockable Skins
            </h2>
            <p className="text-xl text-white/70">Earn through gameplay milestones</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Classic Green', score: '0 pts', color: '#22c55e' },
              { name: 'Neon Pulse', score: '500 pts', color: '#a855f7' },
              { name: 'Inferno', score: '1,500 pts', color: '#ef4444' },
              { name: 'Frostbite', score: '3,000 pts', color: '#06b6d4' },
              { name: 'Golden Legend', score: '5,000 pts', color: '#fbbf24' },
              { name: 'Prism', score: '10,000 pts', color: '#ec4899' },
            ].map((skin, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative group"
              >
                <div
                  className="w-full aspect-square rounded-2xl border-2 border-white/20 flex items-center justify-center text-4xl font-bold group-hover:border-white/60 transition cursor-pointer"
                  style={{ backgroundColor: `${skin.color}20`, borderColor: `${skin.color}60` }}
                >
                  🐍
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-lg">{skin.name}</h3>
                  <p className="text-white/60 text-sm">{skin.score}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative min-h-screen w-full bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Ready to Play?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Jump into the arena and compete for the top spot on the leaderboard.
          </p>
          <button
            onClick={() => window.location.href = '/game'}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-purple-500/50 transition transform hover:scale-105"
          >
            Start Playing Now
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60 mb-2">Built by Adi Binsheraz</p>
          <a
            href="https://instagram.com/adibinsheraz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            @adibinsheraz
          </a>
        </div>
      </footer>
    </main>
  );
}