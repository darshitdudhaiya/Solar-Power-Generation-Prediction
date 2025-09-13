import { SolarData } from './types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Helper to format numbers with 2 decimal places
const formatNumber = (num: number): string => {
  return num.toFixed(2);
};

// Generate CSV data from solar data
export const generateCSV = (data: SolarData): string => {
  // Create CSV header
  let csv = 'Date,Predicted Output (kWh),Temperature (°C),Cloud Cover (%),Precipitation\n';
  
  // Add daily forecast data
  Object.entries(data.future_forecast).forEach(([date, forecast]) => {
    csv += `${date},${forecast.theoretical_panel_output},${forecast.temperature_2m || 'N/A'},${forecast.cloud_cover || 'N/A'},${forecast.precipitation}\n`;
  });
  
  return csv;
};

// Download CSV file
export const downloadCSV = (data: SolarData): void => {
  const csv = generateCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `solar_forecast_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate and download PDF report
export const downloadPDF = (data: SolarData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Solar Power Generation Report', pageWidth / 2, 20, { align: 'center' });
  
  // Add location info
  doc.setFontSize(12);
  doc.text(`Location: Latitude ${data.location_analysis.latitude}, Longitude ${data.location_analysis.longitude}`, 14, 30);
  doc.text(`Solar Potential Rating: ${data.location_analysis.solar_potential_rating}`, 14, 38);
  
  // Add system performance
  doc.setFontSize(16);
  doc.text('Current System Performance', 14, 50);
  doc.setFontSize(12);
  doc.text(`Annual Output: ${formatNumber(data.current_system_performance.annual_output_kwh)} kWh`, 20, 58);
  doc.text(`Monthly Average: ${formatNumber(data.current_system_performance.monthly_average)} kWh`, 20, 66);
  doc.text(`Peak Daily Output: ${formatNumber(data.current_system_performance.peak_daily_output)} kWh`, 20, 74);
  
  // Add optimization recommendations
  doc.setFontSize(16);
  doc.text('Optimization Recommendations', 14, 90);
  doc.setFontSize(12);
  doc.text(`Current Annual Output: ${formatNumber(data.optimization_recommendations.current_annual_output)} kWh`, 20, 98);
  doc.text(`Optimal Annual Output: ${formatNumber(data.optimization_recommendations.optimal_annual_output)} kWh`, 20, 106);
  doc.text(`Improvement: ${formatNumber(data.optimization_recommendations.improvement_percentage)}%`, 20, 114);
  doc.text(`Optimal Tilt: ${data.optimization_recommendations.optimal_tilt}°`, 20, 122);
  doc.text(`Optimal Azimuth: ${data.optimization_recommendations.optimal_azimuth}°`, 20, 130);
  
  // Add financial projections
  doc.setFontSize(16);
  doc.text('Financial Projections', 14, 146);
  doc.setFontSize(12);
  doc.text(`Annual Savings: $${formatNumber(data.financial_projections.annual_savings)}`, 20, 154);
  doc.text(`25-Year Savings: $${formatNumber(data.financial_projections['25_year_savings'])}`, 20, 162);
  doc.text(`Carbon Offset: ${formatNumber(data.financial_projections.carbon_offset_tons_per_year)} tons/year`, 20, 170);
  
  // Add daily forecast table
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Daily Power Generation Forecast', pageWidth / 2, 20, { align: 'center' });
  
  // Create table data
  const tableData = Object.entries(data.future_forecast).map(([date, forecast]) => [
    date,
    `${forecast.theoretical_panel_output} kWh`,
    forecast.temperature_2m ? `${forecast.temperature_2m} °C` : 'N/A',
    forecast.cloud_cover ? `${forecast.cloud_cover}%` : 'N/A',
    `${forecast.precipitation} mm`
  ]);
  
  // Add table
  (doc as any).autoTable({
    head: [['Date', 'Output (kWh)', 'Temperature (°C)', 'Cloud Cover (%)', 'Precipitation (mm)']],
    body: tableData,
    startY: 30,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 135, 245] }
  });
  
  // Save the PDF
  doc.save(`solar_report_${new Date().toISOString().split('T')[0]}.pdf`);
};