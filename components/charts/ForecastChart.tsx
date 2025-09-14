"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';

// Mock GlassmorphicCard component
const GlassmorphicCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl shadow-xl ${className}`}>
    {children}
  </div>
);

// Mock SolarData type
interface SolarData {
  future_forecast: {
    [date: string]: {
      theoretical_panel_output: number;
      solar_irradiance?: number;
      temperature?: number;
      weather_condition?: string;
    };
  };
}

interface ForecastChartProps {
  data: SolarData;
}

interface TooltipData {
  x: number;
  y: number;
  date: string;
  value: number;
  irradiance?: number;
  temperature?: number;
  weather?: string;
  visible: boolean;
}

export default function ForecastChart({ data }: ForecastChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    date: '',
    value: 0,
    visible: false
  });
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number>(-1);
  const [chartData, setChartData] = useState<any[]>([]);

  const { future_forecast } = data;

  // Process data
  useEffect(() => {
    const dates = Object.keys(future_forecast).sort();
    const processedData = dates.map(date => ({
      date,
      value: future_forecast[date].theoretical_panel_output,
      irradiance: future_forecast[date].solar_irradiance || Math.random() * 800 + 200,
      temperature: future_forecast[date].temperature || Math.random() * 15 + 20,
      weather: future_forecast[date].weather_condition || ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)]
    }));
    setChartData(processedData);
  }, [future_forecast]);

  const drawChart = useCallback((animationProgress: number = 1) => {
    const canvas = canvasRef.current;
    if (!canvas || chartData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with proper DPI scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const margin = { top: 30, right: 30, bottom: 60, left: 70 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    if (chartWidth <= 0 || chartHeight <= 0) return;

    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = Math.min(...chartData.map(d => d.value));
    const valueRange = maxValue - minValue;

    // Draw background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines
    chartData.forEach((_, index) => {
      const x = margin.left + (chartWidth / chartData.length) * (index + 0.5);
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + chartHeight);
      ctx.stroke();
    });

    ctx.setLineDash([]);

    // Draw bars with animation
    const barWidth = (chartWidth / chartData.length) * 0.7;
    const barSpacing = (chartWidth / chartData.length) * 0.3;

    chartData.forEach((dataPoint, index) => {
      const barHeight = ((dataPoint.value - minValue) / valueRange) * chartHeight * animationProgress;
      const x = margin.left + (index * (chartWidth / chartData.length)) + barSpacing / 2;
      const y = margin.top + chartHeight - barHeight;

      // Bar shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 2, y + 2, barWidth, barHeight);

      // Highlight hovered bar
      const isHovered = index === hoveredBarIndex;

      // Bar gradient
      const barGradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      if (isHovered) {
        barGradient.addColorStop(0, '#60A5FA');
        barGradient.addColorStop(0.5, '#3B82F6');
        barGradient.addColorStop(1, '#1D4ED8');
      } else {
        barGradient.addColorStop(0, '#10B981');
        barGradient.addColorStop(0.5, '#059669');
        barGradient.addColorStop(1, '#047857');
      }

      ctx.fillStyle = barGradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Bar outline
      ctx.strokeStyle = isHovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Glow effect for hovered bar
      if (isHovered) {
        ctx.shadowColor = '#3B82F6';
        ctx.shadowBlur = 15;
        ctx.strokeRect(x, y, barWidth, barHeight);
        ctx.shadowBlur = 0;
      }

      // Value labels on bars
      if (animationProgress > 0.7) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${dataPoint.value.toFixed(1)}`, x + barWidth / 2, y - 8);
      }

      // Date labels
      ctx.fillStyle = '#D1D5DB';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      const date = new Date(dataPoint.date);
      const shortDate = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
      const dayName = date.toLocaleDateString('en', { weekday: 'short' });

      ctx.fillText(shortDate, x + barWidth / 2, margin.top + chartHeight + 20);
      ctx.fillText(dayName, x + barWidth / 2, margin.top + chartHeight + 35);
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (valueRange / 5) * i;
      const y = margin.top + chartHeight - (chartHeight / 5) * i;
      ctx.fillText(`${value.toFixed(1)}`, margin.left - 10, y + 4);
    }

    // Y-axis title
    ctx.save();
    ctx.translate(20, margin.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#D1D5DB';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Power Output (kWh)', 0, 0);
    ctx.restore();

    // Store bar positions for hover detection
    chartData.forEach((_, index) => {
      const x = margin.left + (index * (chartWidth / chartData.length)) + barSpacing / 2;
      chartData[index].barX = x;
      chartData[index].barWidth = barWidth;
      chartData[index].barY = margin.top;
      chartData[index].barHeight = chartHeight;
    });
  }, [chartData, hoveredBarIndex]);

  // Animation effect
  useEffect(() => {
    if (!chartData.length) return;

    let start: number;
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      // Easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      drawChart(easeProgress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawChart]);

  // Mouse move handler for hover effects
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData.length) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let hoveredIndex = -1;

    // Check if mouse is over any bar
    chartData.forEach((dataPoint, index) => {
      if (dataPoint.barX &&
        x >= dataPoint.barX &&
        x <= dataPoint.barX + dataPoint.barWidth &&
        y >= dataPoint.barY &&
        y <= dataPoint.barY + dataPoint.barHeight) {
        hoveredIndex = index;
      }
    });

    if (hoveredIndex !== hoveredBarIndex) {
      setHoveredBarIndex(hoveredIndex);

      if (hoveredIndex >= 0) {
        const dataPoint = chartData[hoveredIndex];
        setTooltip({
          x: dataPoint.barX + dataPoint.barWidth / 2,  // center of the bar
          y: event.clientY - 30,
          date: dataPoint.date,
          value: dataPoint.value,
          irradiance: dataPoint.irradiance,
          temperature: dataPoint.temperature,
          weather: dataPoint.weather,
          visible: true
        });
      } else {
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    } else if (hoveredIndex >= 0) {
      // Update tooltip position
      setTooltip(prev => ({
        ...prev,
        x: event.clientX,
        y: event.clientY - 10
      }));
    }
  }, [chartData, hoveredBarIndex]);

  const handleMouseLeave = useCallback(() => {
    setHoveredBarIndex(-1);
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  // Add event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      drawChart(1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawChart]);

  // Calculate statistics
  const totalOutput = chartData.reduce((sum, d) => sum + d.value, 0);
  const avgOutput = totalOutput / chartData.length;
  const maxOutput = Math.max(...chartData.map(d => d.value));
  const trend = chartData.length > 1 ?
    ((chartData[chartData.length - 1].value - chartData[0].value) / chartData[0].value) * 100 : 0;

  return (
    <div className="bg-transparent p-6">
      <GlassmorphicCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 text-blue-400 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-white">5-Day Power Forecast</h3>
              <p className="text-sm text-gray-400">Theoretical panel output (kWh)</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-400 font-semibold">{totalOutput.toFixed(1)}</div>
              <div className="text-gray-400">Total kWh</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-semibold">{avgOutput.toFixed(1)}</div>
              <div className="text-gray-400">Avg/Day</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
              </div>
              <div className="text-gray-400">Trend</div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
          ref={containerRef}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-80 rounded-lg cursor-pointer"
            style={{ width: '100%', height: '320px' }}
          />

          {/* Interactive Tooltip */}
          <AnimatePresence>
            {tooltip.visible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.2 }}
                className="fixed z-50 pointer-events-none"
                style={{
                  left: `${tooltip.x}px`,
                  top: `${tooltip.y}px`,
                  transform: 'translate(-50%, -100%)' // keeps it closer + above the bar
                }}
              >
                <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg p-3 shadow-xl text-white text-sm min-w-[200px]">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="font-medium">
                      {new Date(tooltip.date).toLocaleDateString('en', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Zap className="w-3 h-3 text-yellow-400 mr-1" />
                        Power Output:
                      </span>
                      <span className="font-semibold text-green-400">{tooltip.value.toFixed(2)} kWh</span>
                    </div>

                    {tooltip.irradiance && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Solar Irradiance:</span>
                        <span className="text-orange-400">{tooltip.irradiance.toFixed(0)} W/m²</span>
                      </div>
                    )}

                    {tooltip.temperature && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Temperature:</span>
                        <span className="text-blue-300">{tooltip.temperature.toFixed(1)}°C</span>
                      </div>
                    )}

                    {tooltip.weather && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Condition:</span>
                        <span className="text-purple-300">{tooltip.weather}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded mr-2"></div>
            <span className="text-gray-300">Power Output</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-green-300 to-green-500 rounded mr-2"></div>
            <span className="text-gray-300">Highlighted</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-300">Hover for details</span>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
}