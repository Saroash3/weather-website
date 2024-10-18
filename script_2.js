const apiKey = '019924a3e10befc076a900a137df8024'; // OpenWeather API key
const geminiApiKey = 'AIzaSyA4IUptIqH78ot1p1TLIwEwQZ-IFpqw0Bg'; // Gemini API key

const getWeatherBtn = document.getElementById('get-weather-btn');
const cityInput = document.getElementById('city-input');
const tableBody = document.querySelector('#weather-table tbody');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatResponseEl = document.getElementById('chat-response');

let currentPage = 0;
const rowsPerPage = 10;
let forecastData = [];

// Fetch Weather Forecast
getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city === '') {
        alert('Please enter a city name.');
        return;
    }
    fetchForecast(city);
});

async function fetchForecast(city) {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        forecastData = response.data.list;
        displayTable();
    } catch (error) {
        console.error('Error fetching forecast:', error.response?.data || error.message);
        alert('Error fetching forecast data. Please try again.');
    }
}

function displayTable() {
    tableBody.innerHTML = ''; // Clear the existing table content
    const start = currentPage * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = forecastData.slice(start, end);

    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.dt_txt}</td>
            <td>${item.main.temp} °C</td>
            <td>${item.weather[0].description}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle Pagination
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        displayTable();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if ((currentPage + 1) * rowsPerPage < forecastData.length) {
        currentPage++;
        displayTable();
    }
});

// Chatbot Integration
sendBtn.addEventListener('click', () => {
    const userQuery = chatInput.value.trim();
    if (userQuery === '') return;
    chatInput.value = ''; // Clear the input field

    chatResponseEl.innerHTML += `<p><strong>You:</strong> ${userQuery}</p>`; // Display user query

    if (userQuery.toLowerCase().includes('weather')) {
        chatResponseEl.innerHTML += `<p><em>Chatbot:</em> Please enter a city name to get weather information.</p>`;
    } else {
        callGeminiAPI(userQuery);
    }
});

async function callGeminiAPI(query) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;

    try {
        const response = await axios.post(
            apiUrl,
            {
                contents: [{ parts: [{ text: query }] }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Log the entire API response
        console.log('Gemini API Response:', response);
    } catch (error) {
        console.error('Error with Gemini API:', error.response?.data || error.message);
        chatResponseEl.innerHTML += `<p><em>Chatbot:</em> Sorry, I couldn't process your request.</p>`;
    }
}
