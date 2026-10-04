<div align="center">

# 🌍 AeroWatch

### Real-time air quality monitoring and forecasting

Know the air before you step outside.

[**Live Demo**](https://aerowatch.vercel.app) · [Report an Issue](https://github.com/satwik88/Aerowatch/issues)

</div>

---

## About

AeroWatch is a premium, interactive air quality dashboard built as an EVS assignment (BCS508, Sem V) exploring how digital technology can address urban air pollution — one of the fastest-growing public health risks in Indian cities.

City-wide AQI averages hide neighborhood-level pollution pockets. Someone near a traffic junction or industrial belt can be breathing air far worse than the number reported for their whole city, and most people have no real-time, local way to find out. AeroWatch gives anyone hyperlocal, live air quality data and a short-term forecast — searchable by city, or automatically detected from their location — wrapped in a fast, visually considered interface.

## Features

- 🌐 **Interactive 3D globe** — a lightweight WebGL globe (via [COBE](https://cobe.vercel.app)) sits at the top of the app as the visual centerpiece
- 📍 **Live location detection** — automatically detects the user's location and shows local AQI on load
- 🔍 **City search** — search any city worldwide via OpenStreetMap's Nominatim geocoding API
- 📊 **Real-time AQI data** — current air quality pulled live from the OpenWeatherMap Air Pollution API, converted to the standard US EPA 0–500 AQI scale
- 🧪 **Pollutant breakdown** — individual readings for PM2.5, PM10, O₃, NO₂, SO₂, and CO, each with severity-coded indicators and an expandable explanation of health impact
- 📈 **5-day forecast** — a gradient area chart visualizing predicted air quality trends over the next 120 hours
- 🎨 **Custom design system** — a cohesive "Lapis Velvet" color palette and glassmorphic UI built for a premium, editorial feel rather than a generic dashboard look

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Globe | [cobe](https://github.com/shuding/cobe) |
| Geocoding | OpenStreetMap Nominatim API |
| Air quality data | OpenWeatherMap Air Pollution API |
| Deployment | Vercel |

## Getting Started

### Prerequisites
- Node.js 18+
- A free [OpenWeatherMap](https://openweathermap.org/api) API key

### Setup

```bash
git clone https://github.com/satwik88/Aerowatch.git
cd Aerowatch
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_OWM_API_KEY=your_api_key_here
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser — or see it live at [aerowatch.vercel.app](https://aerowatch.vercel.app).

## How It Works

**Input → Processing → Output**

1. **Input** — User location (geolocation or search) is resolved to coordinates via Nominatim; live pollutant concentrations are fetched from OpenWeatherMap for those coordinates
2. **Processing** — Raw PM2.5/PM10/pollutant values are converted into the standard EPA AQI scale and mapped to a severity category (Good → Hazardous); forecast data is processed into a time-series for the chart
3. **Output** — Results render as a live AQI card, color-coded pollutant grid, and 5-day forecast chart, with health recommendations based on the current category

## Environmental Impact

- Helps individuals avoid high-pollution times and routes, reducing personal exposure
- Gives a template for how zone-level, real-time data could support municipal interventions — targeted traffic restriction, dust control — rather than city-wide guesswork
- Demonstrates how accessible, free data sources (OpenWeatherMap, OSM) can power meaningful environmental tooling without requiring custom infrastructure
- Encourages everyday awareness of air quality as a factor in daily planning, not just a background statistic

## Project Status

Built iteratively as a course project — functional, deployed, and actively refined. Not a production-grade pollution-monitoring system; AQI forecasts and historical trend data are powered by OpenWeatherMap's public API rather than custom ML models or hardware sensors, as originally scoped in the proposal.

---

<div align="center">
Built by <a href="https://github.com/satwik88">satwik88</a>
</div>
