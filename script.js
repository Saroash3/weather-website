const apiKey = '019924a3e10befc076a900a137df8024'; // OpenWeather API key
const getWeatherBtn = document.getElementById('get-weather-btn');
const cityInput = document.getElementById('city-input');

const cityNameEl = document.getElementById('city-name');
const descriptionEl = document.getElementById('description');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

const barChartCtx = document.getElementById('bar-chart').getContext('2d');
const lineChartCtx = document.getElementById('line-chart').getContext('2d');
const doughnutChartCtx = document.getElementById('doughnut-chart').getContext('2d');

let barChart, lineChart, doughnutChart;

getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value;
    fetchWeather(city);
    fetchForecast(city);
});

function fetchWeather(city) {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => {
            const data = response.data;
            const weatherIconEl = document.querySelector('.icon');
            const iconCode = data.weather[0].icon; 
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIconEl.src=iconUrl;
            console.log(data);
            cityNameEl.textContent = data.name;
            descriptionEl.textContent = data.weather[0].description;
            tempEl.textContent = data.main.temp;
            humidityEl.textContent = data.main.humidity;
            windSpeedEl.textContent = data.wind.speed;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('City not found or API limit reached.');
        });
}

function fetchForecast(city) {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => {
            const forecastData = response.data.list;
            const temperatures = forecastData.map(item => item.main.temp);
            const labels = forecastData.map(item => item.dt_txt);

            const weatherCounts = {};
            forecastData.forEach(item => {
                const weather = item.weather[0].main;
                weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
            });

            const doughnutLabels = Object.keys(weatherCounts);
            const doughnutData = Object.values(weatherCounts);

            updateBarChart(labels, temperatures);
            updateLineChart(labels, temperatures);
            updateDoughnutChart(doughnutLabels, doughnutData);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function updateBarChart(labels, data) {
    if (barChart) barChart.destroy();
    barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{ label: 'Temperature (°C)', data, backgroundColor: 'rgba(75,192,192,0.2)' }]
        },
        options: { responsive: true }
    });
}

function updateLineChart(labels, data) {
    if (lineChart) lineChart.destroy();
    lineChart = new Chart(lineChartCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [{ label: 'Temperature (°C)', data, borderColor: 'rgba(75,192,192,1)', fill: false }]
        },
        options: { responsive: true }
    });
}

function updateDoughnutChart(labels, data) {
    if (doughnutChart) doughnutChart.destroy();
    doughnutChart = new Chart(doughnutChartCtx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data, backgroundColor: ['rgba(54,162,235,0.7)', 'rgba(75,192,192,0.7)', 'rgba(153,102,255,0.7)'] }]
        },
        options: { responsive: true }
    });
}
