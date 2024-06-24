import React from 'react'

const TopBotton = ({setQuery}) => {
    const cities = [
        {
            id: 1,
            title: 'Kolkata'
        },
        {
            id: 2,
            title: 'Hyderabad'
        },
        {
            id: 3,
            title: 'Delhi'
        }, {
            id: 4,
            title: 'Bengaluru'
        },
        {
            id: 5,
            title: 'Mumbai'
        },
    ]
    return <div className='flex items-center my-6 justify-around '>
        {cities.map((city) => (
            
            <button key={city.id} 
            className='text-white text-lg font-medium cursor-pointer transition duration-500 ease-out hover:scale-125'
             onClick={() => setQuery({q: city.title})}
            >
            {city.title}
            </button>

        ) )}
    </div>
}

export default TopBotton
