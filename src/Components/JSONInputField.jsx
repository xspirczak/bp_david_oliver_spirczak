import React, { useState } from 'react'

export default function JSONInputField() {
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState(''); // State to store the error message
    const [isValid, setIsValid] = useState(false); // State to store the JSON validation status
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const handleTextChange = (event) => {
        setInputText(event.target.value);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Parse the JSON input from the textarea
        
            const jsonData = JSON.parse(inputText);

            // Check if the structure matches what the server expects
            if (jsonData.key && Array.isArray(jsonData.key)) {
                // Send a POST request to your API
                const response = await fetch('http://localhost:3000/api/keys', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData), // Send the JSON data as a string
                });

                // Handle the response
                if (response.ok) {
                    const result = await response.json();
                    console.log('Data saved successfully:', result);
                    setInputText(''); // Clear the textarea after submission
                    setIsValid(true);
                    setSubmissionSuccess(true);
                    setError('');
                } else {
                    console.error('Error saving data:', response.statusText);
                }
            } else {
                setError('Invalid format: Expected { key: [...] }');
                setSubmissionSuccess(false);
            }
        } catch (err) {
            setIsValid(false);
            setSubmissionSuccess(false);
            setError('Invalid JSON format');
            console.error('Error during submission:', err);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-semibold mb-6">Input Key in JSON Format</h1>
            <div className="bg-white shadow-md rounded-lg p-6 w-11/12 max-w-4xl">
                <form className="space-y-6" onSubmit={handleSubmit}>

                    <div className="flex space-x-4 justify-center">
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            JSON Input
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            JSON File Input
                        </button>
                    </div>

                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <label htmlFor="textarea" className="block text-sm font-medium text-gray-700">
                            Enter Key in JSON format (key and keyName are required for right validation):
                        </label>
                        <textarea
                            id="textarea"
                            name="textarea"
                            rows="6"
                            value={inputText}
                            onChange={handleTextChange}
                            className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4 resize-none"
                            placeholder='{
  "key": [
    { "keyName": "a", "values": ["#111", "#1", "#11"] },
   { "keyName": "c", "values": ["#222", "#2", "#22"] },
   { "keyName": "b", "values": ["#333", "#3"] },
   { "keyName": "d", "values": ["#444", "#4", "444444", "#44"] }
  ]
}'></textarea>
                    </div>
                    <div className="flex justify-center">
                        {error ? (
                            <p className="text-red-500 mt-2">{error}</p>
                        ) : isValid ? (
                            <p className="text-green-500 mt-2">Valid JSON</p>
                        ) : (
                            <p className="text-gray-500 mt-2">Please enter your JSON input.</p>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2 ml-3 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Submit
                        </button>
                    </div>
                    {submissionSuccess && (
                <div className="text-green-500 mt-4 text-center">
                    Your data was submitted successfully!
                </div>
            )}
                </form>
            </div>
        </div>
    );
}