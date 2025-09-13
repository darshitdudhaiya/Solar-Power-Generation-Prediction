"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/glassmorphic-card';
import { SolarData } from '@/lib/types';

interface WeatherImpactChartProps {
  data: SolarData;
}

export default function WeatherImpactChart({ data }: WeatherImpactChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { raw_data } = data;

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

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Data preparation
    const hourlyData = raw_data.historical_hourly_output.filter(item => item.predicted_solar_output_kwh > 0);
    const maxOutput = Math.max(...hourlyData.map(item => item.predicted_solar_output_kwh));
    const maxCloudCover = 100;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + chartWidth, y);
      ctx.stroke();
    }

    // Draw scatter points
    hourlyData.forEach((item, index) => {
      const x = margin.left + (item.cloud_cover / maxCloudCover) * chartWidth;
      const y = margin.top + chartHeight - (item.predicted_solar_output_kwh / maxOutput) * chartHeight;
      
      // Color based on cloud cover
      const cloudPercent = item.cloud_cover / 100;
      const alpha = 0.7;
      const color = `rgba(${Math.floor(255 * cloudPercent)}, ${Math.floor(100 + 155 * (1 - cloudPercent))}, ${Math.floor(255 * (1 - cloudPercent))}, ${alpha})`;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw trend line (approximate)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left + chartWidth, margin.top + 20);
    ctx.lineTo(margin.left + 20, margin.top + chartHeight - 20);
    ctx.stroke();

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '10px Inter';
    
    // X-axis
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const value = (100 / 5) * i;
      const x = margin.left + (chartWidth / 5) * i;
      ctx.fillText(`${value}%`, x, height - 10);
    }

    // Y-axis
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxOutput / 5) * i;
      const y = margin.top + chartHeight - (chartHeight / 5) * i;
      ctx.fillText(`${value.toFixed(1)}`, margin.left - 10, y + 3);
    }

    // Labels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Cloud Cover (%)', width / 2, height - 5);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Power Output (kWh)', 0, 0);
    ctx.restore();

  }, [raw_data]);

  return (
    <GlassmorphicCard className="p-6">
      <div className="flex items-center mb-6">
        <Cloud className="w-6 h-6 text-blue-400 mr-3" />
        <div>
          <h3 className="text-xl font-semibold">Weather Impact Analysis</h3>
          <p className="text-sm text-gray-400">Cloud cover vs power output correlation</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-64 rounded-lg"
          style={{ width: '100%', height: '256px' }}
        />
      </motion.div>

      <div className="flex items-center justify-center mt-4 space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
          <span className="text-gray-400">Low Cloud Cover</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
          <span className="text-gray-400">High Cloud Cover</span>
        </div>
      </div>
    </GlassmorphicCard>
  );
}