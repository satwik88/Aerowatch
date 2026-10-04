"use client";

import { ForecastData } from "@/types";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function ForecastChart({ forecast }: { forecast: ForecastData }) {
  if (!forecast || !forecast.list) return null;

  // Transform data for chart
  const data = forecast.list.map(item => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      aqi: item.aqi,
      color: item.color
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white backdrop-blur-md border border-cream rounded-3xl p-6 md:p-8 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-lapis-dark">5-Day Forecast</h3>
        <p className="text-sm font-medium text-lapis-mid/70 mt-1">Air quality predictions over the next 120 hours.</p>
      </div>
      
      <div className="h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#893172" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#893172" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tickFormatter={(value, index) => index % 8 === 0 ? value : ''} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#213885', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#213885', fontSize: 12, fontWeight: 600 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ECDFD2', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#081849', fontWeight: 'bold' }}
              labelStyle={{ color: '#5F3475', marginBottom: '4px', fontWeight: 'bold' }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  return `${payload[0].payload.date} ${payload[0].payload.time}`;
                }
                return label;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="aqi" 
              stroke="#893172" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAqi)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
