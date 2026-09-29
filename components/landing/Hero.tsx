'use client';
import { Snake3DScene } from '../game/Snake3D';
import { motion } from 'framer-motion';

interface HeroProps {
  onPlayClick?: () => void;
}

export function Hero({ onPlayClick }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Snake3DScene />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-6"
        >
          <motion.h1
            className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            SNAKE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">ARENA</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-xl md:text-2xl text-white/80 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Built by Adi Binsheraz
          </motion.p>
          <motion.button
            onClick={onPlayClick}
            className="inline-block mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:shadow-xl hover:shadow-purple-500/50 transition transform hover:scale-105"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
