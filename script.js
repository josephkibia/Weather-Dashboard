const API_KEY = '60bb5f1cc2154272ff5a1609cd9c9340';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
// const BASE_URL_FORCAST = 'https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={key}&units=metric'

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchHistoryContainer = document.getElementById('search-history');
const loadingEl = document.getElementById('loading');
const errorMessageEl = document.getElementById('error-message');
const errorTextEl = document.getElementById('error-text');
const weatherDisplay = document.getElementById('weather-display');
const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const weatherIconEl = document.getElementById('weather-icon');
const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const feelsLikeEl = document.getElementById('feels-like');
const forecastCardsEl = document.getElementById('forecast-cards');


async function searchWeather(city) {
    loadingEl.hidden = false;
    weatherDisplay.hidden = true;
    errorMessageEl.hidden = true;
    searchBtn.disabled = true;

    try{
        const[currentWeatherResponse, weatherForcastResonse] = await Promise.all([
            fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`),
            fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`)

        ])
        // const currentWeatherResponse = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        // const weatherForcastResonse = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`)

        if(!currentWeatherResponse.ok){
            if(currentWeatherResponse.status === 404){
                throw new Error(`Check your spelling.${city} doesn't exist`);
            }
            if(currentWeatherResponse.status === 403){
                throw new Error(`Forbidden: API rate limit exceded`)
            }
            throw new Error(`Weather API error: ${currentWeatherResponse.status}`)

        }
        const weatherData = await currentWeatherResponse.json();
        //console.log(weatherData);
        const forecastData = await weatherForcastResonse.json();

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);

    }
    catch(error){
      errorMessageEl.textContent = error.message;
      errorMessageEl.hidden = false
    }
    finally{
        loadingEl.hidden = true;
        searchBtn.disabled = false;
    }
    
}

function displayCurrentWeather(weatherData){
    const{name} = weatherData;
    const { temp,feels_like,humidity} = weatherData.main;
    const { description, icon } = weatherData.weather[0];
    const {speed} = weatherData.wind;
     cityNameEl.textContent = name;
     temperatureEl.textContent = `${Math.round(temp)} °C`;
     descriptionEl.textContent = description;
     weatherIconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
     weatherIconEl.alt = description;
     humidityEl.textContent = `${humidity}%`;
      windEl.textContent = `${speed} m/s`;
      feelsLikeEl.textContent = `${Math.round(feels_like)}°C`;
      weatherDisplay.hidden = false;
      saveToHistory(name);
}

function displayForecast(data){
    forecastCardsEl.innerHTML = '';

    //Filter to get one entry per day (at noon or closest to it)
    const dailyData = filterDailyForecast(data.list);

    dailyData.forEach(function (day) {

        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const { icon, description } = day.weather[0];
        const tempHigh = Math.round(day.main.temp_max);
        const tempLow = Math.round(day.main.temp_min);

        const card = document.createElement('div');
        card.className = 'forecast-card';

        card.innerHTML = `
            <div class="day">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <div class="temp-high">${tempHigh}°C</div>
            <div class="temp-low">${tempLow}°C</div>
        `;
        forecastCardsEl.appendChild(card);
    })
}
function filterDailyForecast(list) {
    const days = {};

    list.forEach(function(item) {
        const date = new Date(item.dt * 1000).toLocaleDateString();

        if (!days[date]) {
            days[date] = item;
        }
    });

    // Remove today (we already show current weather) and take next 5 days
    const allDays = Object.values(days);
    return allDays.slice(1, 6);
}

searchBtn.addEventListener('click', function() {
    const city = cityInput.value.trim();
    if (city !== '') {
        searchWeather(city);
    }
});

cityInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city !== '') {
            searchWeather(city);
        }
    }
});



// script.js

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('weather-history')) || [];

    // Remove the city if it already exists (to avoid duplicates)
    history = history.filter(function(item) {
        return item.toLowerCase() !== city.toLowerCase();
    });

    // Add the new city to the beginning
    history.unshift(city);

    // Keep only the last 5
    if (history.length > 5) {
        history = history.slice(0, 5);
    }

    localStorage.setItem('weather-history', JSON.stringify(history));
    renderSearchHistory();
}

function renderSearchHistory() {
    const history = JSON.parse(localStorage.getItem('weather-history')) || [];
    searchHistoryContainer.innerHTML = '';

    history.forEach(function(city) {
        const btn = document.createElement('button');
        btn.className = 'history-btn';
        btn.textContent = city;
        btn.addEventListener('click', function() {
            cityInput.value = city;
            searchWeather(city);
        });
        searchHistoryContainer.appendChild(btn);
    });
}

// Load search history when the page opens
renderSearchHistory();