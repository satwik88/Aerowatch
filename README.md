# AeroWatch

A premium, real-time air quality monitoring and forecasting platform built with Next.js 14.

## Setup Instructions

1. **Install dependencies** (already done if you ran the creation commands)
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   Rename \`.env.example\` to \`.env.local\` and add your OpenWeatherMap API key:
   \`\`\`env
   NEXT_PUBLIC_OWM_API_KEY=your_actual_key_here
   \`\`\`
   You can get a free API key from [OpenWeatherMap](https://openweathermap.org/api).

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Built
- Next.js 14 App Router setup with Tailwind CSS

- **Search**: OpenStreetMap Nominatim for free, robust location search with autocomplete.
- **AQI Calculation**: Converts OpenWeatherMap PM2.5 and PM10 to US EPA scale.
- **Forecast Chart**: 5-day predictive trend using Recharts.
- **Premium Design**: Dark mode aesthetic, Framer Motion animations, and glassmorphic UI elements.
