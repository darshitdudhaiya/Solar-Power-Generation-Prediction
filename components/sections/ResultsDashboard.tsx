"use client";

import { motion } from 'framer-motion';
import PerformanceCards from '@/components/charts/PerformanceCards';
import ForecastChart from '@/components/charts/ForecastChart';
import WeatherImpactChart from '@/components/charts/WeatherImpactChart';
import OptimizationChart from '@/components/charts/OptimizationChart';
import { SolarData } from '@/lib/types';

interface ResultsDashboardProps {
  data: SolarData;
}

export default function ResultsDashboard({ data }: ResultsDashboardProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Solar Analysis Results
        </h2>
        <p className="text-gray-300 text-lg">
          Comprehensive insights into your solar power potential
        </p>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <PerformanceCards data={data} />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <ForecastChart data={data} />
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <WeatherImpactChart data={data} />
        </motion.div>
      </div>

      {/* Optimization Analysis */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <OptimizationChart data={data} />
      </motion.div>
    </div>
  );
}