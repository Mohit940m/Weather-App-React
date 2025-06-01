/**
 * Weather AI Prediction Service
 * Provides AI-generated recommendations based on weather data
 */

/**
 * Generate recommendations based on weather conditions
 * @param {Object} weatherData - Current and forecast weather data
 * @returns {Object} - Weather recommendations
 */
const generateAdviceFromWeather = (weatherData) => {
  const { temp, details, humidity, speed: windSpeed, daily } = weatherData;
  
  // Basic recommendations based on weather conditions
  let dailyItems = [];
  let healthTips = [];
  let todayActivities = [];
  let upcomingActivities = [];
  let runningAdvice = "";
  
  // Temperature-based recommendations
  if (temp < 5) {
    dailyItems.push("Heavy coat", "Gloves", "Scarf", "Hat");
    healthTips.push("Dress in layers", "Stay hydrated even in cold weather");
    todayActivities.push("Indoor activities recommended");
    runningAdvice = "Wear thermal running gear and warm up properly before running";
  } else if (temp < 15) {
    dailyItems.push("Light jacket", "Long sleeves");
    healthTips.push("Comfortable temperature for outdoor activities");
    todayActivities.push("Hiking", "Cycling");
    runningAdvice = "Good conditions for running, wear appropriate layers";
  } else if (temp < 25) {
    dailyItems.push("Light clothing");
    healthTips.push("Stay hydrated", "Apply sunscreen");
    todayActivities.push("Beach visit", "Picnic", "Outdoor sports");
    runningAdvice = "Ideal temperature for running, stay hydrated";
  } else {
    dailyItems.push("Very light clothing", "Hat", "Sunglasses");
    healthTips.push("Drink plenty of water", "Avoid prolonged sun exposure");
    todayActivities.push("Swimming", "Water activities");
    runningAdvice = "Run early morning or evening to avoid heat, drink plenty of water";
  }
  
  // Weather condition based recommendations
  if (details.toLowerCase().includes("rain")) {
    dailyItems.push("Umbrella", "Waterproof jacket");
    todayActivities = ["Indoor activities", "Museum visit", "Shopping"];
    runningAdvice = "Consider indoor treadmill running or postpone if heavy rain";
  } else if (details.toLowerCase().includes("snow")) {
    dailyItems.push("Snow boots", "Waterproof clothing");
    todayActivities = ["Sledding", "Building a snowman", "Indoor activities"];
    runningAdvice = "Be cautious of slippery surfaces, wear trail running shoes with good grip";
  } else if (details.toLowerCase().includes("cloud")) {
    todayActivities.push("Photography", "Sightseeing");
  } else if (details.toLowerCase().includes("clear")) {
    todayActivities.push("Stargazing", "Outdoor dining");
    healthTips.push("Don't forget sunscreen even on clear days");
  }
  
  // Wind-based recommendations
  if (windSpeed > 10) {
    dailyItems.push("Windbreaker");
    healthTips.push("Secure loose items when outdoors");
    runningAdvice += " Be aware of strong winds that may affect your running performance";
  }
  
  // Humidity-based recommendations
  if (humidity > 80) {
    healthTips.push("High humidity may make it feel hotter than it is");
    runningAdvice += " High humidity will make running feel harder, slow your pace accordingly";
  }
  
  // Generate upcoming activities based on forecast
  if (daily && daily.length > 0) {
    daily.slice(1, 4).forEach(day => {
      if (day.temp > 25) {
        upcomingActivities.push(`${day.title}: Great day for water activities`);
      } else if (day.temp > 15) {
        upcomingActivities.push(`${day.title}: Perfect for outdoor sports`);
      } else if (day.temp > 5) {
        upcomingActivities.push(`${day.title}: Good for hiking or walking`);
      } else {
        upcomingActivities.push(`${day.title}: Consider indoor activities`);
      }
    });
  }
  
  return {
    dailyItems: dailyItems.join(", "),
    healthTips: healthTips.join(". "),
    todayActivities: todayActivities.join(", "),
    upcomingActivities: upcomingActivities.length > 0 ? upcomingActivities.join("; ") : "Check forecast for specific recommendations",
    runningAdvice
  };
};

/**
 * Get weather predictions and recommendations
 * @param {Object} weatherData - Current and forecast weather data
 * @returns {Promise<Object>} - Weather predictions and recommendations
 */
const getWeatherPredictions = async (weatherData) => {
  try {
    // Generate advice based on weather data
    return generateAdviceFromWeather(weatherData);
  } catch (error) {
    console.error("Error getting AI predictions:", error);
    throw error;
  }
};

export default getWeatherPredictions;