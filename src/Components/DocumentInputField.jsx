import  { useState } from 'react'

export default function DocumentInputField() {
    const [error, setError] = useState(''); // State to store the error message
    const [isValid, setIsValid] = useState(false); // State to store the JSON validation status
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const [inputText, setInputText] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [year, setYear] = useState('');
    const [country, setCountry] = useState("");

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];  // Get the first selected file
        if (file) {

            if (file.type !== 'text/plain') {
                setError('Nahrajte súbor vo formáte .txt!');
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
            setError('Vstupné pole nesmie byť prazdne!');  // Set an error message
            console.error('Error: Input cannot be empty.'); // Log the error
            return;  // Stop the function from executing further
        }


        console.log("PRINT" ,name, description, language, country);
        const jsonData = {
            document: inputText,  // This is the plain text to be sent as JSON
            name,
            description,
            language,
            country,
            year: year ? Number(year) : -1 // -1 when there is no year provided (so later I know  that are is no year provided, when displaying or filtering)
        };


        try {
            // Use fetch with proper configuration
            const response = await fetch('http://localhost:3000/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ""
                },
                body: JSON.stringify(jsonData)  // Convert the object to a JSON string
            });


            // Handle the response
            if (response.ok) {
                const result = await response.json();
                console.log('Data saved successfully:', result);
                setInputText('');  // Clear the textarea after submission
                setName('');
                setDescription('');
                setLanguage('');
                setCountry('');
                setYear('');
                setIsValid(true);
                setSubmissionSuccess(true);
                setError('');
            } else {
                setError('Problém s ukladaním dát: '+ response.statusText);
                console.error('Error saving data: ', response.statusText);
            }
        } catch (err) {
            setIsValid(false);
            setSubmissionSuccess(false);
            setError('Problém s odosielaním: '+ err);
            console.error('Error during submission:', err);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-custom-dark-blue lg:text-fontSize61 md:text-fontSize48 text-fontSize32 font-bold mb-6 text-center mt-6 px-2">Vložte šifrovaný dokument</h1>
            <p className="text-custom-dark-blue font-light md:text-fontSize16 text-fontSize12 text-center px-4 mb-6">Nahrať dokumenty je možné v digitálnom
                formáte <span className="font-semibold">(.txt)</span> alebo samotným vložením textu do vstupného poľa
                nižšie.</p>
            <div className="bg-white shadow-lg rounded-lg sm:p-6 p-2 w-11/12 max-w-4xl">
                <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">

                    <div className="grid justify-center gap-6">
                        <div className="flex justify-center gap-6">
                            <div>
                                <label htmlFor="name"
                                       className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Názov</label>
                                <input type="text" name="name" id="name" value={name}
                                       onChange={handleInputChange(setName)}
                                       className="text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover block w-full p-2"
                                       placeholder="Názov dokumentu" required=""/>
                            </div>
                            <div>
                                <label htmlFor="country"
                                       className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Krajina</label>
                                <input type="text" name="country" id="country" value={country}
                                       onChange={handleInputChange(setCountry)}
                                       className="text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover block w-full p-2"
                                       placeholder="Krajina pôvodu" required=""/>
                            </div>
                            <div>
                                <label htmlFor="language"
                                       className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Jazyk</label>
                                <input type="text" name="language" id="language" value={language}
                                       onChange={handleInputChange(setLanguage)}
                                       className="text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover block w-full p-2"
                                       placeholder="Jazyk dokumentu" required=""/>
                            </div>


                        </div>
                        <div className="flex justify-start gap-6">
                            <div>
                                <label htmlFor="description"
                                       className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Popis</label>
                                <textarea name="description" id="description" rows="4" cols="35" value={description}
                                          onChange={handleInputChange(setDescription)}
                                          className="text-fontSize12 border border-custom-dark-blue-hover text-custom-dark-blue rounded-lg focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover block w-full p-2"
                                          placeholder="Popis dokumentu" required=""/>
                            </div>
                            <div>
                                <label htmlFor="year"
                                       className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Rok</label>
                                <input type="number" name="year" id="year" min="1400" max="2000" value={year}
                                       onChange={handleInputChange(setYear)}
                                       className="text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover block w-full p-2"
                                       placeholder="1400" required=""/>
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-center">
                        <input
                            type="file"
                            accept='.txt'
                            id="inputTxtFile"
                            onChange={handleFileChange}
                            className="ml-4 p-1 md:w-2/5 sm:w-2/3 w-5/6 text-fontSize12 md:text-fontSize16 text-custom-dark-blue file:text-custom-dark-blue focus:outline-custom-dark-blue-hover file:bg-custom-light-blue text-sm rounded-full leading-6 file:font-semibold file:border-none file:px-4 file:py-1 file:mr-6 file:rounded-full hover:file:bg-custom-light-blue-hover border border-custom-light-blue"
                        />
                    </div>

                    <div className="relative rounded-3xl">
                        <textarea
                            id="textarea"
                            name="textarea"
                            rows="10"
                            value={inputText}
                            onChange={handleInputChange(setInputText)}
                            className="block w-full rounded-3xl shadow-md sm:text-sm p-4 resize-none border-2 focus:outline-custom-dark-blue-hover border-dashed border-custom-dark-blue-hover"
                            placeholder='Sem vložte šifrovaný text v digitalnom formáte'></textarea>
                    </div>
                    <div className="flex justify-center">
                        {error ? (
                            <p className="text-red-500 text-center">{error}</p>
                        ) : isValid ? (
                            <p className="text-green-500 text-center">Dokument v správnom formáte.</p>
                        ) : (
                            <p className="text-custom-dark-blue text-center">Zadajte šifrovaný text v digitálnom
                                formáte.</p>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2 ml-3 bg-custom-light-blue text-custom-dark-blue text-fontSize16 font-medium rounded-xl hover:bg-custom-light-blue-hover focus:outline-none"
                        >
                            Vložiť
                        </button>
                    </div>
                    {submissionSuccess && (
                        <div className="text-green-500 mt-4 text-center">
                            Dokument bol úspešné vložený.
                        </div>
                    )}
                </form>
            </div>

        </div>
    );
}