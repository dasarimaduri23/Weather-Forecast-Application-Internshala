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