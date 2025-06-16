// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const path = require('path');
// const app = express();

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.post('/weather', async (req, res) => {
//   const city = req.body.city;
//   if (!city) return res.redirect('/');
//   try {
//     const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
//       params: {
//         key: process.env.WEATHER_API_KEY,
//         q: city
//       }
//     });
//     const data = response.data;
//     const params = new URLSearchParams({
//       location: `${data.location.name}, ${data.location.country}`,
//       temp: data.current.temp_c,
//       condition: data.current.condition.text,
//       humidity: data.current.humidity,
//       wind: data.current.wind_kph
//     }).toString();
//     res.redirect(`/response.html?${params}`);
//   } catch (error) {
//     res.status(500).send('Weather data could not be retrieved.');
//   }
// });

// app.listen(3000, () => {
//   console.log('🌐 Server is running at http://localhost:3000');
// });





// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const path = require('path');
// const fs = require('fs');  // To read the response.html file
// const app = express();

// // Access your API key from the environment
// const API_KEY = process.env.WEATHER_API_KEY;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public')); // Serving static files like styles.css, index.html, etc.

// // Serve the static index.html form
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the form
// });

// // Post route to fetch weather data and serve response.html
// app.post('/weather', async (req, res) => {
//   const city = req.body.city;
//   const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`;

//   try {
//     const response = await axios.get(url);
//     const weather = response.data;

//     // Read the response.html file and inject the weather data
//     let responseHtml = fs.readFileSync(path.join(__dirname, 'public', 'response.html'), 'utf8');

//     // Replace placeholders in the HTML with the actual data
//     responseHtml = responseHtml.replace('{{city}}', weather.location.name);
//     responseHtml = responseHtml.replace('{{country}}', weather.location.country);
//     responseHtml = responseHtml.replace('{{temp}}', weather.current.temp_c);
//     responseHtml = responseHtml.replace('{{condition}}', weather.current.condition.text);
//     responseHtml = responseHtml.replace('{{humidity}}', weather.current.humidity);
//     responseHtml = responseHtml.replace('{{wind}}', weather.current.wind_kph);

//     // Send the modified HTML as a response
//     res.send(responseHtml);
//   } catch (err) {
//     res.send(`
//       <p>Error: Could not fetch weather data. Please check the city name.</p>
//       <a href="/">Try again</a>
//     `);
//   }
// });

// app.listen(3000, () => {
//   console.log('🌐 Server is running on http://localhost:3000');
// });


require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const client = require('prom-client');  // 📈 Add prom-client

const app = express();
const API_KEY = process.env.WEATHER_API_KEY;
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 📊 Prometheus metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register }); // collects CPU, memory, etc.

const weatherCheckCounter = new client.Counter({
  name: 'weather_checks_total',
  help: 'Total number of weather data fetches',
});
register.registerMetric(weatherCheckCounter);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/weather', async (req, res) => {
  const city = req.body.city;
  const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`;

  try {
    const response = await axios.get(url);
    const weather = response.data;

    // 👇 Increment weather check counter
    weatherCheckCounter.inc();

    let responseHtml = fs.readFileSync(path.join(__dirname, 'public', 'response.html'), 'utf8');
    responseHtml = responseHtml.replace('{{city}}', weather.location.name);
    responseHtml = responseHtml.replace('{{country}}', weather.location.country);
    responseHtml = responseHtml.replace('{{temp}}', weather.current.temp_c);
    responseHtml = responseHtml.replace('{{condition}}', weather.current.condition.text);
    responseHtml = responseHtml.replace('{{humidity}}', weather.current.humidity);
    responseHtml = responseHtml.replace('{{wind}}', weather.current.wind_kph);

    res.send(responseHtml);
  } catch (err) {
    res.send(`
      <p>Error: Could not fetch weather data. Please check the city name.</p>
      <a href="/">Try again</a>
    `);
  }
});

// 📊 Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`🌐 Server is running on http://localhost:${PORT}`);
});
