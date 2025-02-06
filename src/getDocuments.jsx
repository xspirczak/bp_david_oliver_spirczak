import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplayDocument from "./Components/DisplayDocument.jsx";

function Documents() {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/documents')
            .then(response => {
                setDocuments(response.data);  // Set the response data to the keys state
                console.log(documents);
            })
            .catch(error => {
                console.error('Error fetching documents:', error);
            });
    }, []);


    return (
        <DisplayDocument document={documents}></DisplayDocument>
    );
}

export default Documents;