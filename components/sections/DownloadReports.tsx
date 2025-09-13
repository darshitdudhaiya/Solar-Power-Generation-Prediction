"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassmorphicCard from '@/components/ui/glassmorphic-card';
import { SolarData } from '@/lib/types';
import { downloadCSV, downloadPDF } from '@/lib/report-utils';

interface DownloadReportsProps {
  data: SolarData;
}

export default function DownloadReports({ data }: DownloadReportsProps) {
  const [isDownloading, setIsDownloading] = useState<'csv' | 'pdf' | null>(null);

  const handleDownloadCSV = async () => {
    setIsDownloading('csv');
    try {
      downloadCSV(data);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setTimeout(() => setIsDownloading(null), 1000);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading('pdf');
    try {
      downloadPDF(data);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setTimeout(() => setIsDownloading(null), 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-12">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Download Reports
        </h2>
        <p className="text-gray-300 text-lg">
          Export your solar analysis data for further review
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <GlassmorphicCard className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* CSV Download */}
            <div className="flex flex-col items-center justify-center p-6 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <FileSpreadsheet className="w-16 h-16 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">CSV Format</h3>
              <p className="text-gray-300 text-center mb-6">
                Download raw data in CSV format for spreadsheet analysis
              </p>
              <Button 
                onClick={handleDownloadCSV}
                disabled={isDownloading !== null}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isDownloading === 'csv' ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </>
                )}
              </Button>
            </div>

            {/* PDF Download */}
            <div className="flex flex-col items-center justify-center p-6 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <FileText className="w-16 h-16 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">PDF Report</h3>
              <p className="text-gray-300 text-center mb-6">
                Download comprehensive report with visualizations and recommendations
              </p>
              <Button 
                onClick={handleDownloadPDF}
                disabled={isDownloading !== null}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isDownloading === 'pdf' ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> Reports include daily, weekly, and monthly predicted generation values, as well as recommendations for optimal panel placement.
            </p>
          </div>
        </GlassmorphicCard>
      </motion.div>
    </div>
  );
}