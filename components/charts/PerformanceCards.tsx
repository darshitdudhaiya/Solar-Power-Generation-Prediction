"use client";

import { motion } from 'framer-motion';
import { Zap, TrendingUp, DollarSign, Clock } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/glassmorphic-card';
import { Progress } from '@/components/ui/progress';
import { SolarData } from '@/lib/types';

interface PerformanceCardsProps {
  data: SolarData;
}

export default function PerformanceCards({ data }: PerformanceCardsProps) {
  const { current_system_performance, optimization_recommendations, financial_projections } = data;

  const cards = [
    {
      icon: Zap,
      title: 'Annual Output',
      value: `${current_system_performance.annual_output_kwh.toFixed(1)} kWh`,
      subtitle: 'Current system performance',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: TrendingUp,
      title: 'Optimal Potential',
      value: `${optimization_recommendations.optimal_annual_output.toFixed(1)} kWh`,
      subtitle: `+${optimization_recommendations.improvement_percentage.toFixed(1)}% improvement`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: DollarSign,
      title: 'Annual Savings',
      value: `₹ ${financial_projections.annual_savings.toFixed(2)}`,
      subtitle: 'Projected financial benefit',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    // {
    //   icon: Clock,
    //   title: 'Payback Period',
    //   value: `${Math.round(optimization_recommendations.payback_period_years)} years`,
    //   subtitle: 'Return on investment timeline',
    //   color: 'text-purple-400',
    //   bgColor: 'bg-purple-500/10'
    // }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1, duration: 0.8 }}
        >
          <GlassmorphicCard className="p-6 h-full">
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center mb-4`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            
            <h3 className="text-sm font-medium text-gray-300 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-white mb-2">{card.value}</p>
            <p className="text-xs text-gray-400">{card.subtitle}</p>
            
            {/* Progress bar for improvement percentage */}
            {card.title === 'Optimal Potential' && (
              <div className="mt-4">
                <Progress 
                  value={Math.min(optimization_recommendations.improvement_percentage, 100)} 
                  className="h-2 [&>div]:bg-green-500"
                />
              </div>
            )}
          </GlassmorphicCard>
        </motion.div>
      ))}
    </div>
  );
}