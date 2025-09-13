"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/sections/HeroSection';
import InputPanel from '@/components/sections/InputPanel';
import ResultsDashboard from '@/components/sections/ResultsDashboard';
import RecommendationsPanel from '@/components/sections/RecommendationsPanel';
import DownloadReports from '@/components/sections/DownloadReports';
import { fetchSolarAnalysis } from '@/lib/api';
import { SolarData } from '@/lib/types';
import { solarData as mockSolarData } from '@/lib/mock-data';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<'input' | 'analyzing' | 'results'>('input');
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleAnalyze = async (params: {
    location: string;
    surfaceArea: number;
    tiltAngle: number;
    azimuthAngle: number;
  }) => {
    setAnalysisStep('analyzing');
    setError(null);
    console.log(params)
    
    try {
      // Format dates for the API (today and 30 days from now)
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30);
      
      const formattedStartDate = today.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      // Parse location - could be coordinates or a location name
      let lat = null;
      let lon = null;
      let locationName = params.location;
      
      // Check if location is in coordinate format (contains a comma)
      if (params.location.includes(',')) {
        const [latitude, longitude] = params.location.split(',');
        lat = parseFloat(latitude.trim());
        lon = parseFloat(longitude.trim());
        locationName = `Lat: ${lat}, Lon: ${lon}`;
      }
      
      const apiParams = {
        lat: lat,
        lon: lon,
        location_name: params.location,
        panel_area: params.surfaceArea,
        current_tilt: params.tiltAngle,
        current_azimuth: params.azimuthAngle,
        start_date: formattedStartDate,
        end_date: formattedEndDate
      };
      
      // Use the actual API instead of mock data
      try {
        const data = await fetchSolarAnalysis(apiParams);
        setSolarData(data);
        setAnalysisStep('results');
      } catch (apiError) {
        console.error('API call failed, falling back to mock data:', apiError);
        // Fallback to mock data if API fails
        setSolarData(mockSolarData);
        setAnalysisStep('results');
      }
    } catch (err) {
      console.error('Failed to analyze solar data:', err);
      setError('Failed to analyze solar data. Please try again.');
      setAnalysisStep('input');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-green-500/20 animate-pulse" />
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10"
      >
        <HeroSection />
        
        <div className="container mx-auto px-4 py-20 space-y-20">
          {/* Input Section */}
          <motion.section
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <InputPanel 
              onAnalyze={handleAnalyze} 
              isAnalyzing={analysisStep === 'analyzing'}
              error={error}
            />
          </motion.section>

          {/* Results Section */}
          {analysisStep === 'results' && solarData && (
            <>
              <motion.section
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <ResultsDashboard data={solarData} />
              </motion.section>

              {/* Recommendations Section */}
              <motion.section
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <RecommendationsPanel data={solarData} />
              </motion.section>

              {/* Download Reports Section */}
              <motion.section
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <DownloadReports data={solarData} />
              </motion.section>
            </>
          )}
        </div>
      </motion.main>
    </div>
  );
}