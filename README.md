# WeatherWebApp

A high-performance, responsive weather application built with React, featuring a modern glassmorphism design and Samsung One UI-inspired dynamic gradients. This application includes automated global day and night detection, live regional local time tracking, and smooth, physics-inspired CSS/SVG animations that adapt seamlessly to worldwide forecasts and extreme weather conditions. **[Check out the Live App](https://weather-app-rib4.vercel.app/)**

---

## Key Features

* **Global Forecasting & Regional Local Time:** Search any city worldwide to retrieve current meteorological data, including temperature, feels-like metrics, daily highs and lows, relative humidity, atmospheric pressure, sunrise and sunset schedules, and the precise local time for that specific region.
* **Smart Day & Night Theme Engine:** Bypasses local device clock constraints by utilizing the target city's exact timezone offset and API condition codes to automatically switch between bright daytime aesthetics and eye-friendly dark mode gradients.
* **Granular Weather Condition Mapping:**
* *Daytime Themes:* Vibrant palettes explicitly configured for sunny, clear skies, clouds, haze, rain, snow, thunderstorms, and sleet.
* *Nighttime Themes:* Specialized dark palettes (`night-clear`, `night-cloudy`, `night-rainy`, `night-snowy`, `night-haze`, `night-storm`, and `night-sleet`) designed for evening visibility.


* **Advanced Extreme Weather Logic:** Custom condition triggers detect "Squalls", "Torrential Rain", "Sleet" (simultaneous rain and snow), and even simulate "Heat Lightning" on hot, highly humid, overcast days.
* **Realistic SVG Weather Physics:** Utilizes optimized 60 FPS CSS keyframe animations paired with scalable vector graphics (SVG). Features double-strobe jagged lightning bolts with plasma drop-shadow glows, synchronized ambient cloud flashes, falling rain particles, drifting snowflakes, and rolling mist wisps.
* **Intelligent Celestial Rendering:** The sun and moon automatically hide behind the cloud layer during heavy storms, overcast conditions, and torrential downpours for maximum immersion.
* **Air Quality Index (US EPA):** Computes standard United States AQI metrics based on PM2.5 concentrations, delivering a detailed breakdown of both PM2.5 and PM10 microgram measurements.
* **Responsive Layout Design:** Adapts smoothly across various viewports, featuring an optimized grid configuration for desktop environments and dedicated full-width cards for mobile layouts.

---

## Architecture & Core Logic

### 1. Regional Local Time & Timezone Calculation (`SearchBox.jsx`)

To resolve discrepancies caused by differing geographical time zones, the application processes time data directly from the OpenWeatherMap payload:

* Retrieves the raw `timezone` offset value in seconds from UTC.
* Computes the current UTC timestamp in milliseconds and applies the city-specific offset.
* Formulates a localized 12-hour time string and tracks the exact `cityHour` integer to govern global day/night state transitions.

### 2. Theme & Day/Night Engine (`WeatherApp.jsx`)

* **Time Validation:** Evaluates whether the API weather condition icon ends with `'n'` or if the target city's local hour falls outside daytime boundaries (before 6:00 AM or at/after 7:00 PM).
* **State Mapping:** Evaluates active meteorological conditions (such as precipitation, atmospheric obstruction, cloud cover, and solar clarity) to assign corresponding Samsung One UI-inspired CSS gradient themes. Evaluates simultaneous variables to trigger complex backgrounds like `sleet` (snow + rain).

### 3. Visual Effects Pipeline (`WeatherEffects.jsx` & CSS)

* **Vector Lightning Rendering:** Uses `vector-effect="non-scaling-stroke"` to maintain sharp, 2px-wide jagged lightning paths across all screen sizes. Combines CSS `drop-shadow` stacking to create a neon/plasma illusion.
* **Particle Generation:** Leverages JavaScript array mapping to dynamically instantiate randomized particle structures for rain and snow layers, allowing them to render independently or simultaneously.
* **Atmospheric Styling:** Implements radial gradients for solar illumination, a pulsing lunar radiance effect (`.moon-glow-effect`), blurred drifting cloud containers (`.cloud-layer`), and shifting atmospheric haze wisps. Includes conditional blockers to dynamically mount/unmount celestial glows during heavy weather events.

---

## Tech Stack

* **Frontend:** React.js
* **Styling:** Custom CSS (Glassmorphism, Flexbox, Gradients, Keyframe Animations, SVG Physics)
* **Icons:** Material-UI (MUI)
* **APIs:** OpenWeatherMap Weather & Air Pollution APIs

---

## Local Development Guide

To set up and run this project locally, execute the following instructions in your terminal:

### Prerequisites

Verify that [Node.js](https://nodejs.org/) is installed on your workstation.

### Step 1: Clone the repository

```bash
git clone https://github.com/aslivashu/WeatherApp.git

```

### Step 2: Navigate to the project directory

```bash
cd WeatherApp

```

### Step 3: Install dependencies

```bash
npm install

```

### Step 4: Start the development server

```bash
npm run dev

```

Open the provided local development link (typically `http://localhost:5173`) in your web browser.

### API Configuration Notice

To facilitate immediate out-of-the-box testing, a default free-tier OpenWeatherMap API key has been included within `SearchBox.jsx`. If you plan to fork this repository or deploy a production instance, please register for your own complimentary API key at OpenWeatherMap and replace the existing key to prevent rate-limiting restrictions.

---

## Contributing

Contributions are always welcome! If you'd like to improve this weather app:

1. **Fork** the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

*Developed by Sarthak*