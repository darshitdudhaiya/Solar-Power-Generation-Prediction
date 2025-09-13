"use client";

import React, { useState } from "react";
import { MapPin, Settings, Calendar, Zap, Loader2 } from "lucide-react";
import GlassmorphicCard from "../ui/glassmorphic-card";

// ----------------- Custom Components -----------------

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
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
    className={`px-4 py-2 rounded font-medium transition-all ${className}`}
    {...props}
  >
    {children}
  </button>
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;
const Label: React.FC<LabelProps> = ({ children, className = "", ...props }) => (
  <label className={`block font-medium ${className}`} {...props}>
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
    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
  />
);

// ----------------- Main Props -----------------

interface InputPanelProps {
  onAnalyze: (params: {
    location: string;
    surfaceArea: number;
    tiltAngle: number;
    azimuthAngle: number;
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
  const [locationName, setLocationName] = useState("Ahmedabad, Gujarat");
  const [panelArea, setPanelArea] = useState<number[]>([20]);
  const [tilt, setTilt] = useState<number[]>([35]);
  const [azimuth, setAzimuth] = useState<number[]>([180]);



  // Set default dates
  const today = new Date();
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);

  const [startDate] = useState(today.toISOString().split("T")[0]);
  const [endDate] = useState(thirtyDaysLater.toISOString().split("T")[0]);

  return (
    <div className="max-w-6xl mx-auto bg-gray-900 text-white min-h-screen p-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Configure Your Solar System
        </h2>
        <p className="text-gray-300 text-lg">
          Choose your location method and panel details
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Location Selection */}
        <div>
          <GlassmorphicCard className="p-8">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold">Location</h3>
            </div>

            {/* Radio Toggle */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="loc-name"
                  name="location-mode"
                  value="name"
                  checked={locationMode === "name"}
                  onChange={(e) =>
                    setLocationMode(e.target.value as "name" | "coords")
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor="loc-name" className="text-gray-300">
                  Location Name
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="loc-coords"
                  name="location-mode"
                  value="coords"
                  checked={locationMode === "coords"}
                  onChange={(e) =>
                    setLocationMode(e.target.value as "name" | "coords")
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor="loc-coords" className="text-gray-300">
                  Coordinates
                </Label>
              </div>
            </div>

            {locationMode === "name" ? (
              <div>
                <Label
                  htmlFor="location_name"
                  className="text-sm font-medium text-gray-300"
                >
                  Location Name
                </Label>
                <Input
                  id="location_name"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  placeholder="Enter your city or place"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="lat"
                    className="text-sm font-medium text-gray-300"
                  >
                    Latitude
                  </Label>
                  <Input
                    id="lat"
                    type="number"
                    value={lat ?? ""}
                    onChange={(e) =>
                      setLat(e.target.value ? parseFloat(e.target.value) : null)
                    }
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    placeholder="e.g. 23.0225"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="lon"
                    className="text-sm font-medium text-gray-300"
                  >
                    Longitude
                  </Label>
                  <Input
                    id="lon"
                    type="number"
                    value={lon ?? ""}
                    onChange={(e) =>
                      setLon(e.target.value ? parseFloat(e.target.value) : null)
                    }
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    placeholder="e.g. 72.5714"
                  />
                </div>
              </div>
            )}
          </GlassmorphicCard>
        </div>

        {/* Panel Configuration */}
        <div>
          <GlassmorphicCard className="p-8">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold">Panel Configuration</h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-300">
                  Panel Area: {panelArea[0]} m²
                </Label>
                <Slider
                  value={panelArea}
                  onValueChange={setPanelArea}
                  max={500}
                  min={10}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-300">
                  Tilt Angle: {tilt[0]}°
                </Label>
                <Slider
                  value={tilt}
                  onValueChange={setTilt}
                  max={90}
                  min={0}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-300">
                  Azimuth Angle: {azimuth[0]}°
                </Label>
                <Slider
                  value={azimuth}
                  onValueChange={setAzimuth}
                  max={180}
                  min={-180}
                  step={15}
                  className="mt-2"
                />
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>

      {/* Date Range */}
      <div className="mt-8">
        <GlassmorphicCard className="p-8">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-semibold">Analysis Period</h3>
          </div>

          <div className="text-center">
            <p className="text-gray-300 mb-2">
              The analysis will be performed for the next 30 days starting from
              today.
            </p>
            <div className="flex justify-center items-center gap-4 mt-4">
              <div className="bg-white/5 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-400">Start Date:</span>
                <p className="text-blue-400 font-medium">{startDate}</p>
              </div>
              <div className="bg-white/5 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-400">End Date:</span>
                <p className="text-green-400 font-medium">{endDate}</p>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Analyze Button */}
      <div className="text-center mt-12">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <Button
          onClick={() => {
            onAnalyze({
              location:
                locationMode === "coords"
                  ? `${lat},${lon}`
                  : locationName,
              surfaceArea: panelArea[0],
              tiltAngle: tilt[0],
              azimuthAngle: azimuth[0],
            })
          }
          }
          disabled={isAnalyzing}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-16 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-3 w-6 h-6 animate-spin" />
              Analyzing Solar Potential...
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
  );
}
