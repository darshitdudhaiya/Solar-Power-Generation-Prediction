import { SolarData } from './types';

export const solarData: SolarData = {
  "location_analysis": {
    "latitude": 23.0215374,
    "longitude": 72.5800568,
    "location_name": "Ahmedabad, India",
    "panel_area": 10,
    "current_tilt": 30,
    "current_azimuth": 180,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "solar_potential_rating": "Poor",
    "best_months": [9],
    "worst_months": [9]
  },
  "current_system_performance": {
    "annual_output_kwh": 30.46629365746403,
    "monthly_average": 2.538857804788669,
    "peak_daily_output": 7.045839360490147,
    "capacity_factor": 6.347144511971672
  },
  "optimization_recommendations": {
    "current_annual_output": 30.46629365746403,
    "optimal_annual_output": 68.1353681450707,
    "improvement_kwh": 37.66907448760667,
    "improvement_percentage": 123.64180202266913,
    "annual_financial_benefit": 5.650361173141,
    "optimal_tilt": 75,
    "optimal_azimuth": -180,
    "payback_period_years": 884.8991855188845
  },
  "weather_impact_analysis": {
    "cloud_impact": {
      "correlation": -0.561657673037934,
      "high_impact_threshold": 100.0,
      "low_impact_threshold": 53.0,
      "average_reduction_high": null,
      "average_reduction_low": 0.7309351714978394
    },
    "temperature_impact": {
      "correlation": 0.8005044603020478,
      "high_impact_threshold": 32.21,
      "low_impact_threshold": 25.8,
      "average_reduction_high": 0.8202286484133166,
      "average_reduction_low": 0.00726918770741942
    },
    "seasonal_variation": {
      "9": 30.466293657464025
    }
  },
  "financial_projections": {
    "annual_savings": 4.569944048619604,
    "25_year_savings": 68.94500126012265,
    "carbon_offset_tons_per_year": 0.012186517462985613
  },
  "maintenance_schedule": {
    "panel_cleaning": {
      "frequency": "Monthly",
      "priority_months": [9],
      "reason": "Low precipitation months require more frequent cleaning"
    },
    "inspection_schedule": {
      "quarterly_check": "Visual inspection and performance monitoring",
      "annual_check": "Professional inspection and electrical testing",
      "weather_related": "Check after severe weather events"
    },
    "seasonal_tasks": {
      "winter": "Snow removal and ice prevention",
      "spring": "Post-winter damage assessment",
      "summer": "Heat stress monitoring and ventilation check",
      "autumn": "Leaf and debris removal"
    }
  },
  "future_forecast": {
    "2025-09-15": {
      "theoretical_panel_output": 15.48,
      "temperature_2m": 28.62,
      "cloud_cover": 83.21,
      "precipitation": 0.0
    },
    "2025-09-16": {
      "theoretical_panel_output": 15.01,
      "temperature_2m": 28.65,
      "cloud_cover": 80.75,
      "precipitation": 0.0
    },
    "2025-09-17": {
      "theoretical_panel_output": 14.42,
      "temperature_2m": 28.38,
      "cloud_cover": 80.42,
      "precipitation": 0.3
    },
    "2025-09-18": {
      "theoretical_panel_output": 14.54,
      "temperature_2m": 28.67,
      "cloud_cover": 82.58,
      "precipitation": 0.3
    },
    "2025-09-19": {
      "theoretical_panel_output": 14.21,
      "temperature_2m": 28.95,
      "cloud_cover": 78.62,
      "precipitation": 0.0
    }
  },
  "raw_data": {
    "historical_hourly_output": [
      {
        "time": "2025-09-15T00:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 26.8,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T01:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 26.4,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T02:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 26.1,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T03:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 25.7,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T04:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 25.3,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T05:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 25.2,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T06:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 25.2,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T07:00:00",
        "predicted_solar_output_kwh": 0.07996106478161362,
        "temperature_2m": 25.7,
        "cloud_cover": 66
      },
      {
        "time": "2025-09-15T08:00:00",
        "predicted_solar_output_kwh": 0.2124554424007453,
        "temperature_2m": 26.8,
        "cloud_cover": 95
      },
      {
        "time": "2025-09-15T09:00:00",
        "predicted_solar_output_kwh": 0.4998190906205379,
        "temperature_2m": 28.1,
        "cloud_cover": 67
      },
      {
        "time": "2025-09-15T10:00:00",
        "predicted_solar_output_kwh": 0.5134639389313449,
        "temperature_2m": 29.0,
        "cloud_cover": 91
      },
      {
        "time": "2025-09-15T11:00:00",
        "predicted_solar_output_kwh": 0.94660256050673,
        "temperature_2m": 30.2,
        "cloud_cover": 50
      },
      {
        "time": "2025-09-15T12:00:00",
        "predicted_solar_output_kwh": 0.8807857207742389,
        "temperature_2m": 31.3,
        "cloud_cover": 66
      },
      {
        "time": "2025-09-15T13:00:00",
        "predicted_solar_output_kwh": 1.2363021648686878,
        "temperature_2m": 31.9,
        "cloud_cover": 46
      },
      {
        "time": "2025-09-15T14:00:00",
        "predicted_solar_output_kwh": 1.2706102974691191,
        "temperature_2m": 32.5,
        "cloud_cover": 44
      },
      {
        "time": "2025-09-15T15:00:00",
        "predicted_solar_output_kwh": 0.49414322329004107,
        "temperature_2m": 32.7,
        "cloud_cover": 84
      },
      {
        "time": "2025-09-15T16:00:00",
        "predicted_solar_output_kwh": 0.6664277386962124,
        "temperature_2m": 32.5,
        "cloud_cover": 47
      },
      {
        "time": "2025-09-15T17:00:00",
        "predicted_solar_output_kwh": 0.13840283660577243,
        "temperature_2m": 32.1,
        "cloud_cover": 87
      },
      {
        "time": "2025-09-15T18:00:00",
        "predicted_solar_output_kwh": 0.10554537670085176,
        "temperature_2m": 30.9,
        "cloud_cover": 54
      },
      {
        "time": "2025-09-15T19:00:00",
        "predicted_solar_output_kwh": 0.0013199048442516816,
        "temperature_2m": 29.7,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T20:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 29.1,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T21:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 28.5,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T22:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 27.9,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-15T23:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 27.3,
        "cloud_cover": 100
      },
      {
        "time": "2025-09-16T00:00:00",
        "predicted_solar_output_kwh": 0.0,
        "temperature_2m": 26.7,
        "cloud_cover": 29
      }
    ],
    "historical_daily_output": {
      "2025-09-15": 7.045839360490147,
      "2025-09-16": 6.6323724845571865,
      "2025-09-17": 5.606824554562496,
      "2025-09-18": 5.431141661599458,
      "2025-09-19": 5.750115596254738
    }
  }
};