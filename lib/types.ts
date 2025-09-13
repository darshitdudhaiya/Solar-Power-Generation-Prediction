export interface SolarData {
  location_analysis: {
    latitude: number;
    longitude: number;
    location_name: string;
    panel_area: number;
    current_tilt: number;
    current_azimuth: number;
    start_date: string;
    end_date: string;
    solar_potential_rating: string;
    best_months: number[];
    worst_months: number[];
  };
  current_system_performance: {
    annual_output_kwh: number;
    monthly_average: number;
    peak_daily_output: number;
    capacity_factor: number;
  };
  optimization_recommendations: {
    current_annual_output: number;
    optimal_annual_output: number;
    improvement_kwh: number;
    improvement_percentage: number;
    annual_financial_benefit: number;
    optimal_tilt: number;
    optimal_azimuth: number;
    payback_period_years: number;
  };
  weather_impact_analysis: {
    cloud_impact: {
      correlation: number;
      high_impact_threshold: number;
      low_impact_threshold: number;
      average_reduction_high: number | null;
      average_reduction_low: number;
    };
    temperature_impact: {
      correlation: number;
      high_impact_threshold: number;
      low_impact_threshold: number;
      average_reduction_high: number;
      average_reduction_low: number;
    };
    seasonal_variation: Record<string, number>;
  };
  financial_projections: {
    annual_savings: number;
    '25_year_savings': number;
    carbon_offset_tons_per_year: number;
  };
  maintenance_schedule: {
    panel_cleaning: {
      frequency: string;
      priority_months: number[];
      reason: string;
    };
    inspection_schedule: {
      quarterly_check: string;
      annual_check: string;
      weather_related: string;
    };
    seasonal_tasks: {
      winter: string;
      spring: string;
      summer: string;
      autumn: string;
    };
  };
  future_forecast: Record<string, {
    theoretical_panel_output: number;
    temperature_2m: number;
    cloud_cover: number;
    precipitation: number;
  }>;
  raw_data: {
    historical_hourly_output: Array<{
      time: string;
      predicted_solar_output_kwh: number;
      temperature_2m: number;
      cloud_cover: number;
    }>;
    historical_daily_output: Record<string, number>;
  };
}