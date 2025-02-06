import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplayKey from "./Components/DisplayKey.jsx";

function Keys() {
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        // Fetch the keys collection from the backend API
        axios.get('http://localhost:3000/api/keys')
            .then(response => {
                setKeys(response.data);  // Set the response data to the keys state
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching keys:', error);
            });
    }, []);

    return (
       <DisplayKey keys={keys}></DisplayKey>
    );
}

export default Keys;
