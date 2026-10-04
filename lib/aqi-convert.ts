import { AQICategory } from "@/types";

// Linear interpolation function for AQI calculation
function linear(aqiHigh: number, aqiLow: number, concHigh: number, concLow: number, conc: number) {
  return Math.round(((aqiHigh - aqiLow) / (concHigh - concLow)) * (conc - concLow) + aqiLow);
}

// Convert PM2.5 to US EPA AQI
function getPM25AQI(conc: number) {
  const c = (Math.floor(10 * conc)) / 10;
  if (c >= 0 && c < 12.1) return linear(50, 0, 12.0, 0.0, c);
  if (c >= 12.1 && c < 35.5) return linear(100, 51, 35.4, 12.1, c);
  if (c >= 35.5 && c < 55.5) return linear(150, 101, 55.4, 35.5, c);
  if (c >= 55.5 && c < 150.5) return linear(200, 151, 150.4, 55.5, c);
  if (c >= 150.5 && c < 250.5) return linear(300, 201, 250.4, 150.5, c);
  if (c >= 250.5 && c < 350.5) return linear(400, 301, 350.4, 250.5, c);
  if (c >= 350.5 && c < 500.5) return linear(500, 401, 500.4, 350.5, c);
  return 500;
}

// Convert PM10 to US EPA AQI
function getPM10AQI(conc: number) {
  const c = Math.floor(conc);
  if (c >= 0 && c < 55) return linear(50, 0, 54, 0, c);
  if (c >= 55 && c < 155) return linear(100, 51, 154, 55, c);
  if (c >= 155 && c < 255) return linear(150, 101, 254, 155, c);
  if (c >= 255 && c < 355) return linear(200, 151, 354, 255, c);
  if (c >= 355 && c < 425) return linear(300, 201, 424, 355, c);
  if (c >= 425 && c < 505) return linear(400, 301, 504, 425, c);
  if (c >= 505 && c < 605) return linear(500, 401, 604, 505, c);
  return 500;
}

export function convertToEPA(pm25: number, pm10: number): { aqi: number; category: AQICategory; color: string } {
  const pm25Aqi = getPM25AQI(pm25);
  const pm10Aqi = getPM10AQI(pm10);
  const aqi = Math.max(pm25Aqi, pm10Aqi);

  let category: AQICategory = "Good";
  let color = "#73A982"; // muted sage green

  if (aqi > 300) {
    category = "Hazardous";
    color = "#732439"; // deep wine red
  } else if (aqi > 200) {
    category = "Very Unhealthy";
    color = "#943C50"; // dark crimson
  } else if (aqi > 150) {
    category = "Unhealthy";
    color = "#B35560"; // muted rose red
  } else if (aqi > 100) {
    category = "Unhealthy for Sensitive Groups";
    color = "#CC7A64"; // dusty terracotta
  } else if (aqi > 50) {
    category = "Moderate";
    color = "#D1A570"; // muted amber
  }

  return { aqi, category, color };
}
