import React from 'react';
// import PropTypes from 'prop-types';
import { FaThermometerEmpty } from "react-icons/fa";
import { BiSolidDropletHalf } from "react-icons/bi";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

const TempAndDetails = ({
  weather: {
    details,
    icon,
    temp,
    temp_min,
    temp_max,
    sunrise,
    sunset,
    speed,
    humidity,
    feels_like,
  },
  units,
}) => {
  const horizontalDetails = [
    {
      id: 1,
      Icon: GiSunrise,
      title: "Sunrise",
      value: sunrise,
    },
    {
      id: 2,
      Icon: GiSunset,
      title: "Sunset",
      value: sunset,
    },
    {
      id: 3,
      Icon: MdKeyboardArrowUp,
      title: "High",
      value: `${temp_max.toFixed()}°`,
    },
    {
      id: 4,
      Icon: MdKeyboardArrowDown,
      title: "Low",
      value: `${temp_min.toFixed()}°`,
    },
  ];

  const verticalDetails = [
    {
      id: 1,
      Icon: FaThermometerEmpty,
      title: "Real Feel",
      value: `${feels_like.toFixed()}°`,
    },
    {
      id: 2,
      Icon: BiSolidDropletHalf,
      title: "Humidity",
      value: `${humidity}%`,
    },
    {
      id: 3,
      Icon: FiWind,
      title: "Wind",
      value: `${speed} ${units === "metric" ? "m/s" : "mph"}`,
    },
  ];

  return (
    <div className='text-white'>
      <div className='flex items-center justify-center text-xl py-6 text-cyan-300'>
        <p>{details}</p>
      </div>

      <div className='flex flex-row items-center justify-between py-6'>
        <img src={icon} alt="weather icon" className='w-20' />
        <p className='text-5xl'>{`${temp.toFixed()}°`}</p>
        <div className='flex flex-col space-y-3 items-start'>
          {verticalDetails.map(({ id, Icon, title, value }) => (
            <div key={id} className='flex font-light text-sm items-center justify-center'>
              <Icon size={18} className='mr-1' />
              {`${title}: `}<span className="font-medium ml-1">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-row space-x-4 items-center justify-center text-sm py-3'>
        {horizontalDetails.map(({ id, Icon, title, value }) => (
          <div key={id} className='flex flex-row items-center'>
            <Icon size={18} className='font-light ml-1' />
            {`${title}: `}<span className="font-medium ml-1">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// TempAndDetails.propTypes = {
//   weather: PropTypes.shape({
//     details: PropTypes.string.isRequired,
//     icon: PropTypes.string.isRequired,
//     temp: PropTypes.number.isRequired,
//     temp_min: PropTypes.number.isRequired,
//     temp_max: PropTypes.number.isRequired,
//     sunrise: PropTypes.string.isRequired,
//     sunset: PropTypes.string.isRequired,
//     speed: PropTypes.number.isRequired,
//     humidity: PropTypes.number.isRequired,
//     feels_like: PropTypes.number.isRequired,
//     units: PropTypes.string.isRequired,
//   }).isRequired,
// };

export default TempAndDetails;
