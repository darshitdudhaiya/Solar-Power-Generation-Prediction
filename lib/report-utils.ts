import { SolarData } from "./types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Helper to format numbers with 2 decimal places
const formatNumber = (num: number): string => {
  return num.toFixed(2);
};

// Generate CSV data from solar data
export const generateCSV = (data: SolarData): string => {
  // Create CSV header
  const header =
    "Date,Predicted Output (kWh),Temperature (°C),Cloud Cover (%)";

  // Sort dates to ensure chronological order
  const sortedEntries = Object.entries(data.future_forecast).sort(
    ([dateA], [dateB]) => {
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    }
  );

  // Generate CSV rows
  const rows = sortedEntries.map(([date, forecast]) => {
    // Format values with proper handling for null/undefined
    const output = forecast.theoretical_panel_output?.toFixed(2) ?? "0.00";
    const temperature = forecast.temperature_2m?.toFixed(2) ?? "N/A";
    const cloudCover = forecast.cloud_cover?.toFixed(2) ?? "N/A";
    const precipitation = forecast.precipitation?.toFixed(1) ?? "0.0";

    return `${date},${output},${temperature},${cloudCover},${precipitation}`;
  });

  // Combine header and rows
  return [header, ...rows].join("\n");
};

// Alternative version with more detailed formatting
export const generateDetailedCSV = (data: SolarData): string => {
  const header = [
    "Day of Week",
    "Predicted Output (kWh)",
    "Temperature (°C)",
    "Cloud Cover (%)",
    "Weather Condition",
  ].join(",");

  const sortedEntries = Object.entries(data.future_forecast).sort(
    ([dateA], [dateB]) => {
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    }
  );

  const rows = sortedEntries.map(([date, forecast]) => {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" });

    // Determine weather condition based on data
    let weatherCondition = "Clear";
    if (forecast.precipitation && forecast.precipitation > 0) {
      weatherCondition = "Rainy";
    } else if (forecast.cloud_cover && forecast.cloud_cover > 70) {
      weatherCondition = "Cloudy";
    } else if (forecast.cloud_cover && forecast.cloud_cover > 30) {
      weatherCondition = "Partly Cloudy";
    }

    const output = forecast.theoretical_panel_output?.toFixed(2) ?? "0.00";
    const temperature = forecast.temperature_2m?.toFixed(2) ?? "N/A";
    const cloudCover = forecast.cloud_cover?.toFixed(2) ?? "N/A";
    const precipitation = forecast.precipitation?.toFixed(1) ?? "0.0";

    return `"${dayOfWeek}",${output},${temperature},${cloudCover},"${weatherCondition}"`;
  });

  return [header, ...rows].join("\n");
};

// Function to download CSV file
export const downloadCSV = (
  csvData: string,
  filename: string = "solar_forecast.csv"
): void => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Function to validate data before CSV generation
export const validateSolarData = (data: SolarData): boolean => {
  if (!data || !data.future_forecast) {
    console.error("Invalid data structure: missing future_forecast");
    return false;
  }

  const entries = Object.entries(data.future_forecast);
  if (entries.length === 0) {
    console.error("No forecast data available");
    return false;
  }

  // Check if dates are valid
  const invalidDates = entries.filter(([date]) =>
    isNaN(new Date(date).getTime())
  );
  if (invalidDates.length > 0) {
    console.error(
      "Invalid dates found:",
      invalidDates.map(([date]) => date)
    );
    return false;
  }

  return true;
};

// Main function to generate and optionally download CSV
export const generateAndDownloadCSV = (
  data: SolarData,
  detailed: boolean = false,
  autoDownload: boolean = false
): string => {
  // Validate data first
  if (!validateSolarData(data)) {
    throw new Error("Invalid solar data provided");
  }

  // Generate CSV
  const csvData = detailed ? generateDetailedCSV(data) : generateCSV(data);
  console.log("Generated CSV:", csvData);

  // Auto-download if requested
  if (autoDownload) {
    const filename = `solar_forecast_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    downloadCSV(csvData, filename);
  }

  return csvData;
};

// Download CSV file
// export const downloadCSV = (data: SolarData): void => {
//   const csv = generateDetailedCSV(data);
//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");

//   link.setAttribute("href", url);
//   link.setAttribute(
//     "download",
//     `solar_forecast_${new Date().toISOString().split("T")[0]}.csv`
//   );
//   link.style.visibility = "hidden";

//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// Generate and download PDF report
export const downloadPDF = (data: SolarData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add title
  doc.setFontSize(20);
  doc.text("Solar Power Generation Report", pageWidth / 2, 20, {
    align: "center",
  });

  // Add location info
  doc.setFontSize(12);
  doc.text(
    `Location: Latitude ${data.location_analysis.latitude}, Longitude ${data.location_analysis.longitude}`,
    14,
    30
  );
  doc.text(
    `Solar Potential Rating: ${data.location_analysis.solar_potential_rating}`,
    14,
    38
  );

  // Add system performance
  doc.setFontSize(16);
  doc.text("Current System Performance", 14, 50);
  doc.setFontSize(12);
  doc.text(
    `Annual Output: ${formatNumber(
      data.current_system_performance.annual_output_kwh
    )} kWh`,
    20,
    58
  );
  doc.text(
    `Monthly Average: ${formatNumber(
      data.current_system_performance.monthly_average
    )} kWh`,
    20,
    66
  );
  doc.text(
    `Peak Daily Output: ${formatNumber(
      data.current_system_performance.peak_daily_output
    )} kWh`,
    20,
    74
  );

  // Add optimization recommendations
  doc.setFontSize(16);
  doc.text("Optimization Recommendations", 14, 90);
  doc.setFontSize(12);
  doc.text(
    `Current Annual Output: ${formatNumber(
      data.optimization_recommendations.current_annual_output
    )} kWh`,
    20,
    98
  );
  doc.text(
    `Optimal Annual Output: ${formatNumber(
      data.optimization_recommendations.optimal_annual_output
    )} kWh`,
    20,
    106
  );
  doc.text(
    `Improvement: ${formatNumber(
      data.optimization_recommendations.improvement_percentage
    )}%`,
    20,
    114
  );
  doc.text(
    `Optimal Tilt: ${data.optimization_recommendations.optimal_tilt}°`,
    20,
    122
  );
  doc.text(
    `Optimal Azimuth: ${data.optimization_recommendations.optimal_azimuth}°`,
    20,
    130
  );

  // Add financial projections
  doc.setFontSize(16);
  doc.text("Financial Projections", 14, 146);
  doc.setFontSize(12);
  doc.text(
    `Annual Savings: $${formatNumber(
      data.financial_projections.annual_savings
    )}`,
    20,
    154
  );
  doc.text(
    `25-Year Savings: $${formatNumber(
      data.financial_projections["25_year_savings"]
    )}`,
    20,
    162
  );
  doc.text(
    `Carbon Offset: ${formatNumber(
      data.financial_projections.carbon_offset_tons_per_year
    )} tons/year`,
    20,
    170
  );

  // Add daily forecast table
  doc.addPage();
  doc.setFontSize(16);
  doc.text("Daily Power Generation Forecast", pageWidth / 2, 20, {
    align: "center",
  });

  // Create table data
  const tableData = Object.entries(data.future_forecast).map(
    ([date, forecast]) => [
      date,
      `${forecast.theoretical_panel_output} kWh`,
      forecast.temperature_2m ? `${forecast.temperature_2m} °C` : "N/A",
      forecast.cloud_cover ? `${forecast.cloud_cover}%` : "N/A",
      `${forecast.precipitation} mm`,
    ]
  );

  // Add table
  (doc as any).autoTable({
    head: [
      [
        "Date",
        "Output (kWh)",
        "Temperature (°C)",
        "Cloud Cover (%)",
        "Precipitation (mm)",
      ],
    ],
    body: tableData,
    startY: 30,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 135, 245] },
  });

  // Save the PDF
  doc.save(`solar_report_${new Date().toISOString().split("T")[0]}.pdf`);
};
