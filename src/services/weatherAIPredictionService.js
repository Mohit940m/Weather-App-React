import { DateTime } from "luxon";

if (!process.env.REACT_APP_GEMINI_API_KEY) {
  console.warn("Gemini API Key (REACT_APP_GEMINI_API_KEY) is not set in environment variables. AI predictions will likely fail.");
}

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Try different Gemini models in order of preference
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

const getGeminiApiUrl = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

/**
 * Attempts to call Gemini API with a specific model
 * @param {string} model - The model name to use
 * @param {string} prompt - The prompt to send
 * @returns {Promise<Object>} - The API response
 */
const callGeminiAPI = async (model, prompt) => {
  const response = await fetch(`${getGeminiApiUrl(model)}?key=${GEMINI_API_KEY}`, {
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
      const errorData = await response.json();
      errorBody = JSON.stringify(errorData);
    } catch (e) {
      errorBody = await response.text().catch(() => "Failed to read error body as text.");
    }
    console.error(`Gemini API Error for model ${model}: Status ${response.status}, Body: ${errorBody}`);
    throw new Error(`Failed to get AI prediction from ${model}. Status: ${response.status}`);
  }

  return await response.json();
};

/**
 * Generates weather advice using the Gemini API
 * @param {Object} weatherData - Current and forecast weather data
 * @returns {Promise<Object>} - AI-generated advice and recommendations
 */
export const generateWeatherAdvice = async (weatherData) => {
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

    let data = null;
    let lastError = null;

    // Try each model in order until one works
    for (const model of GEMINI_MODELS) {
      try {
        console.log(`Trying Gemini model: ${model}`);
        data = await callGeminiAPI(model, prompt);
        console.log(`Successfully used model: ${model}`);
        break;
      } catch (error) {
        console.warn(`Model ${model} failed:`, error.message);
        lastError = error;
        continue;
      }
    }

    if (!data) {
      throw lastError || new Error("All Gemini models failed");
    }
    
    // Log the full response to understand the structure
    console.log("Full Gemini API Response:", JSON.stringify(data, null, 2));
    
    // Check if the response has the expected structure
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error("Unexpected response structure - no candidates found:", data);
      throw new Error("Invalid response structure from Gemini API");
    }
    
    if (!data.candidates[0].content || !data.candidates[0].content.parts || !Array.isArray(data.candidates[0].content.parts) || data.candidates[0].content.parts.length === 0) {
      console.error("Unexpected response structure - no content parts found:", data.candidates[0]);
      throw new Error("Invalid content structure from Gemini API");
    }
    
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