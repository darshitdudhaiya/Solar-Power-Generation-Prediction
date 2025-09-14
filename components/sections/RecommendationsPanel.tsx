"use client";

import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/glassmorphic-card';
import { Progress } from '@/components/ui/progress';
import { SolarData } from '@/lib/types';

interface RecommendationsPanelProps {
  data: SolarData;
}

export default function RecommendationsPanel({ data }: RecommendationsPanelProps) {
  const { optimization_recommendations, financial_projections, maintenance_schedule } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Smart Recommendations
        </h2>
        <p className="text-gray-300 text-lg">
          AI-powered insights to maximize your solar investment
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Optimization Recommendations */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <GlassmorphicCard className="p-6 h-full">
            <div className="flex items-center mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-xl font-semibold">Optimal Configuration</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-300">Tilt Angle</span>
                  <span className="text-sm font-medium text-blue-400">
                    {optimization_recommendations.optimal_tilt}°
                  </span>
                </div>
                <Progress value={(optimization_recommendations.optimal_tilt / 90) * 100} className="h-2 [&>div]:bg-green-500" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-300">Azimuth Angle</span>
                  <span className="text-sm font-medium text-green-400">
                    {optimization_recommendations.optimal_azimuth}°
                  </span>
                </div>
                <Progress value={((optimization_recommendations.optimal_azimuth + 180) / 360) * 100} className="h-2 [&>div]:bg-green-500" />
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-300 mb-2">Expected Improvement:</p>
                <p className="text-lg font-bold text-green-400">
                  +{optimization_recommendations.improvement_percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Financial Impact */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <GlassmorphicCard className="p-6 h-full">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold">Financial Projection</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300">Annual Savings</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹ {financial_projections.annual_savings.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-300">25-Year Savings</p>
                <p className="text-xl font-semibold text-blue-400">
                  ₹ {financial_projections['25_year_savings'].toFixed(0)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-300">Carbon Offset</p>
                <p className="text-lg font-medium text-green-400">
                  {financial_projections.carbon_offset_tons_per_year.toFixed(3)} tons/year
                </p>
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Maintenance Schedule */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <GlassmorphicCard className="p-6 h-full">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold">Maintenance Schedule</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <span className="text-sm text-gray-300">Panel Cleaning</span>
                <span className="text-sm font-medium text-blue-400">
                  {maintenance_schedule.panel_cleaning.frequency}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <span className="text-sm text-gray-300">Visual Inspection</span>
                <span className="text-sm font-medium text-yellow-400">Quarterly</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <span className="text-sm text-gray-300">Professional Check</span>
                <span className="text-sm font-medium text-green-400">Annual</span>
              </div>

              {maintenance_schedule.panel_cleaning.priority_months.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-xs text-gray-300">
                      Priority cleaning in month {maintenance_schedule.panel_cleaning.priority_months.join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </GlassmorphicCard>
        </motion.div>
      </div>

      {/* Actionable Recommendations Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <GlassmorphicCard className="p-6">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Actionable Recommendations
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Current vs. Optimal Setup</h4>
                <div className="bg-white/5 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Annual Output:</span>
                    <span className="font-medium">{optimization_recommendations.current_annual_output.toFixed(2)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Optimal Annual Output:</span>
                    <span className="font-medium text-green-400">{optimization_recommendations.optimal_annual_output.toFixed(2)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Improvement:</span>
                    <span className="font-medium text-green-400">+{optimization_recommendations.improvement_kwh.toFixed(2)} kWh (+{optimization_recommendations.improvement_percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-2">Financial Benefits</h4>
                <div className="bg-white/5 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Annual Financial Benefit:</span>
                    <span className="font-medium text-green-400">${optimization_recommendations.annual_financial_benefit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Payback Period:</span>
                    <span className="font-medium">{optimization_recommendations.payback_period_years.toFixed(1)} years</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">Optimization Steps</h4>
                <div className="bg-white/5 p-4 rounded-lg space-y-4">
                  <div>
                    <p className="font-medium mb-1">1. Adjust Panel Tilt</p>
                    <p className="text-sm text-gray-300">Change your current tilt angle from {data?.location_analysis?.current_tilt ?? "N/A"}° to the optimal {optimization_recommendations.optimal_tilt}° for maximum energy production.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">2. Correct Panel Azimuth</p>
                    <p className="text-sm text-gray-300">Reorient your panels from {data?.location_analysis?.current_azimuth ?? "N/A"}° to {optimization_recommendations.optimal_azimuth}° azimuth to better align with the sun&apos;s path.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">3. Follow Maintenance Schedule</p>
                    <p className="text-sm text-gray-300">Implement the recommended {maintenance_schedule.panel_cleaning.frequency.toLowerCase()} cleaning schedule, especially during priority months.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Weather Considerations</h4>
                <div className="bg-white/5 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Cloud Impact:</span> {Math.abs(data.weather_impact_analysis.cloud_impact.correlation * 100).toFixed(0)}% correlation with output reduction
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Temperature Impact:</span> {Math.abs(data.weather_impact_analysis.temperature_impact.correlation * 100).toFixed(0)}% correlation with performance
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Best Performance:</span> At temperatures between {data.weather_impact_analysis.temperature_impact.low_impact_threshold.toFixed(1)}°C and {data.weather_impact_analysis.temperature_impact.high_impact_threshold.toFixed(1)}°C
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </motion.div>
    </div>
  );
}