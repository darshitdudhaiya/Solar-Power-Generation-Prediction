"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, Thermometer, Eye, TrendingDown } from 'lucide-react';

// Mock GlassmorphicCard component
const GlassmorphicCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl shadow-xl ${className}`}>
    {children}
  </div>
);

// Mock SolarData type
interface SolarData {
  raw_data: {
    historical_hourly_output: Array<{
      predicted_solar_output_kwh: number;
      cloud_cover: number;
      temperature?: number;
      time?: string;
      weather_condition?: string;
      solar_irradiance?: number;
    }>;
  };
}

interface WeatherImpactChartProps {
  data: SolarData;
}

interface TooltipData {
  x: number;
  y: number;
  cloudCover: number;
  output: number;
  temperature?: number;
  time?: string;
  weather?: string;
  irradiance?: number;
  visible: boolean;
}

interface DataPoint {
  x: number;
  y: number;
  cloudCover: number;
  output: number;
  temperature?: number;
  time?: string;
  weather?: string;
  irradiance?: number;
  color: string;
  size: number;
}

export default function WeatherImpactChart({ data }: WeatherImpactChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    cloudCover: 0,
    output: 0,
    visible: false
  });
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number>(-1);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);

  const { raw_data } = data;

  // Process data
  useEffect(() => {
    const hourlyData = raw_data.historical_hourly_output.filter(item =>
      item.predicted_solar_output_kwh > 0 && item.cloud_cover !== undefined
    );

    if (hourlyData.length === 0) return;

    const processedData: DataPoint[] = hourlyData.map((item, index) => {
      const cloudPercent = item.cloud_cover / 100;
      const temperature = item.temperature || Math.random() * 15 + 20;
      const weather = item.weather_condition || ['Clear', 'Partly Cloudy', 'Cloudy', 'Overcast'][Math.floor(cloudPercent * 4)];
      const irradiance = item.solar_irradiance || (1000 * (1 - cloudPercent) + Math.random() * 200);

      // Color based on cloud cover and output efficiency
      const efficiency = item.predicted_solar_output_kwh / (irradiance / 1000 * 0.2); // Rough efficiency calc
      const r = Math.floor(255 * cloudPercent + 60);
      const g = Math.floor(200 * (1 - cloudPercent) + 55);
      const b = Math.floor(255 * (1 - cloudPercent) + 100 * efficiency);

      return {
        x: 0, // Will be calculated in drawChart
        y: 0, // Will be calculated in drawChart
        cloudCover: item.cloud_cover,
        output: item.predicted_solar_output_kwh,
        temperature,
        time: item.time || `${8 + Math.floor(index / 6)}:${(index % 6) * 10}0`,
        weather,
        irradiance,
        color: `rgba(${Math.min(r, 255)}, ${Math.min(g, 255)}, ${Math.min(b, 255)}, 0.8)`,
        size: 3 + (item.predicted_solar_output_kwh / Math.max(...hourlyData.map(h => h.predicted_solar_output_kwh))) * 4
      };
    });

    setChartData(processedData);
  }, [raw_data]);

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

    const margin = { top: 30, right: 40, bottom: 70, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    if (chartWidth <= 0 || chartHeight <= 0) return;

    const maxOutput = Math.max(...chartData.map(d => d.output));
    const minOutput = Math.min(...chartData.map(d => d.output));
    const maxCloudCover = 100;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, margin.top, 0, margin.top + chartHeight);
    bgGradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
    bgGradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(margin.left, margin.top, chartWidth, chartHeight);

    // Draw grid
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
    for (let i = 0; i <= 5; i++) {
      const x = margin.left + (chartWidth / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + chartHeight);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Calculate positions and draw trend line
    const updatedData = chartData.map((point, index) => {
      const x = margin.left + (point.cloudCover / maxCloudCover) * chartWidth;
      const y = margin.top + chartHeight - ((point.output - minOutput) / (maxOutput - minOutput)) * chartHeight;
      return { ...point, x, y };
    });

    // Draw trend line using linear regression
    if (updatedData.length > 1) {
      const n = updatedData.length;
      const sumX = updatedData.reduce((sum, p) => sum + p.cloudCover, 0);
      const sumY = updatedData.reduce((sum, p) => sum + p.output, 0);
      const sumXY = updatedData.reduce((sum, p) => sum + p.cloudCover * p.output, 0);
      const sumXX = updatedData.reduce((sum, p) => sum + p.cloudCover * p.cloudCover, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      const trendY1 = margin.top + chartHeight - ((intercept - minOutput) / (maxOutput - minOutput)) * chartHeight;
      const trendY2 = margin.top + chartHeight - ((slope * 100 + intercept - minOutput) / (maxOutput - minOutput)) * chartHeight;

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(margin.left, trendY1);
      ctx.lineTo(margin.left + chartWidth, trendY2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw scatter points with animation
    updatedData.forEach((point, index) => {
      const isHovered = index === hoveredPointIndex;
      const animatedSize = point.size * animationProgress * (isHovered ? 1.5 : 1);

      // Point shadow
      if (animationProgress > 0.5) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(point.x + 1, point.y + 1, animatedSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Main point
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, animatedSize, 0, Math.PI * 2);
      ctx.fill();

      // Hover highlight
      if (isHovered) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, animatedSize + 2, 0, Math.PI * 2);
        ctx.stroke();

        // Pulse effect
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, animatedSize + 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Store position for hover detection
      chartData[index] = { ...point, x: point.x, y: point.y };
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();

    // Axis labels and ticks
    ctx.fillStyle = '#D1D5DB';
    ctx.font = '11px Inter, sans-serif';

    // X-axis (Cloud Cover)
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const value = (100 / 5) * i;
      const x = margin.left + (chartWidth / 5) * i;

      // Tick marks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, margin.top + chartHeight);
      ctx.lineTo(x, margin.top + chartHeight + 5);
      ctx.stroke();

      ctx.fillText(`${value}%`, x, margin.top + chartHeight + 18);
    }

    // Y-axis (Power Output)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = minOutput + ((maxOutput - minOutput) / 5) * i;
      const y = margin.top + chartHeight - (chartHeight / 5) * i;

      // Tick marks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin.left - 5, y);
      ctx.lineTo(margin.left, y);
      ctx.stroke();

      ctx.fillText(`${value.toFixed(1)}`, margin.left - 10, y + 4);
    }

    // Axis titles
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Cloud Cover (%)', margin.left + chartWidth / 2, height - 15);

    // Y-axis title
    ctx.save();
    ctx.translate(25, margin.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Power Output (kWh)', 0, 0);
    ctx.restore();
  }, [chartData, hoveredPointIndex]);

  // Animation effect (only on initial load)
  useEffect(() => {
    if (!chartData.length) return;

    let start: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      // Elastic easing function
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress) * Math.cos((progress * 10 - 0.75) * (2 * Math.PI) / 3);

      drawChart(easeProgress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsInitialAnimationComplete(true);
      }
    };

    if (!isInitialAnimationComplete) {
      setIsInitialAnimationComplete(false);
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [chartData, drawChart]);

  // Redraw chart on hover changes
  useEffect(() => {
    if (chartData.length > 0 && isInitialAnimationComplete) {
      drawChart(1);
    }
  }, [hoveredPointIndex, drawChart, isInitialAnimationComplete]);

  // Mouse move handler for hover effects
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData.length) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let hoveredIndex = -1;
    let minDistance = Infinity;

    // Find closest point within reasonable distance
    chartData.forEach((point, index) => {
      if (point.x && point.y) {
        const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
        if (distance < 15 && distance < minDistance) {
          minDistance = distance;
          hoveredIndex = index;
        }
      }
    });

    if (hoveredIndex !== hoveredPointIndex) {
      setHoveredPointIndex(hoveredIndex);

      if (hoveredIndex >= 0) {
        const point = chartData[hoveredIndex];
        setTooltip({
          x: event.clientX,
          y: event.clientY - 10,
          cloudCover: point.cloudCover,
          output: point.output,
          temperature: point.temperature,
          time: point.time,
          weather: point.weather,
          irradiance: point.irradiance,
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
  }, [chartData, hoveredPointIndex]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPointIndex(-1);
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
      if (isInitialAnimationComplete) {
        drawChart(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawChart, isInitialAnimationComplete]);

  // Calculate correlation coefficient
  const calculateCorrelation = () => {
    if (chartData.length < 2) return 0;

    const n = chartData.length;
    const sumX = chartData.reduce((sum, p) => sum + p.cloudCover, 0);
    const sumY = chartData.reduce((sum, p) => sum + p.output, 0);
    const sumXY = chartData.reduce((sum, p) => sum + p.cloudCover * p.output, 0);
    const sumXX = chartData.reduce((sum, p) => sum + p.cloudCover * p.cloudCover, 0);
    const sumYY = chartData.reduce((sum, p) => sum + p.output * p.output, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator !== 0 ? numerator / denominator : 0;
  };

  const correlation = calculateCorrelation();
  const avgOutput = chartData.reduce((sum, p) => sum + p.output, 0) / chartData.length;
  const avgCloudCover = chartData.reduce((sum, p) => sum + p.cloudCover, 0) / chartData.length;

  return (
    <div className="bg-transparent p-6">
      <GlassmorphicCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Cloud className="w-6 h-6 text-blue-400 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-white">Weather Impact Analysis</h3>
              <p className="text-sm text-gray-400">Cloud cover vs power output correlation</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-blue-400 font-semibold">{avgCloudCover.toFixed(0)}%</div>
              <div className="text-gray-400">Avg Cloud</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-semibold">{avgOutput.toFixed(1)}</div>
              <div className="text-gray-400">Avg Output</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${Math.abs(correlation) > 0.5 ? 'text-orange-400' : 'text-gray-400'}`}>
                {correlation.toFixed(2)}
              </div>
              <div className="text-gray-400">Correlation</div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative"
          ref={containerRef}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-80 rounded-lg cursor-crosshair"
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
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg p-3 shadow-xl text-white text-sm min-w-[220px]">
                  <div className="flex items-center mb-2">
                    <Eye className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="font-medium">Data Point</span>
                    {tooltip.time && (
                      <span className="ml-auto text-gray-400">{tooltip.time}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Cloud className="w-3 h-3 text-blue-400 mr-1" />
                        Cloud Cover:
                      </span>
                      <span className="font-semibold text-blue-300">{tooltip.cloudCover.toFixed(1)}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Sun className="w-3 h-3 text-yellow-400 mr-1" />
                        Power Output:
                      </span>
                      <span className="font-semibold text-green-400">{tooltip.output.toFixed(2)} kWh</span>
                    </div>

                    {tooltip.temperature && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Thermometer className="w-3 h-3 text-red-400 mr-1" />
                          Temperature:
                        </span>
                        <span className="text-orange-400">{tooltip.temperature.toFixed(1)}°C</span>
                      </div>
                    )}

                    {tooltip.irradiance && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Solar Irradiance:</span>
                        <span className="text-yellow-300">{tooltip.irradiance.toFixed(0)} W/m²</span>
                      </div>
                    )}

                    {tooltip.weather && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <CloudRain className="w-3 h-3 text-purple-400 mr-1" />
                          Condition:
                        </span>
                        <span className="text-purple-300">{tooltip.weather}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Legend and Analysis */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mr-2"></div>
              <span className="text-gray-300">Low Cloud Cover</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mr-2"></div>
              <span className="text-gray-300">High Cloud Cover</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-yellow-500 mr-2" style={{ borderStyle: 'dashed' }}></div>
              <span className="text-gray-300">Trend Line</span>
            </div>
          </div>

          {/* <div className="flex items-center text-sm text-gray-400">
            <TrendingDown className="w-4 h-4 mr-2" />
            <span>Hover points for details</span>
          </div> */}
        </div>
      </GlassmorphicCard>
    </div>
  );
}