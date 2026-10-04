import { AQIData, ForecastData } from "@/types";
import { convertToEPA } from "./aqi-convert";

const OWM_API_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY;

export async function getLiveAQI(lat: number, lon: number): Promise<AQIData | null> {
  if (!OWM_API_KEY) {
    console.error("Missing NEXT_PUBLIC_OWM_API_KEY");
    return null;
  }
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch AQI");
    const data = await res.json();
    const item = data.list[0];
    const { pm2_5, pm10 } = item.components;
    
    const epa = convertToEPA(pm2_5, pm10);
    
    return {
      aqi: epa.aqi,
      category: epa.category,
      color: epa.color,
      components: item.components,
      dt: item.dt
    };
  } catch (error) {
    console.error("Error fetching live AQI:", error);
    return null;
  }
}

interface OWMListItem {
  dt: number;
  components: Record<string, number>;
}

export async function getForecastAQI(lat: number, lon: number): Promise<ForecastData | null> {
  if (!OWM_API_KEY) return null;
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch forecast");
    const data = await res.json();
    
    return {
      list: data.list.map((item: OWMListItem) => {
        const { pm2_5, pm10 } = item.components;
        const epa = convertToEPA(pm2_5, pm10);
        return {
          aqi: epa.aqi,
          category: epa.category,
          color: epa.color,
          components: item.components,
          dt: item.dt
        };
      })
    };
  } catch (error) {
    console.error("Error fetching forecast:", error);
    return null;
  }
}
