// Replace with your OpenWeatherMap API key
const API_KEY = "869a63cd732b74656ca32da705c36a53"; //place you api key 
console.log("✅ JS file loaded!");

// DOM elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const currentWeatherEl = document.getElementById("currentWeather");
const forecastEl = document.getElementById("forecast");
const errorBox = document.getElementById("errorBox");
const recentWrapper = document.getElementById("recentWrapper");
const recentDropdown = document.getElementById("recentDropdown");
const unitToggle = document.getElementById("unitToggle");



// Constants
const RECENT_KEY = "recentCities";
const MAX_RECENT = 5;

// State
let lastCelsiusTemp = null;
let currentWeatherData = null;

//Display errors
function showError(message) {
  errorBox.innerHTML = `
    <div class="card p-3 rounded-md border border-red-400/30">
      <strong class="text-red-200">Error:</strong>
      <p class="text-sm text-white/90 mt-1">${escapeHtml(message)}</p>
    </div>`;
}

//clear errors
function clearError() {
  errorBox.innerHTML = "";
}
//escaping extra symbols
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ========== Recent Searches ==========
function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecent(city) {
  if (!city) return;
  const arr = getRecent().filter(c => c.toLowerCase() !== city.toLowerCase());
  arr.unshift(city);
  if (arr.length > MAX_RECENT) arr.pop();
  localStorage.setItem(RECENT_KEY, JSON.stringify(arr));
  renderRecent();
}

function renderRecent() {
  const arr = getRecent();
  if (!arr.length) {
    recentWrapper.classList.add("hidden");
    recentDropdown.innerHTML = "";
    return;
  }
  recentWrapper.classList.remove("hidden");
  recentDropdown.innerHTML = arr.map(city => `
    <button class="recent-btn card px-3 py-1 rounded-md text-sm text-white/90 hover:bg-white/10"
      data-city="${escapeHtml(city)}">${escapeHtml(city)}</button>
  `).join(" ");
  
  recentDropdown.querySelectorAll(".recent-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const c = btn.dataset.city;
      cityInput.value = c;
      handleSearch();
    });
  });
}

// ========== API Helpers ==========
async function fetchCurrentByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  return fetchJson(url);
}

async function fetchCurrentByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return fetchJson(url);
}

async function fetchForecastByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  return fetchJson(url);
}

async function fetchForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return fetchJson(url);
}

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API error (${res.status})`);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

// ========== Rendering ==========
function renderCurrent(data) {
  currentWeatherData = data;
  const name = data.name + (data.sys && data.sys.country ? `, ${data.sys.country} `: "");
  const desc = data.weather?.[0]?.description || "";
  const icon = data.weather?.[0]?.icon || "";
  const main = data.weather?.[0]?.main || "";
  const tempC = data.main?.temp;
  lastCelsiusTemp = tempC;
  const humidity = data.main?.humidity;
  const wind = data.wind?.speed;

  const tempDisplay = formatTemp(tempC, unitToggle.checked ? "F" : "C", true);

  currentWeatherEl.innerHTML = `
    <div class="card p-5 rounded-xl flex flex-col md:flex-row items-center gap-6">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold">${escapeHtml(name)}</h2>
        <p class="capitalize text-white/90 mt-1">${escapeHtml(desc)}</p>
        <div class="mt-3 flex items-center gap-4">
          <div class="text-5xl font-extrabold">${tempDisplay}</div>
          <div class="text-sm text-white/80">
            <p>💧 Humidity: <strong>${escapeHtml(String(humidity))}%</strong></p>
            <p> 🌬Wind: <strong>${escapeHtml(String(wind))} m/s</strong></p>
          </div>
        </div>
      </div>
      <div class="flex-shrink-0 text-center">
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${escapeHtml(desc)}" class="mx-auto" />
      </div>
    </div>
  `;

  if (tempC !== undefined && tempC > 40) {
    showExtremeTempAlert(tempC);
  } else {
    clearExtremeTempAlert();
  }

  applyBackground(main);
}

function formatTemp(celsius, unit = "C") {
  if (celsius === undefined || celsius === null) return "-";
  if (unit === "C") return `${Math.round(celsius)}°C`;
  const f = (celsius * 9/5) + 32;
  return `${Math.round(f)}°F`;
}

// ========== Alerts & Background ==========
let extremeAlertEl = null;
function showExtremeTempAlert(tempC) {
  clearExtremeTempAlert();
  extremeAlertEl = document.createElement("div");
  extremeAlertEl.className = "mt-3 card p-3 rounded-md border-l-4 border-yellow-400 bg-yellow-900/20";
  extremeAlertEl.innerHTML = `<strong class="text-yellow-200">Extreme Temperature</strong>
    <p class="text-sm text-white/90 mt-1">Current temperature is ${Math.round(tempC)}°C — stay hydrated!</p>`;
  currentWeatherEl.prepend(extremeAlertEl);
}
function clearExtremeTempAlert() {
  if (extremeAlertEl) {
    extremeAlertEl.remove();
    extremeAlertEl = null;
  }
}

function applyBackground(weatherMain) {
  document.body.classList.remove("bg-clear","bg-clouds","bg-rain","bg-snow","bg-thunder","bg-default");
  const existingRain = document.querySelector(".rain-overlay");
  if (existingRain) existingRain.remove();

  const wm = (weatherMain || "").toLowerCase();
  if (wm.includes("clear")) {
    document.body.classList.add("bg-clear");
  } else if (wm.includes("cloud")) {
    document.body.classList.add("bg-clouds");
  } else if (wm.includes("rain") || wm.includes("drizzle")) {
    document.body.classList.add("bg-rain");
    addRainOverlay();
  } else if (wm.includes("snow")) {
    document.body.classList.add("bg-snow");
  } else if (wm.includes("thunder")) {
    document.body.classList.add("bg-thunder");
    addRainOverlay();
  } else {
    document.body.classList.add("bg-default");
  }
}

function addRainOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "rain-overlay";
  document.body.appendChild(overlay);
}

// ========== Forecast ==========
function renderForecast(forecastData) {
  const list = forecastData.list || [];
  const groups = {};
  list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });

  const daily = Object.keys(groups).slice(0, 5).map(date => {
    const target = groups[date].find(i => i.dt_txt.includes("12:00")) || groups[date][0];
    return {
      date,
      temp: target.main.temp,
      icon: target.weather[0].icon,
      desc: target.weather[0].description,
      wind: target.wind.speed,
      humidity: target.main.humidity
    };
  });

  forecastEl.innerHTML = daily.map(d => `
    <div class="card rounded-lg p-4 text-center">
      <p class="font-semibold">${d.date}</p>
      <img src="https://openweathermap.org/img/wn/${d.icon}@2x.png" alt="${escapeHtml(d.desc)}" class="mx-auto" />
      <p class="capitalize text-sm">${escapeHtml(d.desc)}</p>
      <p class="mt-2 text-lg font-bold">${Math.round(d.temp)}°C</p>
      <p class="text-xs mt-1">💧 ${d.humidity}% | 🌬 ${d.wind} m/s</p>
    </div>
  `).join("");
}

// ========== Handlers ==========
async function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) return showError("Please enter a city name.");
  clearError();

  try {
    const current = await fetchCurrentByCity(city);
    renderCurrent(current);
    saveRecent(city);

    const forecast = await fetchForecastByCity(city);
    renderForecast(forecast);
  } catch (err) {
    showError(err.message || "Unable to fetch weather data.");
  }
}

async function handleLocation() {
  clearError();
  if (!navigator.geolocation) return showError("Geolocation not supported by your browser.");

  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords;
    try {
      const current = await fetchCurrentByCoords(latitude, longitude);
      renderCurrent(current);
      saveRecent(current.name);

      const forecast = await fetchForecastByCoords(latitude, longitude);
      renderForecast(forecast);
    } catch (err) {
      showError(err.message || "Unable to fetch weather data for your location.");
    }
  }, () => {
    showError("Unable to retrieve your location.");
  });
}

function handleUnitToggle() {
  if (!currentWeatherData) return;
  renderCurrent(currentWeatherData);
}

//handling events
searchBtn.addEventListener("click", handleSearch);
locBtn.addEventListener("click", handleLocation);
unitToggle.addEventListener("change", handleUnitToggle);
renderRecent();

console.log("✅ Weather App ready!");