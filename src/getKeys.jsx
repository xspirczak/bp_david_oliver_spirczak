import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Keys() {
  let counter = 0;
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    // Fetch the keys collection from the backend API
    axios.get('http://localhost:3000/api/keys')
      .then(response => {
        setKeys(response.data);  // Set the response data to the keys state
      })
      .catch(error => {
        console.error('Error fetching keys:', error);
      });
  }, []);

  
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className='text-2xl font-bold'>Key Lists: </h1>
      <ul className='w-full flex flex-col justify-center items-center'>
        {keys.map(keyData => (
          <li key={keyData._id} className=' w-1/2 mb-4'>
          <p className='font-bold text-lg'>Keyset {counter++}.</p>
          <hr></hr>
            {keyData.key.map((keyItem, index) => (
              <div key={index} className=''>
                <span className='font-bold'>Key: </span>{keyItem.keyName}<span className='font-bold'> - Values: </span>{keyItem.values.join(', ')}  
                <br />
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Keys;