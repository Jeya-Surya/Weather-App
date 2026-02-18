const ddlUnits = document.querySelector("#ddlUnits");
const ddlDay = document.querySelector("#ddlDay");
const txtSearch = document.querySelector("#txtSearch");
const btnSearch = document.querySelector("#btnSearch");
const dvCityCountry = document.querySelector("#dvCityCountry");
const dvCurrDate = document.querySelector("#dvCurrDate");
const dvCurrTemp = document.querySelector("#dvCurrTemp");
const pFeelsLike = document.querySelector("#pFeelsLike");
const pHumidity = document.querySelector("#pHumidity");
const pWind = document.querySelector("#pWind");
const pPrecipitation = document.querySelector("#pPrecipitation");

const weatherCodeMap = {
  0: "sunny",
  1: "partly-cloudy", 2: "partly-cloudy",
  3: "overcast",
  45: "fog", 48: "fog",
  51: "drizzle", 53: "drizzle", 55: "drizzle", 56: "drizzle", 57: "drizzle",
  61: "rain", 63: "rain", 65: "rain", 66: "rain", 67: "rain", 80: "rain", 81: "rain", 82: "rain",
  71: "snow", 73: "snow", 75: "snow", 77: "snow", 85: "snow", 86: "snow",
  95: "storm", 96: "storm", 99: "storm"
};

let currentLat, currentLon;

async function getGeoData(query) {
  let search;

  if (typeof query === "string" && query.trim() !== "") {
    search = query.trim();
  } else {
    search = txtSearch.value.trim();
  }

  if (!search) return;

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${search}&count=1&language=en&format=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Geo Response status: ${response.status}`);

    const result = await response.json();
    
    if (!result.results || result.results.length === 0) {
      alert("Location not found");
      return;
    }

    const location = result.results[0];
    currentLat = location.latitude;
    currentLon = location.longitude;

    updateLocationUI(location);
    getWeatherData(currentLat, currentLon);
  } catch (error) {
    console.error("Error fetching location:", error.message);
  }
}

function updateLocationUI(locationData) {
  const city = locationData.name || "Unknown Location";
  const country = locationData.country || "";
  
  const dateOptions = { year: "numeric", month: "short", day: "numeric", weekday: "long" };
  const currDate = new Intl.DateTimeFormat("en-US", dateOptions).format(new Date());

  dvCityCountry.textContent = country ? `${city}, ${country}` : city;
  dvCurrDate.textContent = currDate;
}

async function getWeatherData(lat, lon) {
  const isFahrenheit = ddlUnits.value === "F";
  const unitParams = isFahrenheit 
    ? "&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch"
    : "&wind_speed_unit=kmh&temperature_unit=celsius&precipitation_unit=mm";

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,precipitation,wind_speed_10m${unitParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather Response status: ${response.status}`);

    const weatherData = await response.json();
    
    loadCurrentWeather(weatherData);
    loadDailyForecast(weatherData.daily);
    loadHourlyForecast(weatherData.hourly);
  } catch (error) {
    console.error("Error fetching weather:", error.message);
  }
}

function loadCurrentWeather(data) {
  const { current, current_units } = data;
  
  dvCurrTemp.textContent = Math.round(current.temperature_2m);
  pFeelsLike.textContent = Math.round(current.apparent_temperature);
  pHumidity.textContent = current.relative_humidity_2m;
  
  const iconName = weatherCodeMap[current.weather_code] || "sunny";
  const currentIconImg = document.querySelector(".current__icon");
  if(currentIconImg) currentIconImg.src = `assets/images/icon-${iconName}.webp`;

  const windUnit = current_units.wind_speed_10m.replace("mp/h", "mph");
  const precipUnit = current_units.precipitation.replace("inch", "in");
  
  pWind.textContent = `${current.wind_speed_10m} ${windUnit}`;
  pPrecipitation.textContent = `${current.precipitation} ${precipUnit}`;
}

function loadDailyForecast(daily) {
  for (let i = 0; i < 7; i++) {
    const container = document.querySelector(`#dvForecastDay${i + 1}`);
    if (!container) continue;

    const date = new Date(daily.time[i]);
    const dayOfWeek = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
    const weatherCodeName = weatherCodeMap[daily.weather_code[i]] || "sunny";
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);

    container.innerHTML = `
      <p class="daily__day-title">${dayOfWeek}</p>
      <img class="daily__day-icon" src="assets/images/icon-${weatherCodeName}.webp" alt="${weatherCodeName}" width="60" height="60">
      <div class="daily__day-temps">
        <p class="daily__day-high">${maxTemp}°</p>
        <p class="daily__day-low">${minTemp}°</p>
      </div>
    `;
  }
}

function loadHourlyForecast(hourlyData) {
    if (hourlyData.target) {
        hourlyData = ddlDay.hourlyCache;
    } else {
        ddlDay.hourlyCache = hourlyData;
    }

    if (!hourlyData) return;

    const dayIndex = parseInt(ddlDay.value, 10) || 0;
    const firstHourIndex = 24 * dayIndex;
    const lastHourIndex = 24 * (dayIndex + 1) - 1;

    let uiIndex = 1;

    for (let i = firstHourIndex; i <= lastHourIndex; i++) {
        const container = document.querySelector(`#dvForecastHour${uiIndex}`);
        if (!container) break;

        const weatherCodeName = weatherCodeMap[hourlyData.weather_code[i]] || "sunny";
        const temp = Math.round(hourlyData.temperature_2m[i]);
        const timeString = new Date(hourlyData.time[i]).toLocaleString("en-US", { hour: "numeric", hour12: true });

        container.innerHTML = `
            <img class="hourly__hour-icon" src="assets/images/icon-${weatherCodeName}.webp" alt="${weatherCodeName}" width="40" height="40">
            <p class="hourly__hour-time">${timeString}</p>
            <p class="hourly__hour-temp">${temp}°</p>
        `;
        uiIndex++;
    }
}

function populateDayOfWeek() {
  const currDate = new Date();
  const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });

  for (let i = 0; i < 7; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = dayFormatter.format(currDate);
    option.className = "hourly__select-day";
    ddlDay.appendChild(option);
    
    currDate.setDate(currDate.getDate() + 1);
  }
}

populateDayOfWeek();
getGeoData("Chennai, India");

btnSearch.addEventListener("click", getGeoData);
txtSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getGeoData();
});

ddlUnits.addEventListener("change", () => {
    if (currentLat && currentLon) getWeatherData(currentLat, currentLon);
});

ddlDay.addEventListener("change", loadHourlyForecast);