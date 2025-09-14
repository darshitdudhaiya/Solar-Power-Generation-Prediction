"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Zap } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/glassmorphic-card';
import { SolarData } from '@/lib/types';

interface OptimizationChartProps {
  data: SolarData;
}

export default function OptimizationChart({ data }: OptimizationChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { optimization_recommendations } = data;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const margin = { top: 20, right: 40, bottom: 60, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Data
    const current = optimization_recommendations.current_annual_output;
    const optimal = optimization_recommendations.optimal_annual_output;
    const maxValue = Math.max(current, optimal) * 1.1;

    const barWidth = chartWidth / 3;
    const spacing = chartWidth / 6;

    // Current system bar
    const currentBarHeight = (current / maxValue) * chartHeight;
    const currentX = margin.left + spacing;
    const currentY = margin.top + chartHeight - currentBarHeight;

    // Current bar gradient
    const currentGradient = ctx.createLinearGradient(0, currentY, 0, currentY + currentBarHeight);
    currentGradient.addColorStop(0, '#EF4444');
    currentGradient.addColorStop(1, '#DC2626');

    ctx.fillStyle = currentGradient;
    ctx.fillRect(currentX, currentY, barWidth, currentBarHeight);

    // Optimal system bar
    const optimalBarHeight = (optimal / maxValue) * chartHeight;
    const optimalX = margin.left + spacing + barWidth + spacing;
    const optimalY = margin.top + chartHeight - optimalBarHeight;

    // Optimal bar gradient
    const optimalGradient = ctx.createLinearGradient(0, optimalY, 0, optimalY + optimalBarHeight);
    optimalGradient.addColorStop(0, '#10B981');
    optimalGradient.addColorStop(1, '#059669');

    ctx.fillStyle = optimalGradient;
    ctx.fillRect(optimalX, optimalY, barWidth, optimalBarHeight);

    // Bar outlines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(currentX, currentY, barWidth, currentBarHeight);
    ctx.strokeRect(optimalX, optimalY, barWidth, optimalBarHeight);

    // Value labels on bars
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';

    ctx.fillText(`${current.toFixed(1)} kWh`, currentX + barWidth / 2, currentY - 10);
    ctx.fillText(`${optimal.toFixed(1)} kWh`, optimalX + barWidth / 2, optimalY - 10);

    // Bar labels
    ctx.font = '12px Inter';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText('Current System', currentX + barWidth / 2, margin.top + chartHeight + 25);
    ctx.fillText('Optimized System', optimalX + barWidth / 2, margin.top + chartHeight + 25);

    // Improvement arrow and label
    const arrowStartX = currentX + barWidth + 10;
    const arrowEndX = optimalX - 10;
    const arrowY = margin.top + chartHeight / 2;

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(arrowStartX, arrowY);
    ctx.lineTo(arrowEndX, arrowY);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(arrowEndX - 10, arrowY - 5);
    ctx.lineTo(arrowEndX, arrowY);
    ctx.lineTo(arrowEndX - 10, arrowY + 5);
    ctx.stroke();

    // Improvement percentage
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    const improvementText = `+${optimization_recommendations.improvement_percentage.toFixed(1)}%`;
    ctx.fillText(improvementText, (arrowStartX + arrowEndX) / 2, arrowY - 15);

    // Y-axis
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * i;
      const y = margin.top + chartHeight - (chartHeight / 5) * i;
      ctx.fillText(`${value.toFixed(0)}`, margin.left - 10, y + 3);
    }

    // Y-axis title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter';
    ctx.save();
    ctx.translate(20, margin.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Annual Output (kWh)', 0, 0);
    ctx.restore();

  }, [optimization_recommendations]);

  return (
    <GlassmorphicCard className="p-6">
      <div className="flex items-center mb-6">
        <Target className="w-6 h-6 text-green-400 mr-3" />
        <div>
          <h3 className="text-xl font-semibold">Optimization Comparison</h3>
          <p className="text-sm text-gray-400">Current vs optimized system performance</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-80 rounded-lg"
          style={{ width: '100%', height: '320px' }}
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-3 gap-4 mt-6 text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center mb-2">
            <Zap className="w-4 h-4 text-red-400 mr-1" />
            <p className="text-sm text-gray-400">Current Annual Output</p>
          </div>
          <p className="text-lg font-bold text-red-400">
            {optimization_recommendations.current_annual_output.toFixed(1)} kWh
          </p>
        </motion.div>

        <motion.div
          className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <p className="text-sm text-gray-400">Potential Improvement</p>
          </div>
          <p className="text-lg font-bold text-green-400">
            +{optimization_recommendations.improvement_kwh.toFixed(1)} kWh
          </p>
        </motion.div>

        <motion.div
          className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center mb-2">
            <Target className="w-4 h-4 text-green-400 mr-1" />
            <p className="text-sm text-gray-400">Optimal Annual Output</p>
          </div>
          <p className="text-lg font-bold text-green-400">
            {optimization_recommendations.optimal_annual_output.toFixed(1)} kWh
          </p>
        </motion.div>
      </motion.div>
    </GlassmorphicCard>
  );
}