"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudFog, ChevronRight, AlertCircle, Wind } from "lucide-react";

interface PollutantProps {
  id: string;
  name: string;
  formula: string;
  value: number;
  unit: string;
  limit: number;
  Icon: React.ElementType;
  desc: string;
}

export default function PollutantGrid({ components }: { components: Record<string, number> }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const pollutants: PollutantProps[] = [
    { id: "pm2_5", name: "Particulate Matter", formula: "(PM2.5)", value: components.pm2_5, unit: "µg/m³", limit: 35.4, Icon: CloudFog, desc: "Fine particles that can penetrate deep into the lungs and enter the bloodstream." },
    { id: "pm10", name: "Particulate Matter", formula: "(PM10)", value: components.pm10, unit: "µg/m³", limit: 154, Icon: CloudFog, desc: "Inhalable particles that can irritate the eyes, nose, and throat." },
    { id: "o3", name: "Ozone", formula: "(O₃)", value: components.o3, unit: "µg/m³", limit: 70, Icon: Cloud, desc: "Ground-level ozone can trigger asthma and reduce lung function." },
    { id: "no2", name: "Nitrogen Dioxide", formula: "(NO₂)", value: components.no2, unit: "µg/m³", limit: 100, Icon: Wind, desc: "A gas primarily from vehicle emissions that inflames airways." },
    { id: "so2", name: "Sulfur Dioxide", formula: "(SO₂)", value: components.so2, unit: "µg/m³", limit: 75, Icon: Wind, desc: "Industrial gas that can irritate the respiratory system." },
    { id: "co", name: "Carbon Monoxide", formula: "(CO)", value: components.co, unit: "µg/m³", limit: 10000, Icon: Cloud, desc: "Colorless gas that reduces oxygen delivery to the body's organs." },
  ];

  const getColor = (val: number, limit: number) => {
    const ratio = val / limit;
    if (ratio >= 1) return "#CC7A64"; // terracotta / high
    if (ratio >= 0.5) return "#D1A570"; // amber / moderate
    return "#73A982"; // green / safe
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
      {pollutants.map((p, i) => {
        const color = getColor(p.value, p.limit);
        const isAlert = p.value / p.limit >= 1;
        const isExpanded = expandedId === p.id;
        
        return (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => setExpandedId(isExpanded ? null : p.id)}
            className="relative bg-white rounded-[12px] p-3 shadow-sm border border-cream cursor-pointer hover:border-lapis-mid/30 hover:shadow-md transition-all overflow-hidden flex flex-col"
          >
            {/* Left color bar */}
            <div className="absolute left-0 top-3 bottom-3 w-[5px] rounded-r-md" style={{ backgroundColor: color }} />
            
            <div className="flex items-center w-full">
              {/* Alert Icon */}
              {isAlert && (
                <div className="absolute -top-1.5 -right-1.5 bg-[#CC7A64] rounded-full p-0.5 shadow-sm border-2 border-white">
                  <AlertCircle className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Icon */}
              <div className="w-8 h-8 ml-3 mr-3 flex-shrink-0 text-lapis-dark">
                <p.Icon strokeWidth={1.5} className="w-full h-full" />
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
                <span className="text-[13px] font-bold text-lapis-dark truncate block w-full">{p.name}</span>
                <span className="text-[11px] font-semibold text-lapis-mid/60 mt-0.5 truncate block w-full">{p.formula}</span>
              </div>

              {/* Value */}
              <div className="w-16 flex-shrink-0 flex flex-col items-end pr-1">
                <span className="text-xl font-black text-lapis-dark leading-none">{Math.round(p.value)}</span>
                <span className="text-[10px] font-semibold text-lapis-mid/60 mt-1">{p.unit}</span>
              </div>

              {/* Chevron */}
              <div className="w-4 h-4 flex-shrink-0 text-lapis-mid/50 flex items-center justify-center transition-transform duration-200" style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>
                <ChevronRight className="w-full h-full" />
              </div>
            </div>

            {/* Expandable Description */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-lapis-mid/80 ml-3 pl-[44px] leading-relaxed border-t border-cream/50 pt-2">
                    {p.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
