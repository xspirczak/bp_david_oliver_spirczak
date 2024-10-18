import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Keys() {
  let counter = 0;
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    // Fetch the keys collection from the backend API
    axios.get('http://localhost:3000/api/keys')  // Adjust the port if needed
      .then(response => {
        setKeys(response.data);  // Set the response data to the keys state
      })
      .catch(error => {
        console.error('Error fetching keys:', error);
      });
  }, []);

  return (
    <div>
      <h1>Keys List: </h1>
      <ul>
        {keys.map(key => (
          <li key={key._id}>
            <p>{counter++}</p>
            <strong>Key:</strong> {key.key}
            <br />
            <strong>Values:</strong> {key.values.join(', ')}  {/* Display the array */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Keys;