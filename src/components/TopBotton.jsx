import React, { useState } from 'react';

const TopBotton = ({ setQuery }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const cities = [
    { id: 1, title: 'Kolkata' },
    { id: 2, title: 'Hyderabad' },
    { id: 3, title: 'Delhi' },
    { id: 4, title: 'Bengaluru' },
    { id: 5, title: 'Mumbai' },
  ];

  return (
    <div className='relative'>
      {/* Hamburger Icon */}
      <div className='md:hidden flex items-center justify-start'>
        <button 
          className='text-white text-2xl focus:outline-none' 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776; {/* Hamburger Icon */}
        </button>
      </div>

      {/* City Buttons */}
      <div className={`md:flex md:items-center my-6 justify-around ${menuOpen ? 'block' : 'hidden'} md:block `}>
        {cities.map((city) => (
          <button
            key={city.id}
            className='text-white text-lg font-medium mx-2 cursor-pointer transition duration-500 ease-out hover:scale-125 mb-4 md:mb-0 '
            onClick={() => setQuery({ q: city.title })}
          >
            {city.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopBotton;
