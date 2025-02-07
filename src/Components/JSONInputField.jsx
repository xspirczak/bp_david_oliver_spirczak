import { useState } from 'react'

export default function JSONInputField() {
    const [error, setError] = useState(''); // State to store the error message
    const [isValid, setIsValid] = useState(false); // State to store the JSON validation status
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [inputType, setInputType] = useState(true); // true - file input; false - manual input


    const [inputText, setInputText] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [year, setYear] = useState('');
    const [country, setCountry] = useState("");

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const changeInputType = () => {
        setInputType((prev) => !prev);
    };

    const checkForDuplicates = (fileContent) => { // checks if there are code duplicates in key @returns false is there are none
        const obj = JSON.parse(fileContent);
        const codes = new Set();
        let cnt = 0;

        Object.values(obj).forEach((val) => {
            val.forEach((item) => {
                codes.add(item);
                cnt++;
            })
        })

        return codes.size !== cnt;
    }
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];  // Get the first selected file
        if (file) {

            if (file.type !== 'application/json') {
                setError('Vložte súbor vo formáte .json.');
                return;
            }

            const reader = new FileReader();  // Create a FileReader instance

            reader.onload = (e) => {
                if (!checkForDuplicates(e.target.result)) { // Check whether the key has duplicate codes
                    setInputText(e.target.result);  // Set the file content to state
                    setError('');
                } else {
                    setError('Kľúč nesmie obsahovať rovnaké kódy pre viacero hodnôt.');
                }

            };

            reader.onerror = (e) => {
                console.error('Error reading file:', e);
            };

            reader.readAsText(file);  // Read the file as text
        }
    };

    const [data, setData] = useState({});
    const [newKey, setNewKey] = useState("");
    const [newValues, setNewValues] = useState({}); // Stores input values for each key

    // Add a new key with an empty array
    const addKey = () => {
        if (newKey && !data[newKey]) {
            setData({ ...data, [newKey]: [] });
            setNewKey(""); // Reset input
        }
    };

    // Find whether value is already a code in key
    const findValue = (value) => {
        let found = false
        Object.keys(data).forEach((key) => {
            data[key].forEach((v) => {
                if (v === value) // value is already present in key
                    found = true
            })
        })
        return found
    }

    // Add a value to an existing key
    const addValue = (key) => {

        const toBeAddedValue = Number(newValues[key]); // value that are about to add to key
        const foundValue = findValue(toBeAddedValue); // searching the already existing key if that value

        if (newValues[key] !== undefined && newValues[key] !== "" && !foundValue) {
            setData({ ...data, [key]: [...data[key], Number(newValues[key])] });
            setNewValues({ ...newValues, [key]: "" }); // Clear input after adding
        }
    };

    // Handle value input change
    const handleValueChange = (key, value) => {
        setNewValues({ ...newValues, [key]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputText.trim() && !data) {
            setError('Vstup nesmie byť prázdny!');
            setIsValid(false);
            setSubmissionSuccess(false);
            return;
        }

        try {
            // Parse the JSON input from the textarea

            let jsonData;

            if (inputType) { // File input
                const temp = JSON.parse(inputText);
                jsonData = {
                    key: temp,  // This is the plain text to be sent as JSON
                    name,
                    description,
                    country,
                    year: year ? Number(year) : -1 // -1 when there is no year provided (so later I know  that are is no year provided, when displaying or filtering)
                };
            } else { // Manual input
                jsonData = {
                    key: data,  // This is the plain text to be sent as JSON
                    name,
                    description,
                    country,
                    year: year ? Number(year) : -1 // -1 when there is no year provided (so later I know  that are is no year provided, when displaying or filtering)
                };
            }

            console.log(JSON.stringify(jsonData));
            // Check if the structure matches what the server expects
            if (jsonData.key) {
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
                setError('Zlý formát vstupu! Očakávaný: { key: [...] }');
                setSubmissionSuccess(false);
            }
        } catch (err) {
            setIsValid(false);
            setSubmissionSuccess(false);
            setError('Nesprávny JSON formát');
            console.error('Error during submission:', err);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-custom-dark-blue lg:text-fontSize61 md:text-fontSize48 text-fontSize32 font-bold mb-6 text-center mt-6 px-2">Vložte
                šifrovací kľúč</h1>
            <p className="text-custom-dark-blue font-light md:text-fontSize16 text-fontSize12 text-center px-4 mb-6">Nahrať
                kľúče je možné v digitálnom
                formáte <span className="font-semibold">(.json)</span> alebo samotným vložením kľúča v JSON formáte do vstupného poľa
                nižšie.</p>
            <div className="bg-white shadow-lg rounded-lg sm:p-6 p-2 w-11/12 max-w-4xl">

                <div className="flex justify-center mb-5">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={inputType}
                            onChange={changeInputType}
                        />
                        <div
                            className="relative w-11 h-6 bg-custom-dark-blue peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-custom-dark-blue rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-custom-dark-blue peer-checked:bg-custom-dark-blue dark:peer-checked:bg-custom-dark-blue">
                        </div>
                        <span className="ms-3 text-fontSize16 font-medium text-custom-dark-blue">{inputType ? (
                            "Súbor ako vstup"
                        ) : (
                            "Manuálny vstup"
                        )}</span>

                    </label>
                </div>
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
                    { inputType ? (
                        <>
                            <div className="flex justify-center">
                                <input
                                    type="file"
                                    accept='.json'
                                    onChange={handleFileChange}
                                    className="ml-4 p-1 md:w-2/5 sm:w-2/3 w-5/6 text-fontSize12 md:text-fontSize16 text-custom-dark-blue file:text-custom-dark-blue focus:outline-custom-dark-blue-hover file:bg-custom-light-blue text-sm rounded-full leading-6 file:font-semibold file:border-none file:px-4 file:py-1 file:mr-6 file:rounded-full hover:file:bg-custom-light-blue-hover border border-custom-light-blue"
                                />
                            </div>
                            <textarea
                            id="textarea"
                            name="textarea"
                            rows="10"
                            value={inputText}
                            onChange={handleInputChange(setInputText)}
                            className="mt-1 block w-full rounded-3xl shadow-md sm:text-sm p-4 resize-none border-2 focus:outline-custom-dark-blue-hover border-dashed border-custom-dark-blue-hover"
                            placeholder='{
    "e" : [1,1],
    "d" : [4],
    "j" : [56,222,333]
}'></textarea></>
                    ) : (
                        <div className="p-4 flex justify-center">
                            <div className="border rounded-lg border-custom-dark-blue p-5">
                                {Object.entries(data).map(([key, values]) => (
                                    <div key={key} className="mb-2 flex items-center space-x-2">
                                        <span className="font-bold sm:text-fontSize16 text-fontSize12">{key}:</span>
                                        <span
                                            className="sm:text-fontSize16 text-fontSize12">[{values.join(", ")}]</span>
                                        <input
                                            type="number"
                                            value={newValues[key] || ""}
                                            onChange={(e) => handleValueChange(key, e.target.value)}
                                            className="border border-custom-dark-blue rounded-3xl p-1 px-2 sm:text-fontSize16 text-fontSize12 sm:w-28 w-24 focus:outline-custom-dark-blue-hover"
                                            placeholder="Hodnota"
                                        />

                                        <div className="relative flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => addValue(key)}
                                                className="p-1 px-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-3xl sm:text-fontSize16 text-fontSize12 relative group">
                                                +
                                                <span
                                                    className="absolute md:left-full md:bottom-1 left-0 bottom-8 ml-2 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Hodnota
                                                </span>
                                            </button>
                                        </div>


                                    </div>
                                ))}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        className="border rounded-3xl border-custom-dark-blue focus:border-custom-dark-blue-hover p-1 px-2 sm:text-fontSize16 text-fontSize12 sm:w-24 w-20 focus:outline-custom-dark-blue-hover"
                                        placeholder="Nový kľúč"
                                    />

                                    <div className="relative flex items-center">
                                        <button
                                            type="button"
                                            onClick={addKey}
                                            className="p-1 px-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-3xl sm:text-fontSize16 text-fontSize12 relative group">
                                            +
                                            <span
                                                className="absolute md:left-full md:bottom-1 left-0 bottom-8 ml-2 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Kľúč
                                                </span>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    <div className="relative rounded-3xl sm:p-6 p-0">

                    </div>

                    <div className="flex justify-center">
                        {error ? (
                            <p className="text-red-500 text-center">{error}</p>
                        ) : isValid ? (
                            <p className="text-green-500 text-center">Kľúč je v správnom formáte.</p>
                        ) : (
                            <p className="text-custom-dark-blue text-center">Zadajte šifrovací kľúč v digitálnom
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
                            Kľúč bol úspešné vložený.
                        </div>
                    )}
                </form>
            </div>

        </div>


    )
        ;
}