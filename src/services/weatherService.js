import { DateTime } from "luxon";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = async (infoType, searchParams) => {
    const url = new URL(BASE_URL + infoType);
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};

const iconUrlFromCode = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;

const formatToLocalTime = (secs, offset, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => 
    DateTime.fromSeconds(secs, { zone: 'utc' }).plus({ seconds: offset }).toFormat(format);

const formatCurrentWeather = (data) => {
    const {
        coord: { lat, lon },
        main: { temp, feels_like, temp_min, temp_max, humidity },
        name,
        dt,
        sys: { country, sunrise, sunset },
        weather,
        wind: { speed },
        timezone
    } = data;

    const { main: details, icon } = weather[0];
    const formattedLocalTime = formatToLocalTime(dt, timezone);

    return {
        lat,
        lon,
        temp,
        feels_like,
        temp_min,
        temp_max,
        humidity,
        name,
        dt,
        country,
        sunrise: formatToLocalTime(sunrise, timezone, 'hh:mm a'),
        sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'),
        details,
        icon: iconUrlFromCode(icon),
        speed,
        formattedLocalTime,
        timezone,
    };
};

const formatForecastWeather = (secs, offset, list) => {
    // hourly
    const hourly = list
        .filter(f => f.dt > secs)
        .slice(0, 5)
        .map((f, idx) => ({
            id: `hourly-${idx}`,
            temp: f.main.temp,
            title: formatToLocalTime(f.dt, offset, "hh:mm a"),
            icon: iconUrlFromCode(f.weather[0].icon),
            date: f.dt_txt,
        }));

    // daily
    const daily = list
        .filter((_, idx) => idx % 8 === 0)  // Assuming 3-hour interval data, every 8th item is a new day
        .slice(0, 5)
        .map((f, idx) => ({
            id: `daily-${idx}`,
            temp: f.main.temp,
            title: formatToLocalTime(f.dt, offset, "cccc"),
            icon: iconUrlFromCode(f.weather[0].icon),
            date: f.dt_txt,
        }));
    
    return { hourly, daily };
};

const getFormattedWeatherData = async (searchParams) => {
    const currentWeatherData = await getWeatherData("weather", searchParams);
    const formattedCurrentWeather = formatCurrentWeather(currentWeatherData);
    
    const { lat, lon, timezone } = formattedCurrentWeather;
    
    const forecastWeatherData = await getWeatherData('forecast', { lat, lon, units: searchParams.units });
    const formattedForecastWeather = formatForecastWeather(formattedCurrentWeather.dt, timezone, forecastWeatherData.list);

    return {
        ...formattedCurrentWeather,
        ...formattedForecastWeather
    };
};

export default getFormattedWeatherData;
