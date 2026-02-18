# 🌤️ Weather App

A responsive Weather Forecast Web Application built using **HTML, CSS, and JavaScript** that provides real-time weather data including current conditions, daily forecast, and hourly forecast.

---

## 🔗 Live Demo

👉 https://jeya-surya.github.io/Weather-App/

---

## 📌 Features

- 🔍 Search weather by city name  
- 🌡️ View current temperature  
- 🤒 “Feels like” temperature  
- 💧 Humidity percentage  
- 💨 Wind speed  
- 🌧️ Precipitation details  
- 📅 7-day daily forecast  
- 🕒 24-hour hourly forecast  
- 🌍 Unit toggle (Celsius / Fahrenheit)  
- 📱 Fully responsive design  

---

## 🛠️ Technologies Used

- HTML5  
- CSS3 (Custom properties, Grid, Flexbox)  
- JavaScript (ES6+)  
- Open-Meteo API (Geocoding + Weather API)  

---

## 📂 Project Structure

```text
Weather-App/
│
├── index.html          # Main HTML file
├── style.css           # Main stylesheet
├── script.js           # JavaScript logic (API calls & UI updates)
│
└── assets/
    │
    ├── images/         # Icons, backgrounds, logos
    │   ├── logo.svg
    │   ├── icon-search.svg
    │   ├── icon-units.svg
    │   ├── bg-today-small.svg
    │   ├── bg-today-large.svg
    │   └── icon-*.webp
    │
    └── fonts/          # Custom font files
        ├── dm-sans-v16-latin-300.woff2
        ├── dm-sans-v16-latin-500.woff2
        ├── dm-sans-v16-latin-600.woff2
        ├── dm-sans-v16-latin-600italic.woff2
        ├── dm-sans-v16-latin-700.woff2
        └── bricolage-grotesque-v8-latin-700.woff2
```

## 🚀 How It Works

1. User enters a location.  
2. The app fetches latitude & longitude using the Open-Meteo Geocoding API.  
3. Weather data is fetched using the Open-Meteo Forecast API.  
4. The UI dynamically updates with current, daily, and hourly data.  
5. Icons change based on weather codes.  

---

## ⚙️ Setup Instructions (Run Locally)

1. Clone the repository
2. Open the project folder.  
3. Open `index.html` in your browser.  

No build tools or installation required.

---

## 🎯 Future Improvements

- Add loading spinner  
- Add error UI instead of alert()  
- Add dark/light mode toggle  
- Add geolocation support  
- Improve performance with caching  

---

## 👨‍💻 Author

**Jeya Surya D S**  
B.Tech – Computer Science and Business Systems  

---

## 📄 License

This project is open-source and free to use.





