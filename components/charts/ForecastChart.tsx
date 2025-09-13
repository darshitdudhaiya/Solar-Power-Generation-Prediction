"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/glassmorphic-card';
import { SolarData } from '@/lib/types';

interface ForecastChartProps {
  data: SolarData;
}

export default function ForecastChart({ data }: ForecastChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { future_forecast } = data;

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

    // Data preparation
    const dates = Object.keys(future_forecast).sort();
    const values = dates.map(date => future_forecast[date].theoretical_panel_output);
    const maxValue = Math.max(...values);

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(margin.left, margin.top, chartWidth, chartHeight);

    // Draw bars
    const barWidth = chartWidth / dates.length * 0.8;
    const barSpacing = chartWidth / dates.length * 0.2;

    dates.forEach((date, index) => {
      const value = values[index];
      const barHeight = (value / maxValue) * chartHeight;
      const x = margin.left + (index * (barWidth + barSpacing)) + barSpacing / 2;
      const y = margin.top + chartHeight - barHeight;

      // Bar gradient
      const barGradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      barGradient.addColorStop(0, '#3B82F6');
      barGradient.addColorStop(1, '#10B981');

      ctx.fillStyle = barGradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Bar outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Date labels
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      const shortDate = new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' });
      ctx.fillText(shortDate, x + barWidth / 2, height - 10);

      // Value labels
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px Inter';
      ctx.fillText(`${value.toFixed(1)}`, x + barWidth / 2, y - 5);
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * i;
      const y = margin.top + chartHeight - (chartHeight / 5) * i;
      ctx.fillText(`${value.toFixed(1)}`, margin.left - 10, y + 3);
    }

  }, [future_forecast]);

  return (
    <GlassmorphicCard className="p-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="w-6 h-6 text-blue-400 mr-3" />
        <div>
          <h3 className="text-xl font-semibold">5-Day Power Forecast</h3>
          <p className="text-sm text-gray-400">Theoretical panel output (kWh)</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-64 rounded-lg"
          style={{ width: '100%', height: '256px' }}
        />
      </motion.div>
    </GlassmorphicCard>
  );
}