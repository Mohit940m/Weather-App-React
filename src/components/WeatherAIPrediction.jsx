import React, { useState, useEffect } from 'react';
// import getWeatherPredictions from '../services/weatherAIPredictionService';
import { generateWeatherAdvice } from '../services/weatherAIPredictionService';
import { FaUmbrella, FaHeartbeat, FaMountain, FaRunning } from 'react-icons/fa';
import { MdSchedule } from 'react-icons/md';

function WeatherAIPrediction({ weatherData }) {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!weatherData) return;
      
      try {
        setLoading(true);
        const data = await generateWeatherAdvice(weatherData);
        setPredictions(data);
        setError(null);
      } catch (err) {
        console.error("Failed to get weather predictions:", err);
        setError("Could not load AI predictions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [weatherData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white bg-opacity-20 rounded-lg shadow-lg backdrop-blur-lg">
        <h2 className="text-xl font-medium mb-4">Getting Smart Recommendations...</h2>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white bg-opacity-20 rounded-lg shadow-lg backdrop-blur-lg">
        <h2 className="text-xl font-medium mb-2">AI Weather Assistant</h2>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!predictions) return null;

  // Helper function to render content that might be a string, an array, or an object
  const renderPredictionContent = (content) => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }
    if (Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
    if (typeof content === 'object' && content !== null) {
      return (
        <div>
          {Object.entries(content).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {String(value)}</p>
          ))}
        </div>
      );
    }
    return <p>No advice available.</p>;
  };


  return (
    <div className="p-6 bg-white bg-opacity-20 rounded-lg shadow-lg backdrop-blur-lg">
      <h2 className="text-xl font-medium mb-4">AI Weather Assistant</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Items */}
        <div className="bg-white bg-opacity-30 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaUmbrella className="mr-2" size={20} />
            <h3 className="font-medium">What to Bring</h3>
          </div>
          {renderPredictionContent(predictions.dailyItems)}
        </div>
        
        {/* Health Tips */}
        <div className="bg-white bg-opacity-30 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaHeartbeat className="mr-2" size={20} />
            <h3 className="font-medium">Health Tips</h3>
          </div>
          {renderPredictionContent(predictions.healthTips)}
        </div>
        
        {/* Today's Activities */}
        <div className="bg-white bg-opacity-30 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaMountain className="mr-2" size={20} />
            <h3 className="font-medium">Recommended Activities Today</h3>
          </div>
          {renderPredictionContent(predictions.todayActivities)}
        </div>
        
        {/* Upcoming Activities */}
        <div className="bg-white bg-opacity-30 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <MdSchedule className="mr-2" size={20} />
            <h3 className="font-medium">Upcoming Days</h3>
          </div>
          {renderPredictionContent(predictions.upcomingActivities)}
        </div>
        
        {/* Running Advice */}
        <div className="bg-white bg-opacity-30 p-4 rounded-lg md:col-span-2">
          <div className="flex items-center mb-2">
            <FaRunning className="mr-2" size={20} />
            <h3 className="font-medium">Running Advice</h3>
          </div>
          {renderPredictionContent(predictions.runningAdvice)}
        </div>
      </div>
    </div>
  );
}

export default WeatherAIPrediction;