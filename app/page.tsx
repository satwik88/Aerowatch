"use client";

import { useState, useEffect } from "react";
import GlobeMount from "@/components/GlobeMount";
import SearchBar from "@/components/SearchBar";
import AQICard from "@/components/AQICard";
import PollutantGrid from "@/components/PollutantGrid";
import ForecastChart from "@/components/ForecastChart";
import { getLiveAQI, getForecastAQI } from "@/lib/owm";
import { searchLocation } from "@/lib/geocode";
import { AQIData, ForecastData, PlaceResult } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Wind, Loader2 } from "lucide-react";

export default function Home() {
  const [activeLocation, setActiveLocation] = useState<PlaceResult | null>(null);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<PlaceResult[]>([]);

  // Load recent searches from local storage
  useEffect(() => {
    const saved = localStorage.getItem("aerowatch_recent");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveRecentSearch = (place: PlaceResult) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(p => p.place_id !== place.place_id);
      const updated = [place, ...filtered].slice(0, 5);
      localStorage.setItem("aerowatch_recent", JSON.stringify(updated));
      return updated;
    });
  };

  // Initial Geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      loadFallbackLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode to get a nice name
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const place: PlaceResult = {
            place_id: data.place_id,
            lat: latitude.toString(),
            lon: longitude.toString(),
            display_name: data.display_name,
            name: data.address?.city || data.address?.town || data.address?.village || "Your Location"
          };
          handleSelectLocation(place, false);
        } catch (e) {
          loadFallbackLocation();
        }
      },
      () => {
        loadFallbackLocation();
      },
      { timeout: 5000 }
    );
  }, []);

  const loadFallbackLocation = async () => {
    // Fallback to New Delhi
    const results = await searchLocation("New Delhi");
    if (results.length > 0) {
      handleSelectLocation(results[0], false);
    } else {
      setLoading(false);
      setError("Failed to load initial location.");
    }
  };

  const handleSelectLocation = async (place: PlaceResult, saveRecent = true) => {
    setActiveLocation(place);
    setLoading(true);
    setError(null);
    
    if (saveRecent) {
      saveRecentSearch(place);
    }

    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    try {
      const [live, forecast] = await Promise.all([
        getLiveAQI(lat, lon),
        getForecastAQI(lat, lon)
      ]);

      if (!live) throw new Error("Could not fetch AQI data. Check API key.");
      
      setAqiData(live);
      setForecastData(forecast);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-plum/30">
      
      {/* Hero Section (Globe + Search) */}
      <div className="relative w-full flex justify-center pt-8 mb-12">
        <div className="pointer-events-none z-0">
          <GlobeMount />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-full max-w-md px-6 pointer-events-auto">
            <SearchBar onSelect={handleSelectLocation} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 pb-24 relative z-20">
        
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xs font-bold text-lapis-mid/80 uppercase tracking-wider mb-4">Recent Locations</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {recentSearches.map(place => (
                <button
                  key={place.place_id}
                  onClick={() => handleSelectLocation(place)}
                  className="flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-white hover:bg-cream/30 border border-cream rounded-full text-sm font-semibold text-lapis-dark transition-colors shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-plum" />
                  {place.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <Loader2 className="w-10 h-10 animate-spin text-slate-800 mb-4" />
              <p className="text-slate-600 font-medium">Analyzing air quality...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 font-medium"
            >
              {error}
            </motion.div>
          ) : aqiData && activeLocation ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <AQICard data={aqiData} locationName={activeLocation.name || activeLocation.display_name} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-full">
                  <PollutantGrid components={aqiData.components} />
                </div>
                {forecastData && (
                  <div className="h-full">
                    <ForecastChart forecast={forecastData} />
                  </div>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
