const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const savedCitiesList = document.getElementById('saved-cities');

async function getWeatherData(city) {
  const apiKey =  'fe5e380ee8fb491f6a6407d84a97d527';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

function displayWeather(data) {
  if (!data) {
    weatherInfo.textContent = 'Neuspješno dohvaćanje vremenskih podataka.';
    return;
  }
  
  const cityName = data.name;
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const description = data.weather[0].description;
  
  weatherInfo.innerHTML = `
    <h2>Vrijeme u ${cityName}</h2>
    <p>Temperatura: ${temperature}°C</p>
    <p>Vlažnost: ${humidity}%</p>
    <p>Opis: ${description}</p>
  `;
}

function saveCity(city) {
  let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
  
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
    renderSavedCities();
  }
}

function renderSavedCities() {
  savedCitiesList.innerHTML = '';
  
  const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
  
  savedCities.forEach(city => {
    const cityItem = document.createElement('li');
    cityItem.textContent = city;
    cityItem.addEventListener('click', () => {
      cityInput.value = city;
      cityForm.dispatchEvent(new Event('submit'));
    });
    savedCitiesList.appendChild(cityItem);
  });
}

searchButton.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  const weatherData = await getWeatherData(city);
  displayWeather(weatherData);
  if (weatherData) {
    saveCity(city);
  }
});

renderSavedCities();
