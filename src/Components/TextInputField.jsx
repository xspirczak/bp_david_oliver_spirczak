import  { useState } from 'react'
import {motion} from "framer-motion";

export default function TextInputField() {
    const [error, setError] = useState(''); // State to store the error message
    const [isValid, setIsValid] = useState(false); // State to store the JSON validation status
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const [inputText, setInputText] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [customLanguage, setCustomLanguage] = useState('');
    const predefinedLanguages = [
        { label: "Anglický", value: "Anglický" },
        { label: "Francúzsky", value: "Francúzsky" },
        { label: "Nemecký", value: "Nemecký" },
        { label: "Iný", value: "Iný" }
    ];

    const [source, setSource] = useState('');
    const [year, setYear] = useState('');
    const [country, setCountry] = useState("");
    const [author, setAuthor] = useState("");

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    // Zmena vybraného súboru
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {

            if (file.type !== 'text/plain') {
                setError('Nahrajte súbor vo formáte .txt!');
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                setInputText(e.target.result);
                setError('');
            };

            reader.onerror = (e) => {
                console.error('Error reading file:', e);
            };

            reader.readAsText(file);
        }

    };

    // Vytvorenie nového záznamu
    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedInput = inputText.trim();

        if (trimmedInput === '') {
            setIsValid(false);
            setSubmissionSuccess(false);
            setError('Vstupné pole nesmie byť prazdne!');
            return;
        }

        const validFormat = /^([A-Za-z]+|#[0-9a-fA-F]+|[!.,?]|\s)+$/;

        if (!validFormat.test(trimmedInput)) {
            setError("Text obsahuje neplatné znaky alebo formát.");
            return;
        }

        if (language === 'Iný' && !customLanguage.trim()) {
            setError("Zadajte jazyk textu.");
            return;
        }

        const jsonData = {
            document: trimmedInput,
            name,
            description,
            language: language === "Iný" ? customLanguage : language,
            country,
            source,
            author,
            createdAt: new Date().toISOString(),
            year: year ? Number(year) : -1
        };


        try {

            // fetch('http://localhost:3000/api/texts',
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/texts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ""
                },
                body: JSON.stringify(jsonData)
            });


            if (response.ok) {
                const result = await response.json();
                setInputText('');
                setName('');
                setDescription('');
                setLanguage('');
                setCustomLanguage('');
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
        <div
            className="flex flex-col items-center justify-center mb-6">

            <h1 className="text-custom-dark-blue lg:text-fontSize61 md:text-fontSize48 text-fontSize32 font-bold mb-6 text-center mt-6 px-2">Vložte
                šifrovaný text</h1>

            <p className="text-custom-dark-blue font-light md:text-fontSize16 text-fontSize12 text-center px-2 sm:px-6">Nahrať
                text je možné v digitálnom
                formáte <span className="font-semibold">(.txt)</span> alebo samotným vložením textu do vstupného
                poľa
                nižšie.</p>

            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.6, ease: "easeOut"}}
                className="lg:w-1/2 w-5/6"
            >


                <div className="bg-white shadow-lg rounded-3xl py-4">
                    <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="shadow-lg rounded-xl bg-white p-6 mb-6">
                            <div className="flex justify-center bg-gray-50 border-custom-dark-blue p-4 rounded-3xl">
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full sm:w-2/3 justify-center">
                                    <div>
                                        <label htmlFor="name"
                                               className="mb-2 block text-fontSize16 text-custom-dark-blue">Názov</label>
                                        <input type="text" name="name" id="name" value={name}
                                               onChange={handleInputChange(setName)}
                                               className="w-full text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2"
                                               placeholder="Názov textu" required=""/>
                                    </div>

                                    <div>
                                        <label htmlFor="author"
                                               className="mb-2 block text-fontSize16 text-custom-dark-blue">Autor</label>
                                        <input type="text" name="author" id="author" value={author}
                                               onChange={handleInputChange(setAuthor)}
                                               className="w-full text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2"
                                               placeholder="Meno autora textu" required=""/>
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
                                            required=""
                                        >
                                            <option value="">-- Vyberte zdroj pôvodu textu --</option>
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
                                                   placeholder="Jazyk textu" required=""/>
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <label htmlFor="description"
                                               className="mb-2 block text-fontSize16 text-custom-dark-blue">Popis</label>
                                        <textarea name="description" id="description" rows="4" value={description}
                                                  onChange={handleInputChange(setDescription)}
                                                  className="w-full text-fontSize12 border border-custom-dark-blue-hover text-custom-dark-blue rounded-lg focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2"
                                                  placeholder="Popis textu" required=""/>
                                    </div>

                                    <div>
                                        <label htmlFor="year"
                                               className="mb-2 block text-fontSize16 text-custom-dark-blue">Rok</label>
                                        <input type="number" name="year" id="year" min="1400" max="2000" value={year}
                                               onChange={handleInputChange(setYear)}
                                               className="w-full text-fontSize12 border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-custom-dark-blue-hover focus:outline-custom-dark-blue-hover focus:border-custom-dark-blue-hover p-2"
                                               placeholder="Rok vzniku textu" required=""/>
                                    </div>
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

                        <div className="relative rounded-3xl px-4">
                        <textarea
                            id="textarea"
                            name="textarea"
                            rows="10"
                            value={inputText}
                            onChange={handleInputChange(setInputText)}
                            className="block w-full rounded-3xl shadow-md sm:text-sm p-4 resize-none border-2 focus:outline-custom-dark-blue-hover border-dashed border-custom-dark-blue-hover"
                            placeholder='Sem vložte šifrovaný text v digitalnom formáte (napr. Toto #5#2 príklad #1e#4tu)'></textarea>
                        </div>
                        <div className="flex justify-center text-fontSize20">
                            {error ? (
                                <p className="text-red-500 text-center font-semibold">{error}</p>
                            ) : isValid && submissionSuccess ? (
                                <p className="text-green-500 text-center font-semibold">Text bol úspešné uložený.</p>
                            ) : (
                                <p className="text-custom-dark-blue text-center font-semibold">Zadajte šifrovaný text v
                                    digitálnom
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
                    </form>
                </div>
            </motion.div>
        </div>
    );
}