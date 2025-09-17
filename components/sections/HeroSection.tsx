"use client";

import { motion } from 'framer-motion';
import { ArrowDown, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          <Sun className="w-24 h-24 mx-auto mb-8 text-yellow-400 animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text text-transparent"
        >
          AI-Powered
          <br />
          <span className="text-white">Solar Prediction</span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-md md:text-xl text-gray-300 mb-12 leading-relaxed"
        >
          Discover how much solar energy you can generate at your location
          <br />
          powered by AI, real data, and intelligent forecasting.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Button
            onClick={scrollToContent}
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 text-white px-12 py-6 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
          >
            Try the Demo
            <ArrowDown className="ml-2 w-5 h-5" />
          </Button>
          {/* Optional Product Hunt badge */}
          <div className="mt-6">
            <a
              href="https://www.producthunt.com/products/solarcast?launch=solarcast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              🚀 We’re live on Product Hunt
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl"
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-48 h-48 bg-green-500/10 rounded-full blur-xl"
        animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}
