<div align="center">

# 🌏 AeroWatch

Real-time air quality dashboard with live location AQI, city search, pollutant breakdown and a five-day forecast.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

**Live demo:** [aerowatch.vercel.app](https://aerowatch.vercel.app)

</div>

## Contents

1. [Abstract](#abstract)
2. [Problem statement](#problem-statement)
3. [Objectives](#objectives)
4. [Features](#features)
5. [System overview](#system-overview)
6. [Tech stack](#tech-stack)
7. [How the AQI is calculated](#how-the-aqi-is-calculated)
8. [Project structure](#project-structure)
9. [Getting started](#getting-started)
10. [Deployment](#deployment)
11. [Limitations](#limitations)
12. [Future scope](#future-scope)
13. [Environmental relevance](#environmental-relevance)
14. [References](#references)
15. [Academic details](#academic-details)

## Abstract

AeroWatch is a web application that shows the current air quality for any location and the expected trend over the next five days. A user can search for a city or let the browser detect their position, and the app returns the Air Quality Index (AQI), the concentration of six pollutants, and a short health recommendation. The project was built for the Environmental Studies course to show how freely available data and a standard web stack can make local air quality easier to see and act on.

## Problem statement

Air quality is usually reported as a single figure for a whole city, taken from a small number of monitoring stations. Pollution varies a lot within a city. Areas near busy junctions, construction sites and industrial zones can be much worse than the reported average, and most people have no simple way to check the air where they actually are. Long-term exposure to fine particulate matter is linked to respiratory and heart disease, so being able to check conditions before going outside has a practical health benefit.

## Objectives

- Show current AQI for the user's own location without any manual setup
- Allow lookup of air quality for any city through search
- Break the AQI down into individual pollutants and explain what each one does to health
- Show how air quality is expected to change over the next five days
- Keep the interface fast, readable on a phone, and usable without an account

## Features

- **Live location.** The app asks for browser geolocation on load and shows local air quality. If permission is denied it falls back to a default city (New Delhi).
- **City search.** Autocomplete search for any place worldwide using OpenStreetMap Nominatim, with debounced requests.
- **AQI on the US EPA scale.** Raw concentrations are converted to the 0 to 500 AQI scale and mapped to a category from Good to Hazardous, with a colour-coded badge and a health recommendation.
- **Pollutant breakdown.** Separate cards for PM2.5, PM10, O3, NO2, SO2 and CO. Each card has a severity indicator and expands to explain the pollutant and its health effect.
- **Five-day forecast.** An area chart of predicted air quality across the next 120 hours.
- **3D globe.** A lightweight WebGL globe (COBE) at the top of the page.
- **Responsive layout.** Works on phones, tablets and desktops.

## System overview

The app has no backend of its own. The browser talks directly to two public APIs.

1. **Input.** The user's position comes from browser geolocation or from a searched place name, which Nominatim converts to latitude and longitude.
2. **Processing.** The coordinates are sent to the OpenWeatherMap Air Pollution API, which returns current and forecast pollutant concentrations. The app converts these to the AQI scale, assigns a category, and prepares the forecast as a time series.
3. **Output.** The page renders the AQI card, the pollutant grid and the forecast chart.

The diagrams from the original project proposal are in [`docs/`](./docs): [`system-architecture.svg`](./docs/system-architecture.svg) and [`workflow-flowchart.svg`](./docs/workflow-flowchart.svg). The proposal described a larger system with its own sensors and forecasting model. What is built here is the dashboard layer on top of OpenWeatherMap data.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), React, TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Globe | [COBE](https://github.com/shuding/cobe) |
| Geocoding | OpenStreetMap Nominatim API |
| Air quality data | OpenWeatherMap Air Pollution API |
| Hosting | Vercel |

## How the AQI is calculated

OpenWeatherMap returns pollutant concentrations in micrograms per cubic metre, along with its own 1 to 5 index. The app does not use that index. It converts the PM2.5 and PM10 concentrations to the US EPA 0 to 500 AQI scale using the EPA's published breakpoint tables, because that scale is the one most people recognise. The conversion is in `lib/aqi-convert.ts`.

| AQI | Category |
|---|---|
| 0 to 50 | Good |
| 51 to 100 | Moderate |
| 101 to 150 | Unhealthy for sensitive groups |
| 151 to 200 | Unhealthy |
| 201 to 300 | Very unhealthy |
| 301 and above | Hazardous |

## Project structure

```text
Aerowatch/
  app/                  Next.js pages, layout, global styles
  components/
    AQICard.tsx         Main AQI card
    PollutantGrid.tsx   Six pollutant cards
    ForecastChart.tsx   Five-day forecast chart
    SearchBar.tsx       City search
    GlobeMount.tsx      3D globe
  lib/
    owm.ts              OpenWeatherMap API calls
    geocode.ts          Nominatim place search
    aqi-convert.ts      AQI calculation
  types/                TypeScript types
  docs/                 Diagrams from the original proposal
  .eslintrc.json
  next.config.mjs
  tailwind.config.ts
  package.json
```

## Getting started

### Requirements

- Node.js 18 or later
- A free API key from [OpenWeatherMap](https://openweathermap.org/api)

### Installation

```bash
git clone https://github.com/satwik88/Aerowatch.git
cd Aerowatch
npm install
```

Create a file named `.env.local` in the project root:

```env
NEXT_PUBLIC_OWM_API_KEY=your_api_key_here
```

A new OpenWeatherMap key can take up to an hour to start working.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If that port is busy, Next.js picks the next free one and prints it in the terminal.

### Production build

```bash
npm run build
npm start
```

The production build runs ESLint and fails on errors such as unused imports or `any` types, so run it locally before pushing.

## Deployment

The site is deployed on Vercel from the `main` branch.

1. Import the repository in Vercel.
2. In Project Settings, open Environment Variables and add `NEXT_PUBLIC_OWM_API_KEY` for Production, Preview and Development. Because the name starts with `NEXT_PUBLIC_`, Vercel recommends saving it as a plain (Config) variable and not as a Secret.
3. Redeploy. Environment variable changes only apply to new deployments.

## Limitations

- **Data source.** Air quality values and the forecast come from OpenWeatherMap, which provides model-based data at grid resolution. Readings can differ from an official monitoring station nearby.
- **No custom forecasting model.** The forecast is not produced by a model trained for this project.
- **API key visibility.** The key is a `NEXT_PUBLIC_` variable, so it is included in the browser bundle and visible to anyone who inspects the page. This is acceptable for a free-tier key in a course project but not for production.
- **Single-point results.** Each result is for one coordinate, so a large city is represented by a single reading.
- **Not a medical tool.** The health notes are general guidance.

## Future scope

- Move API calls into a Next.js route handler so the key stays on the server
- Add a map view with air quality shown across a region
- Train a forecasting model on historical pollutant data and compare it with the OpenWeatherMap forecast
- Accept readings from low-cost community sensors alongside the API data
- Push notifications when AQI at a saved location crosses a threshold
- Save favourite locations and a comparison view between cities

## Environmental relevance

Access to local, current air quality data lets people reduce exposure by choosing when and where to be outdoors. The same data, collected at finer resolution, could help planners decide where to target traffic restrictions or dust control. The project shows that this kind of tool can be built from free public data, with no dedicated infrastructure.

## References

- OpenWeatherMap, [Air Pollution API documentation](https://openweathermap.org/api/air-pollution)
- OpenStreetMap, [Nominatim geocoding service](https://nominatim.org)
- US EPA, [AirNow: Air Quality Index basics](https://www.airnow.gov/aqi/aqi-basics/)
- COBE, [WebGL globe library](https://cobe.vercel.app)
- World Health Organization, Global Air Quality Guidelines (2021)

## Academic details

| Item | Detail |
|---|---|
| Project | AeroWatch: air quality monitoring and forecasting |
| Course | Environmental Studies and E-Waste Management (BCS508) |
| Semester | V, ISE/CSE |
| Institution | RV Institute of Technology and Management |
| Author | Satwik Raj ([@satwik88](https://github.com/satwik88)) |
