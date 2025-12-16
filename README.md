# Weather Forecast App

This is a responsive weather forecast web application built with HTML, Tailwind CSS, and JavaScript.

## Features
- Search weather by city name
- Get weather of current location
- Save recent cities (localStorage)
- Show current + 5-day forecast
- Temperature unit toggle (°C/°F)
- Custom alerts for extreme heat
- Dynamic weather backgrounds (rain/sunny)
- Clean error handling (no alerts)
- Responsive for desktop, iPad Mini, iPhone SE

## API Used
OpenWeatherMap API (https://openweathermap.org/api)

## JavaScript Functionality
- Event Listeners: Handles user interactions, such as searching for a city, using the current location, and viewing the extended forecast.

- Data Fetching: Utilizes the OpenWeatherMap API to fetch weather data based on the city name or current coordinates.

- Weather Display: Updates the DOM with the fetched weather data, including the current weather and extended forecast.

- Search History: Manages the user's search history using sessionStorage, enabling quick access to previous searches.

## Tailwind CSS
The project uses Tailwind CSS for styling, ensuring a modern and responsive design. Custom animations for fading in elements and sliding them into view are also implemented.

## Setup Instructions
1. Download the project or clone the repo.
2. Replace the API key in script.js with your own key:
   ```js
   const API_KEY = "YOUR_API_KEY_HERE";



## Technologies Used
HTML
CSS (Tailwind CSS)
JavaScript
OpenWeatherMap API