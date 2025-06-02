/**
 * Weather AI Prediction Service
 * Provides AI-generated recommendations based on weather data
 */
import { DateTime } from "luxon";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Generates weather advice using the Gemini API
 * @param {Object} weatherData - Current and forecast weather data
 * @returns {Promise<Object>} - AI-generated advice and recommendations
 */
export  const generateWeatherAdvice = async (weatherData) => {
  try {
    // Extract relevant weather information
    const { 
      temp, 
      humidity, 
      details, 
      speed: windSpeed,
      formattedLocalTime,
      daily
    } = weatherData;
    
    // Format the prompt for the AI
    const prompt = `
      Based on the following weather data, provide concise, practical advice:
      
      Current weather: ${details} at ${temp}°, humidity ${humidity}%, wind speed ${windSpeed} m/s
      Date and time: ${formattedLocalTime}
      
      Upcoming forecast:
      ${daily.map(day => `${day.title}: ${day.temp}°`).join('\n')}
      
      Please provide:
      1. Daily items to bring (umbrella, coat, etc.)
      2. Health tips related to the weather
      3. Recommended outdoor activities for today
      4. Recommended activities for the upcoming days
      5. Running advice based on current conditions
      
      Format the response as JSON with these keys: dailyItems, healthTips, todayActivities, upcomingActivities, runningAdvice
    `;

    // Call the Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      let errorBody = "Could not retrieve error body.";
      try {
        // Attempt to parse the error response from Gemini API
        const errorData = await response.json();
        errorBody = JSON.stringify(errorData);
      } catch (e) {
        // If parsing as JSON fails, try to read as text
        errorBody = await response.text().catch(() => "Failed to read error body as text.");
      }
      console.error(`Gemini API Error: Status ${response.status}, Body: ${errorBody}`);
      throw new Error(`Failed to get AI prediction. Status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the text response from Gemini
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response
    // Using a try-catch because the AI might not always return valid JSON
    try {
      // Find JSON content between ```json and ``` if present
      let jsonStr = textResponse;
      const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonStr = jsonMatch[1];
      }
      console.log("AI Response:", jsonStr);
      
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      
      // Fallback: Return a structured response with the raw text
      return {
        dailyItems: "Could not generate specific recommendations",
        healthTips: "Could not generate specific recommendations",
        todayActivities: "Could not generate specific recommendations",
        upcomingActivities: "Could not generate specific recommendations",
        runningAdvice: "Could not generate specific recommendations",
        rawResponse: textResponse
      };
    }
  } catch (error) {
    console.error("Error generating weather advice:", error);
    throw error;
  }
};

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