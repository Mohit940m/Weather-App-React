
import './App.css';
import TopBotton from './components/TopBotton';
import Inputs from './components/inputs';
import TimeAndLocktion from './components/TimeAndLocktion';
import TempAndDerails from './components/TempAndDerails';
import Forecast from './components/Forecast';
import getFormattedWeatherData from './services/weatherService';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import getFormattedWeatherData from '../services/weatherService';
import WeatherAIPrediction from './components/WeatherAIPrediction';
const App =  () => {

  const [query, setQuery] = useState({q: 'sodepur'})
  const [units, setUnits] = useState('metric')
  const [weather, setWeather] = useState(null)

  const [loading, setLoading] = useState(true);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

  const fetchWeather = async () => {
    const cityName = query.q ? query.q : "current location";
    toast.info(`Featching weather data for ${capitalizeFirstLetter(cityName)}`);
    
    try {
        const data = await getFormattedWeatherData({ ...query, units });
        toast.success(`Fetched weather data for ${data.name}, ${data.country}`);
        setWeather(data);
        console.log(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        toast.error("Error fetching weather data");
    }
  } ;

  useEffect(() =>{
    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return'from-cyan-700 to-blue-700';
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-600 to-blue-700"
    return "from-yellow-600 to-red-500"
  };


  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-4 px-4 sm:px-32 bg-gradient-to-br ${formatBackground()} h-fit shadow-xl shadow-gray-400`}>
      <TopBotton setQuery={setQuery} />
      <Inputs setQuery={setQuery} setUnits={setUnits} />

      {weather && (
        <>
        <TimeAndLocktion weather={weather} />
        <TempAndDerails weather={weather} units={units} />

        <div className="mt-6">
          <WeatherAIPrediction weatherData={weather} />
        </div>
  
        <Forecast title="3 hourly forcust " data={weather.hourly} />
        <Forecast title="daily forcust" data={weather.daily} />
        </>
      )}
      <ToastContainer autoClose={2500} hideProgressBar={true} theme='colored' />
      
    </div>
  );
}

export default App;
