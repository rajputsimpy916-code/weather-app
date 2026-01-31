
const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');


const OPENWEATHER_API_KEY = "391bc3898a00e82a7b8be9af3e88fdf8";

function setWeatherBackground(temp, precipitation) {
    const body = document.body;
    body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'default');

    if (precipitation > 5) {
        body.classList.add('rainy');
    } else if (temp < 5) {
        body.classList.add('snowy');
    } else if (temp > 25) {
        body.classList.add('sunny');
    } else {
        body.classList.add('cloudy');
    }
}

async function fetchWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        
        const temp = json.main?.temp ?? null;
        const humidity = json.main?.humidity ?? null;
        const wind = (json.wind?.speed ?? null);
        
        const precipitation = (json.rain?.['1h'] ?? json.rain?.['3h'] ?? json.snow?.['1h'] ?? 0);

        return {
            name: json.name || city,
            country: (json.sys && json.sys.country) || '',
            temp,
            humidity,
            wind,
            precipitation
        };
    } catch (err) {
        console.error('fetchWeather error', err);
        return null;
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    weatherResult.innerHTML = 'Loading...';

    const data = await fetchWeather(city);
    if (!data) {
        weatherResult.innerHTML = '<p>Could not fetch weather. Check console for details.</p>';
        return;
    }

    setWeatherBackground(data.temp, data.precipitation);
    weatherResult.innerHTML = `
        <h2>${data.name}${data.country ? ', ' + data.country : ''}</h2>
        <p><strong>Temperature:</strong> ${data.temp} °C</p>
        <p><strong>Humidity:</strong> ${data.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind} m/s</p>
        <p><strong>Precipitation:</strong> ${data.precipitation} mm</p>
    `;
});
