"use client";

import { motion } from "framer-motion";
import { AQIData } from "@/types";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

export default function AQICard({ data, locationName }: { data: AQIData, locationName: string }) {
  
  const getRecommendation = (aqi: number) => {
    if (aqi <= 50) return { text: "Safe for outdoor activity", icon: CheckCircle2 };
    if (aqi <= 100) return { text: "Acceptable air quality. Sensitive individuals should consider limiting prolonged outdoor exertion.", icon: Info };
    if (aqi <= 150) return { text: "Sensitive groups should limit outdoor exertion.", icon: AlertTriangle };
    if (aqi <= 200) return { text: "Everyone may begin to experience health effects.", icon: AlertTriangle };
    return { text: "Health alert: everyone may experience more serious health effects.", icon: AlertTriangle };
  };

  const recommendation = getRecommendation(data.aqi);
  const RecIcon = recommendation.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white backdrop-blur-xl border border-cream rounded-3xl p-8 shadow-xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-32 opacity-10 blur-3xl pointer-events-none" style={{ backgroundColor: data.color }} />
      
      <div className="flex flex-col md:flex-row gap-8 justify-between relative z-10">
        <div>
          <h2 className="text-xl font-bold text-lapis-dark mb-1">{locationName}</h2>
          <div className="flex items-baseline gap-4 mt-2">
            <span className="text-8xl font-black tracking-tighter" style={{ color: data.color }}>
              {data.aqi}
            </span>
            <span className="text-3xl font-semibold text-lapis-mid/60">AQI</span>
          </div>
          <div className="mt-4">
            <span className="px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border" style={{ backgroundColor: `${data.color}15`, color: data.color, borderColor: `${data.color}30` }}>
              {data.category}
            </span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-end">
          <div className="bg-cream/40 rounded-2xl p-5 border border-cream/60">
            <div className="flex items-start gap-3">
              <RecIcon className="w-6 h-6 mt-0.5 shrink-0" style={{ color: data.color }} />
              <p className="text-lapis-dark font-medium leading-relaxed">
                {recommendation.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
