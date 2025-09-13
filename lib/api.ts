import { SolarData } from './types';

interface SolarAnalysisRequest {
  lat: number | null;
  lon: number | null;
  location_name: string;
  panel_area: number;
  current_tilt: number;
  current_azimuth: number;
  start_date: string;
  end_date: string;
}

export async function fetchSolarAnalysis(params: SolarAnalysisRequest): Promise<SolarData> {
  try {
    console.log('Sending API request with params:', params);
    
    // Use a production API endpoint if available, otherwise fallback to localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/solar-analysis';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      // Try to get more detailed error information from the response
      try {
        const errorData = await response.json();
        throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
      } catch (jsonError) {
        // If we can't parse the error response as JSON, just use the status text
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('API response received:', data);
    return data as SolarData;
  } catch (error) {
    console.error('Error fetching solar analysis:', error);
    throw error;
  }
}