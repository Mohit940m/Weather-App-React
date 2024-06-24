import React, { useState } from 'react';
import { UilSearch, UilLocationPoint } from '@iconscout/react-unicons';

const Inputs = ({ setQuery, setUnits }) => {
  const [city, setCity] = useState('');

  const handleSearchClick = () => {
    if (city !== '') setQuery({ q: city });
  };



  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setQuery({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  };

  return (
    <div className='flex flex-row justify-center my-6'>
      <div className='flex flex-row w-3/4 items-center justify-center space-x-4 '>
        <input
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          type='text'
          placeholder='Search for city...'
          className='text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase'
        />
        <UilSearch
          size={25}
          className="text-white cursor-pointer transition duration-500 ease-out hover:scale-125"
          onClick={handleSearchClick}
        />
        <UilLocationPoint
          size={25}
          className="text-white cursor-pointer transition duration-500 ease-out hover:scale-125"
          onClick={handleLocationClick}
        />
      </div>
      <div className='flex flex-row w-1/4 items-center justify-center '>
        <button
          name='metric'
          className='text-xl text-white font-light cursor-pointer transition duration-500 ease-out hover:scale-125'
          onClick={() => setUnits("metric")}
        >
          °C
        </button>
        <p className='text-white text-xl mx-1'>|</p>
        <button
          name='imperial'
          className='text-xl text-white font-light cursor-pointer transition duration-500 ease-out hover:scale-125'
          onClick={() => setUnits("Imperial")}
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default Inputs;
