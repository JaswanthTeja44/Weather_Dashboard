    const weatherContainer = document.getElementById('weatherContainer');
    const errorMessage = document.getElementById('error');

    async function getWeather() {
      const city = document.getElementById('cityInput').value.trim();
      weatherContainer.innerHTML = '';
      errorMessage.textContent = '';

      if (!city) {
        errorMessage.textContent = 'Please enter a city name.';
        return;
      }

      try {
        // Get coordinates
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&country=IN`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('City not found in India.');
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Get weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();

        if (!weatherData.current_weather) {
          throw new Error('Weather data unavailable.');
        }

        const current = weatherData.current_weather;

        const card = document.createElement('div');
        card.className = 'weather-card';
        card.innerHTML = `
          <h2>${name}, ${country}</h2>
          <p><strong>Temp:</strong> ${current.temperature}°C</p>
          <p><strong>Wind:</strong> ${current.windspeed} km/h</p>
          <p><strong>Time:</strong> ${current.time}</p>
        `;

        weatherContainer.appendChild(card);
      } catch (error) {
        errorMessage.textContent = `Error: ${error.message}`;
      }
    }
