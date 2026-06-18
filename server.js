const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

let cachedWeather = null;
let cacheTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minuta

const CITY = {
  name: 'Kosovska Mitrovica',
  latitude: 42.8914,
  longitude: 20.8660,
  timezone: 'Europe/Belgrade'
};

const weatherDescriptions = {
  0: 'Vedro',
  1: 'Pretežno vedro',
  2: 'Delimično oblačno',
  3: 'Oblačno',
  45: 'Magla',
  48: 'Magla sa injem',
  51: 'Slaba rosulja',
  53: 'Umerena rosulja',
  55: 'Jaka rosulja',
  61: 'Slaba kiša',
  63: 'Umerena kiša',
  65: 'Jaka kiša',
  71: 'Slab sneg',
  73: 'Umeren sneg',
  75: 'Jak sneg',
  80: 'Slabi pljuskovi',
  81: 'Umereni pljuskovi',
  82: 'Jaki pljuskovi',
  95: 'Grmljavina',
  96: 'Grmljavina sa slabim gradom',
  99: 'Grmljavina sa jakim gradom'
};

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if ([1, 2].includes(code)) return '🌤️';
  if (code === 3) return '☁️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
  if ([71, 73, 75].includes(code)) return '❄️';
  if ([95, 96, 99].includes(code)) return '⛈️';
  return '🌡️';
}

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

    const url = new URL('https://api.open-meteo.com/v1/forecast');

    url.searchParams.set('latitude', CITY.latitude);
    url.searchParams.set('longitude', CITY.longitude);
    url.searchParams.set('timezone', CITY.timezone);
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m');
    url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max');
    url.searchParams.set('forecast_days', '7');

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();
    const currentCode = data.current.weather_code;

    const forecast = data.daily.time.map((date, index) => {
      const code = data.daily.weather_code[index];

      return {
        date: date,
        icon: getWeatherIcon(code),
        description: weatherDescriptions[code] || 'Nepoznato',
        minTemperature: data.daily.temperature_2m_min[index],
        maxTemperature: data.daily.temperature_2m_max[index],
        precipitation: data.daily.precipitation_sum[index],
        windSpeed: data.daily.wind_speed_10m_max[index]
      };
    });

    const weatherResult = {
      city: CITY.name,
      source: 'Open-Meteo JSON web service',
      updatedAt: data.current.time,
      current: {
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        windSpeed: data.current.wind_speed_10m,
        icon: getWeatherIcon(currentCode),
        description: weatherDescriptions[currentCode] || 'Nepoznato'
      },
      forecast: forecast
    };

    cachedWeather = weatherResult;
    cacheTime = Date.now();

    res.json(weatherResult);

  } catch (error) {
    console.log('Greška:', error.message);

    res.json({
      city: CITY.name,
      source: 'Rezervni podaci - Open-Meteo trenutno nije dostupan',
      updatedAt: new Date().toISOString(),
      current: {
        temperature: '--',
        feelsLike: '--',
        humidity: '--',
        precipitation: '--',
        windSpeed: '--',
        icon: '⚠️',
        description: 'Web servis trenutno nije dostupan'
      },
      forecast: []
    });
  }
});

app.listen(PORT, () => {
  console.log(`Aplikacija radi na portu ${PORT}`);
});
