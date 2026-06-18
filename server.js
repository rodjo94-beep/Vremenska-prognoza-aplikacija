const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

let cachedWeather = null;
let cacheTime = 0;
const CACHE_DURATION = 10 * 60 * 1000;

const CITY = {
  name: 'Kosovska Mitrovica'
};

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/weather', async (req, res) => {
  try {
    const now = Date.now();

    if (cachedWeather && now - cacheTime < CACHE_DURATION) {
      return res.json(cachedWeather);
    }

    const url = 'https://wttr.in/Kosovska%20Mitrovica?format=j1';

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Kosovska-Mitrovica-Weather-App'
      }
    });

    if (!response.ok) {
      throw new Error(`wttr.in API error: ${response.status}`);
    }

    const data = await response.json();

    const current = data.current_condition[0];

    const forecast = data.weather.slice(0, 7).map(day => {
      const code = Number(day.hourly[4].weatherCode);
      const description = day.hourly[4].weatherDesc[0].value;

      return {
        date: day.date,
        icon: getWeatherIcon(code),
        description: description,
        minTemperature: Number(day.mintempC),
        maxTemperature: Number(day.maxtempC),
        precipitation: Number(day.hourly[4].precipMM),
        windSpeed: Number(day.hourly[4].windspeedKmph)
      };
    });

    const weatherResult = {
      city: CITY.name,
      source: 'wttr.in JSON web service',
      updatedAt: new Date().toISOString(),
      current: {
        temperature: Number(current.temp_C),
        feelsLike: Number(current.FeelsLikeC),
        humidity: Number(current.humidity),
        precipitation: Number(current.precipMM),
        windSpeed: Number(current.windspeedKmph),
        icon: getWeatherIcon(Number(current.weatherCode)),
        description: current.weatherDesc[0].value
      },
      forecast
    };

    cachedWeather = weatherResult;
    cacheTime = Date.now();

    res.json(weatherResult);

  } catch (error) {
    console.log('Greška:', error.message);

    res.json({
      city: CITY.name,
      source: 'Greška pri učitavanju web servisa',
      updatedAt: new Date().toISOString(),
      current: {
        temperature: 0,
        feelsLike: 0,
        humidity: 0,
        precipitation: 0,
        windSpeed: 0,
        icon: '⚠️',
        description: 'Web servis trenutno nije dostupan'
      },
      forecast: []
    });
  }
});

function getWeatherIcon(code) {
  if ([113].includes(code)) return '☀️';
  if ([116].includes(code)) return '🌤️';
  if ([119, 122].includes(code)) return '☁️';
  if ([143, 248, 260].includes(code)) return '🌫️';
  if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359].includes(code)) return '🌧️';
  if ([179, 182, 185, 227, 230, 317, 320, 323, 326, 329, 332, 335, 338, 368, 371].includes(code)) return '❄️';
  if ([200, 386, 389, 392, 395].includes(code)) return '⛈️';
  return '🌡️';
}

app.listen(PORT, () => {
  console.log(`Aplikacija radi na portu ${PORT}`);
});
