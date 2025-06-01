# Weather App

## Description
This Weather App is built using React, Tailwind CSS, and the OpenWeather API. It provides users with current weather information, 3-hourly forecasts, a 5-day weather forecast, sunrise and sunset times, wind speed, and a Celsius to Fahrenheit converter. The app is fully responsive and mobile-friendly.

## Features
- **Current Weather**: Displays the current weather conditions for the user's location.
- **3-Hourly Forecast**: Provides weather forecasts for the next three hours.
- **5-Day Forecast**: Offers weather predictions for the next five days.
- **Sunrise and Sunset Times**: Shows the times for sunrise and sunset.
- **Wind Speed**: Displays the current wind speed.
- **Temperature Converter**: Allows users to switch between Celsius and Fahrenheit.
- **Mobile Scalable**: The app is designed to be fully responsive and works well on mobile devices.

### 🤖 Smart AI Recommendations (via Gemini API)
- **Items to Bring**: Suggests essentials like umbrellas or jackets.
- **Health Tips**: Personalized health suggestions depending on weather conditions.
- **Recommended Activities**: Outdoor/indoor activity tips for today and the week ahead.
- **Running Advice**: Tailored running tips based on live weather metrics.

### 🛠 Fallback System
If the Gemini AI service fails, the app uses a **rule-based fallback** system to generate recommendations based on:
- Temperature
- Weather Conditions
- Wind Speed
- Humidity

 ### 📱 Responsive Design
- Fully mobile-friendly with a card-based layout.
- Optimized for performance and accessibility.

---

## 🧠 AI Integration Instructions

To enable Gemini AI recommendations:

1. **Add the following files to your project**:
   - `services/weatherAIPredictionService.js`
   - `components/WeatherAIPrediction.jsx`

2. **Usage in your app**:
   ```jsx
   import WeatherAIPrediction from './components/WeatherAIPrediction';

   // Inside your main component's JSX
   <WeatherAIPrediction weatherData={yourFetchedWeatherData} />


## Installation

1. Clone the repository:
    ```bash
    git clone (https://github.com/Mohit940m/Weather-App-React.git)
    cd weather-app-react
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your OpenWeather API key:
    ```plaintext
    REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```

4. Start the development server:
    ```bash
    npm start
    ```

## Usage
- Open your browser and go to `http://localhost:3000`
- Allow the app to access your location to get the current weather information.
- Use the temperature converter to switch between Celsius and Fahrenheit.
- View detailed weather forecasts and other weather-related information.

## Technologies Used
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **OpenWeather API**: Provides weather data
- **React Router**: For navigation
- **Gemini AI API**: For AI advice

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.


## Contact
- **GitHub**: [Mohit Saha Chowdhury]([https://github.com/yourusername](https://github.com/Mohit940m))
- **LinkedIn**: [Mohit Saha Chowdhury]([https://linkedin.com/in/yourprofile](https://www.linkedin.com/in/mohit-saha-chowdhury))

