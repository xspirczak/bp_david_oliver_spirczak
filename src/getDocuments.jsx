import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Documents() {
    let counter = 0;
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
        <div className="flex flex-col justify-center items-center">
            <h1 className='text-2xl font-bold'>Document List: </h1>
            <ul className='w-full flex flex-col justify-center items-center'>
            {documents.map((document, index) => (
                    <li key={index}  className='w-1/2 mb-4 border-b-[1px]'>{counter++}: {JSON.stringify(document)}</li>
                ))}
            </ul>
        </div>
    );
}

export default Documents;