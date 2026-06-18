const statusBox = document.getElementById('status');
const currentWeather = document.getElementById('currentWeather');
const forecastBody = document.getElementById('forecastBody');
const refreshBtn = document.getElementById('refreshBtn');

function formatDate(dateString) {
  return new Intl.DateTimeFormat('sr-RS', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateString));
}

function renderCurrent(data) {
  currentWeather.classList.remove('hidden');
  currentWeather.innerHTML = `
    <div class="current-top">
      <div>
        <p class="label">${data.city}</p>
        <p class="temp">${Math.round(data.current.temperature)}°C</p>
        <p class="description">${data.current.icon} ${data.current.description}</p>
        <p class="subtitle">Ažurirano: ${data.updatedAt.replace('T', ' ')}</p>
      </div>
      <div class="icon">${data.current.icon}</div>
    </div>

    <div class="details">
      <div class="detail-card">
        <span>Subjektivni osećaj</span>
        <strong>${Math.round(data.current.feelsLike)}°C</strong>
      </div>
      <div class="detail-card">
        <span>Vlažnost vazduha</span>
        <strong>${data.current.humidity}%</strong>
      </div>
      <div class="detail-card">
        <span>Padavine</span>
        <strong>${data.current.precipitation} mm</strong>
      </div>
      <div class="detail-card">
        <span>Vetar</span>
        <strong>${data.current.windSpeed} km/h</strong>
      </div>
    </div>
  `;
}

function renderForecast(forecast) {
  forecastBody.innerHTML = forecast.map(day => `
    <tr>
      <td>${formatDate(day.date)}</td>
      <td>${day.icon} ${day.description}</td>
      <td>${Math.round(day.minTemperature)}°C</td>
      <td>${Math.round(day.maxTemperature)}°C</td>
      <td>${day.precipitation} mm</td>
      <td>${day.windSpeed} km/h</td>
    </tr>
  `).join('');
}

async function loadWeather() {
  try {
    statusBox.textContent = 'Učitavanje prognoze...';
    statusBox.style.color = '#17324d';

    const response = await fetch('/api/weather');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Došlo je do greške.');
    }

    renderCurrent(data);
    renderForecast(data.forecast);
    statusBox.textContent = `Podaci su uspešno učitani iz web servisa: ${data.source}.`;
  } catch (error) {
    statusBox.textContent = `Greška: ${error.message}`;
    statusBox.style.color = '#b00020';
  }
}

refreshBtn.addEventListener('click', loadWeather);
loadWeather();


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .catch(error => console.log('Service worker nije registrovan:', error));
  });
}
