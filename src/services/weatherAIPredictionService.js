
import { DateTime } from "luxon";

if (!process.env.REACT_APP_GEMINI_API_KEY) {
  console.warn("Gemini API Key (REACT_APP_GEMINI_API_KEY) is not set in environment variables. AI predictions will likely fail.");
}

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";


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

