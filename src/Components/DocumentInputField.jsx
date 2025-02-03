import React, { useState } from 'react'

export default function DocumentInputField() {
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState(''); // State to store the error message
    const [isValid, setIsValid] = useState(false); // State to store the JSON validation status
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const handleTextChange = (event) => {
        setInputText(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];  // Get the first selected file
        if (file) {

            if (file.type !== 'text/plain') {
                setError('Please upload a valid .txt file.');
                return;
            }

            const reader = new FileReader();  // Create a FileReader instance

            reader.onload = (e) => {
                setInputText(e.target.result);  // Set the file content to state
                setError('');
            };

            reader.onerror = (e) => {
                console.error('Error reading file:', e);
            };

            reader.readAsText(file);  // Read the file as text
        }

    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Handle:" + inputText);

        const trimmedInput = inputText.trim();

        // Validate that the input is not empty
        if (trimmedInput === '') {
            setIsValid(false);  // Update your state to reflect invalid input
            setSubmissionSuccess(false);
            setError('Input cannot be empty.');  // Set an error message
            console.error('Error: Input cannot be empty.'); // Log the error
            return;  // Stop the function from executing further
        }

        const jsonData = {
            document: inputText  // This is the plain text to be sent as JSON
        };

        try {
            // Use fetch with proper configuration
            const response = await fetch('http://localhost:3000/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData)  // Convert the object to a JSON string
            });

            // Handle the response
            if (response.ok) {
                const result = await response.json();
                console.log('Data saved successfully:', result);
                setInputText('');  // Clear the textarea after submission
                setIsValid(true);
                setSubmissionSuccess(true);
                setError('');
            } else {
                setError('Error saving data:', response.statusText);
                console.error('Error saving data:', response.statusText);
            }
        } catch (err) {
            setIsValid(false);
            setSubmissionSuccess(false);
            setError('Error during submission:', err);
            console.error('Error during submission:', err);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-semibold mb-6">Input Ciphered Document</h1>
            <div className="bg-white shadow-md rounded-lg p-6 w-11/12 max-w-4xl">
                <form className="space-y-6" onSubmit={handleSubmit}>

                    <div className="flex space-x-4 justify-center">
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Plain Text Input
                        </button>
                        <div>
                        </div>

                        <input
                            type="file"
                            accept='.txt'
                            onChange={handleFileChange}
                            className="ml-4 p-1 w-2/5 text-slate-500 file:bg-gray-200 text-sm rounded-full leading-6 file:text-black file:font-semibold file:border-none file:px-4 file:py-1 file:mr-6 file:rounded-full hover:file:bg-gray-300 border border-gray-300"
                        />
                    </div>

                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <label htmlFor="textarea" className="block text-sm font-medium text-gray-700">
                            Enter Ciphered Document in Plain Text:
                        </label>
                        <textarea
                            id="textarea"
                            name="textarea"
                            rows="6"
                            value={inputText}
                            onChange={handleTextChange}
                            className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4 resize-none"
                            placeholder='Plain Text Goes Here'></textarea>
                    </div>
                    <div className="flex justify-center">
                        {error ? (
                            <p className="text-red-500 mt-2">{error}</p>
                        ) : isValid ? (
                            <p className="text-green-500 mt-2">Valid</p>
                        ) : (
                            <p className="text-gray-500 mt-2">Please enter your plain text input.</p>
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