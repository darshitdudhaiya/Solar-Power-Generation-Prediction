"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Settings, Calendar, Zap, Loader2, Search } from "lucide-react";

// GlassmorphicCard component
const GlassmorphicCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl shadow-xl ${className}`}>
    {children}
  </div>
);

// ----------------- Custom Components -----------------

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg" | "xl";
}
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  size = "md",
  className = "",
  ...props
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 w-full max-w-xs rounded font-medium transition-all ${className}`}
    {...props}
  >
    {children}
  </button>
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 ${className}`}
    {...props}
  />
);

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
const Label: React.FC<LabelProps> = ({ children, className = "", ...props }) => (
  <label
    className={`block font-medium text-white ${className}`}
    {...props}
  >
    {children}
  </label>
);

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  min: number;
  step: number;
  className?: string;
}
const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  max,
  min,
  step,
  className = "",
}) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
    className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb ${className}`}
    style={{
      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value[0] - min) / (max - min)) * 100}%, #374151 ${((value[0] - min) / (max - min)) * 100}%, #374151 100%)`
    }}
  />
);

// ----------------- Main Props -----------------

interface InputPanelProps {
  onAnalyze: (params: {
    location: string;
    surfaceArea: number;
    tiltAngle: number;
    azimuthAngle: number;
    startDate: string;
    endDate: string;
  }) => void;
  isAnalyzing: boolean;
  error?: string | null;
}

// ----------------- Component -----------------

export default function InputPanel({
  onAnalyze,
  isAnalyzing,
  error,
}: InputPanelProps) {
  const [locationMode, setLocationMode] = useState<"name" | "coords">("name");
  const [lat, setLat] = useState<number | null>(23.0225);
  const [lon, setLon] = useState<number | null>(72.5714);

  // Autocomplete state
  const [search, setSearch] = useState("Ahmedabad, Gujarat");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Panel state
  const [panelArea, setPanelArea] = useState<number[]>([20]);
  const [tilt, setTilt] = useState<number[]>([35]);
  const [azimuth, setAzimuth] = useState<number[]>([180]);

  // Dates
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Fetch city suggestions only
  useEffect(() => {
    const fetchCities = async () => {
      if (search.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        // Using Nominatim with city/town focus and limiting results
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&addressdetails=1&limit=8&featureType=city`
        );
        const data = await res.json();

        // Filter and format results to show city names more clearly
        const cityResults = data
          .filter((item: any) =>
            item.type === 'city' ||
            item.type === 'town' ||
            item.type === 'village' ||
            item.class === 'place'
          )
          .map((item: any) => {
            const address = item.address || {};
            const city = address.city || address.town || address.village || item.name;
            const state = address.state;
            const country = address.country;

            if (state && country) {
              return `${city}, ${state}, ${country}`;
            } else if (country) {
              return `${city}, ${country}`;
            } else {
              return item.display_name;
            }
          });

        setSuggestions([...new Set(cityResults)]); // Remove duplicates
      } catch (error) {
        console.error('Error fetching cities:', error);
        setSuggestions([]);
      }
    };

    const timeout = setTimeout(fetchCities, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="min-h-screen bg-transparent">
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      <div className="max-w-6xl mx-auto text-white p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Configure Your Solar System
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Choose your location method and panel details
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Location */}
          <GlassmorphicCard className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-lg sm:text-xl font-semibold text-white">Location</h3>
            </div>

            {/* Toggle */}
            <div className="flex gap-4 sm:gap-6 mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="location-mode"
                  value="name"
                  checked={locationMode === "name"}
                  onChange={() => setLocationMode("name")}
                  className="text-blue-400 bg-gray-800 border-gray-600 focus:ring-blue-400"
                />
                <span className="text-sm text-white">City Name</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="location-mode"
                  value="coords"
                  checked={locationMode === "coords"}
                  onChange={() => setLocationMode("coords")}
                  className="text-blue-400 bg-gray-800 border-gray-600 focus:ring-blue-400"
                />
                <span className="text-sm text-white">Coordinates</span>
              </label>
            </div>

            {locationMode === "name" ? (
              <div className="relative">
                <Label className="text-sm text-white">Search City</Label>
                <div className="flex items-center mt-2 bg-gray-800/70 border border-gray-600 rounded px-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent px-3 py-2 focus:outline-none text-sm text-white placeholder-gray-400"
                    placeholder="Type a city name..."
                  />
                </div>
                {suggestions.length > 0 && (
                  <ul className="absolute z-20 bg-gray-800 border border-gray-600 rounded mt-2 w-full max-h-48 overflow-auto text-sm shadow-2xl">
                    {suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-white border-b border-gray-700 last:border-b-0 transition-colors"
                        onClick={() => {
                          setSearch(suggestion);
                          setSuggestions([]);
                        }}
                      >
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-blue-400 mr-2" />
                          {suggestion}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-white">Latitude</Label>
                  <Input
                    type="number"
                    value={lat ?? ""}
                    onChange={(e) =>
                      setLat(e.target.value ? parseFloat(e.target.value) : null)
                    }
                    className="mt-2"
                    placeholder="e.g. 23.0225"
                  />
                </div>
                <div>
                  <Label className="text-sm text-white">Longitude</Label>
                  <Input
                    type="number"
                    value={lon ?? ""}
                    onChange={(e) =>
                      setLon(e.target.value ? parseFloat(e.target.value) : null)
                    }
                    className="mt-2"
                    placeholder="e.g. 72.5714"
                  />
                </div>
              </div>
            )}
          </GlassmorphicCard>

          {/* Panel Config */}
          <GlassmorphicCard className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Panel Configuration
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-white">Panel Area: {panelArea[0]} m²</Label>
                <Slider
                  value={panelArea}
                  onValueChange={setPanelArea}
                  max={500}
                  min={10}
                  step={10}
                  className="mt-3"
                />
              </div>
              <div>
                <Label className="text-white">Tilt Angle: {tilt[0]}°</Label>
                <Slider
                  value={tilt}
                  onValueChange={setTilt}
                  max={90}
                  min={0}
                  step={5}
                  className="mt-3"
                />
              </div>
              <div>
                <Label className="text-white">Azimuth Angle: {azimuth[0]}°</Label>
                <Slider
                  value={azimuth}
                  onValueChange={setAzimuth}
                  max={180}
                  min={-180}
                  step={15}
                  className="mt-3"
                />
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Date Range */}
        <div className="mt-8">
          <GlassmorphicCard className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-lg sm:text-xl font-semibold text-white">Analysis Period</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-white mb-2">Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-white mb-2">End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Analyze Button */}
        <div className="text-center mt-10 sm:mt-12 flex justify-center">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}
          <Button
            onClick={() => {
              onAnalyze({
                location: locationMode === "coords" ? `${lat},${lon}` : search,
                surfaceArea: panelArea[0],
                tiltAngle: tilt[0],
                azimuthAngle: azimuth[0],
                startDate,
                endDate,
              });
            }}
            disabled={isAnalyzing}
            size="xl"
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 sm:px-16 py-4 sm:py-6 text-lg sm:text-xl font-semibold rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-3 w-6 h-6 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="mr-3 w-6 h-6" />
                Analyze System
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}