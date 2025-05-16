import { useState } from 'react'
import {checkForDuplicates} from "../utils/functions.js";
import {AnimatePresence, motion} from "framer-motion";

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
    const [language, setLanguage] = useState('');
    const [customLanguage, setCustomLanguage] = useState('');
    const predefinedLanguages = [
        { label: "Anglický", value: "Anglický" },
        { label: "Francúzsky", value: "Francúzsky" },
        { label: "Nemecký", value: "Nemecký" },
        { label: "Iný", value: "Iný" }
    ];
    const [author, setAuthor] = useState('');
    const [source, setSource] = useState('');

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const changeInputType = () => {
        setInputType((prev) => !prev);
        setError('');
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];  // Get the first selected file
        if (file) {

            if (file.type !== 'application/json') {
                setError('Vložte súbor vo formáte .json.');
                return;
            }

            const reader = new FileReader();  // Create a FileReader instance

            reader.onload = (e) => {
                if (!checkForDuplicates(JSON.parse(e.target.result))) { // Check whether the key has duplicate codes
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
                    key: temp,
                    name,
                    description,
                    language: language === "Iný" ? customLanguage : language,
                    source,
                    author,
                    country,
                    createdAt: new Date().toISOString(),
                    year: year ? Number(year) : -1 // -1 when there is no year provided (so later I know  that are is no year provided, when displaying or filtering)
                };
            } else { // Manual input
                jsonData = {
                    key: data,
                    name,
                    description,
                    country,
                    author,
                    language: language === "Iný" ? customLanguage : language,
                    source,
                    createdAt: new Date().toISOString(),
                    year: year ? Number(year) : -1 // -1 when there is no year provided (so later I know  that are is no year provided, when displaying or filtering)
                };
            }

            if (checkForDuplicates(jsonData.key)) {
                setError("Kľúč nesmie obsahovať duplicitné kódy.")
                return;
            }
            // Check if the structure matches what the server expects
            if (jsonData.key) {
                // Send a POST request to your API


                //  fetch('http://localhost:3000/api/keys',
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/keys`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ""
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

    const beautifyJson = () => {
        try {
            const parsed = JSON.parse(inputText);
            const beautified = JSON.stringify(parsed, null, 4);
            setInputText(beautified);
            setError('');
        } catch (e) {
            setError('Nepodarilo sa zformátovať JSON: Neplatný formát.');
        }
    };


    return (
        <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-custom-dark-blue lg:text-fontSize61 md:text-fontSize48 text-fontSize32 font-bold mb-6 text-center mt-6 px-2">Vložte
                šifrovací kľúč</h1>
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.6, ease: "easeOut"}}>
            <p className="text-custom-dark-blue font-light md:text-fontSize16 text-fontSize12 text-center px-2 sm:px-6">Nahrať
                kľúče je možné v digitálnom
                formáte <span className="font-semibold">(.json)</span> alebo samotným vložením kľúča v JSON formáte do vstupného poľa
                nižšie.</p>
            <div className="bg-white shadow-lg rounded-lg w-11/12 max-w-4xl py-4">


                <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="shadow-lg rounded-xl bg-white p-6 mb-6">
                        <div className="flex justify-center bg-gray-50 border-custom-dark-blue p-4 rounded-lg">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full sm:w-2/3 justify-center">
                                <div>
                                    <label htmlFor="name"
                                           className="mb-2 block text-fontSize16 text-custom-dark-blue">Názov</label>
                                    <input type="text" name="name" id="name" value={name}
                                           onChange={handleInputChange(setName)}
                                           className="w-full text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2"
                                           placeholder="Názov kľúča" required=""/>
                                </div>

                                <div>
                                    <label htmlFor="author"
                                           className="mb-2 block text-fontSize16 text-custom-dark-blue">Autor</label>
                                    <input type="text" name="author" id="author" value={author}
                                           onChange={handleInputChange(setAuthor)}
                                           className="w-full text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2"
                                           placeholder="Meno autora kľúča" required=""/>
                                </div>

                                <div>
                                    <label htmlFor="source"
                                           className="mb-2 block text-fontSize16 text-custom-dark-blue">
                                        Zdroj
                                    </label>
                                    <select
                                        name="source"
                                        id="source"
                                        value={source}
                                        onChange={handleInputChange(setSource)}
                                        className="w-full text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2.5"
                                        required
                                    >
                                        <option value="">-- Vyberte zdroj pôvodu kľúča--</option>
                                        <option value="Archív">Archív</option>
                                        <option value="Kniha">Kniha</option>
                                        <option value="Umelo-vytvorený">Umelo-vytvorený</option>
                                        <option value="Neznámy">Neznámy</option>
                                        <option value="Iný">Iný</option>
                                    </select>
                                </div>


                                <div>
                                    <label htmlFor="country"
                                           className="mb-2 block text-fontSize16 text-custom-dark-blue">Krajina</label>
                                    <input type="text" name="country" id="country" value={country}
                                           onChange={handleInputChange(setCountry)}
                                           className="w-full text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2"
                                           placeholder="Krajina pôvodu" required=""/>
                                </div>

                                <div>
                                    <label htmlFor="language"
                                           className="mb-2 block text-fontSize16 text-custom-dark-blue">Jazyk</label>
                                    <select name="language" id="language" value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="w-full text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2.5"
                                            required="">
                                        <option value="">-- Vyberte jazyk --</option>
                                        {predefinedLanguages.map((lang) => (
                                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {language === "Iný" && (
                                    <div>
                                        <label htmlFor="customLanguage"
                                               className="mb-2 block text-fontSize16 text-custom-dark-blue">Zadajte
                                            jazyk</label>
                                        <input type="text" name="customLanguage" id="customLanguage"
                                               value={customLanguage}
                                               onChange={(e) => setCustomLanguage(e.target.value)}
                                               className="w-full text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2"
                                               placeholder="Jazyk kľúča" required=""/>
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <label htmlFor="description"
                                           className="mb-2 block text-fontSize16 text-custom-dark-blue">Popis</label>
                                    <textarea name="description" id="description" rows="4" value={description}
                                              onChange={handleInputChange(setDescription)}
                                              className="w-full text-fontSize12 border border-custom-dark-blue-hover text-custom-dark-blue rounded-lg focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2"
                                              placeholder="Popis kľúča" required=""/>
                                </div>

                                <div>
                                    <label htmlFor="year"
                                           className="mb-2 block text-fontSize16 text-custom-dark-blue">Rok</label>
                                    <input type="number" name="year" id="year" min="1400" max="2000" value={year}
                                           onChange={handleInputChange(setYear)}
                                           className="w-full text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2"
                                           placeholder="Rok vzniku kľúča" required=""/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mb-5">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={inputType}
                                onChange={changeInputType}
                            />
                            <div
                                className="relative w-11 h-6 bg-custom-dark-blue peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-custom-dark-blue rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-custom-dark-blue peer-checked:bg-custom-dark-blue dark:peer-checked:bg-custom-dark-blue">
                            </div>
                            <span className="ms-3 text-fontSize16 font-semibold text-custom-dark-blue">{inputType ? (
                                "Súbor ako vstup"
                            ) : (
                                "Manuálny vstup"
                            )}</span>

                        </label>
                    </div>
                    <AnimatePresence mode="wait">

                    {inputType ? (
                        <motion.div
                            key="inputMode"
                            initial={{ opacity: 0.6 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0.6 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div className="flex justify-center">
                                <input
                                    type="file"
                                    accept='.json'
                                    onChange={handleFileChange}
                                    className="ml-4 p-1 md:w-2/5 sm:w-2/3 w-5/6 text-fontSize12 md:text-fontSize16 text-custom-dark-blue file:text-custom-dark-blue focus:outline-custom-dark-blue-hover file:bg-custom-light-blue text-sm rounded-full leading-6 file:font-semibold file:border-none file:px-4 file:py-1 file:mr-6 file:rounded-full hover:file:bg-custom-light-blue-hover border border-custom-light-blue"
                                />
                            </div>
                            <div className="relative w-full">

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
}'></textarea>
                                <button
                                    type="button"
                                    onClick={beautifyJson}
                                    className="absolute bottom-2 right-2 px-3 py-2 text-sm bg-custom-dark-blue text-white rounded-3xl hover:bg-custom-dark-blue-hover"
                                >
                                    Beautify JSON
                                </button>
                            </div>
                        </motion.div>

                    ) : (
                        <motion.div
                            key="manualMode"
                            initial={{ opacity: 0.6 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0.6 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="p-4 flex justify-center">
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
                        </motion.div>
                    )}

                    </AnimatePresence>

                    <div className="flex justify-center text-fontSize20">
                        {error ? (
                            <p className="text-red-500 text-center font-semibold">{error}</p>
                        ) : isValid && submissionSuccess ? (
                            <p className="text-green-500 text-center font-semibold">Kľúč bol úspešne uložený.</p>
                        ) : (
                            <p className="text-custom-dark-blue text-center font-semibold">Zadajte šifrovací kľúč v
                                digitálnom
                                formáte.</p>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2 ml-3 bg-custom-light-blue text-custom-dark-blue text-fontSize16 font-semibold rounded-xl hover:bg-custom-light-blue-hover focus:outline-none"
                        >
                            Vložiť
                        </button>
                    </div>


                </form>
            </div>
            </motion.div>
        </div>

    );
}