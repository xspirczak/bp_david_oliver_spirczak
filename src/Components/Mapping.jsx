import {useEffect, useState} from 'react';
import { FaInfoCircle } from "react-icons/fa";
import {AnimatePresence, motion} from "framer-motion";


const facts = [
    "Nomenklátorové šifry kombinovali kódovanie slov a šifrovanie písmen.",
    "Používali sa najmä v 15. až 18. storočí v diplomatickej korešpondencii.",
    "Často obsahovali špeciálne kódy pre mená, miesta alebo výrazy.",
    "Rozlúštenie nomenklátorov bolo kľúčové v historickej kryptanalýze.",
];
const Mapping = () => {
    const [ciphertext, setCiphertext] = useState('');
    const [key, setKey] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [mappingMode, setMappingMode] = useState(true); // true: ciphertext-to-key, false: key-to-ciphertexts
    const [viewDecrypted, setViewDecrypted] = useState([]); // Now an array to track each result's state
    const [resultData, setResultData] = useState([]);
    const [language, setLanguage] = useState('');
    const [copiedTextId, setCopiedTextId] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [parsedKey, setParsedKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [factIndex, setFactIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFactIndex(prev => (prev + 1) % facts.length);
        }, 4000); // každé 4 sekundy

        return () => clearInterval(interval); // vyčistenie po unmountnutí
    }, []);

    useEffect(() => {
        setIsClient(true);
    }, []);


    const changeMappingMode = () => {
        setMappingMode((prev) => !prev);
        setCiphertext(''); // Reset input fields when switching modes
        setKey('');
        setResult(null);
        setError('');
        setViewDecrypted([]); // Reset view states
        setLanguage('');
    };

    const mapCiphertextToKey = async () => {
        if (!ciphertext.trim()) {
            setError('Šifrovaný text nesmie byť prázdny.');
            return;
        }

        setLoading(true);

        try {
            setError('');
            setResultData([]); // Clear previous results

            //console.log(ciphertext, language);
            // fetch('http://localhost:3000/api/mapping/ciphertext-to-key',
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mapping/ciphertext-to-key`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ ciphertext, language }),
            });

            if (!response.ok) {
                setLoading(false)
                throw new Error(`HTTP chyba: ${response.status} - ${await response.text()}`);
            }

            const data = await response.json();
            //console.log("Vysledok: ", data);

            setResult(data);
            // Initialize viewDecrypted for each result as true (showing plaintext by default)
            setViewDecrypted(data.map(() => true));


            // fetch(`http://localhost:3000/api/keys/${item.keyId}`,
            const keyDataPromises = data.slice(0, 3).map(async (item) => {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/keys/${item.keyId}`,  {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) {
                    throw new Error(`HTTP chyba: ${res.status} - ${await res.text()}`);
                }

                return res.json();
            });

            const keysData = await Promise.all(keyDataPromises);
            setLoading(false);

            setResultData(keysData);


            console.log(keysData);
        } catch (error) {
            setLoading(false);
            setError('Chyba pri mapovaní: ' + error.message);
            console.error('Chyba pri mapovaní:', error);
        }
    };

    const mapKeyToCiphertexts = async () => {
        if (!key.trim()) {
            setError('Kľúč nesmie byť prázdny.');
            return;
        }

        setLoading(true);

        try {
            let keyToSend = key;

            if (typeof key === 'string') {
                try {
                    keyToSend = JSON.parse(key);
                } catch (error) {
                    setLoading(false);
                    setError('Zadajte kľúč vo formáte JSON.');
                    return;
                }
            }

            if (!keyToSend || typeof keyToSend !== 'object' || Array.isArray(keyToSend)) {
                setLoading(false);
                setError('Kľúč musí byť platný objekt.');
                return;
            }

            setError('');

            // fetch('http://localhost:3000/api/mapping/key-to-ciphertexts',
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/mapping/key-to-ciphertexts`,  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ key: keyToSend }),
            });

            if (!response.ok) {
                setLoading(false);
                throw new Error(`HTTP chyba: ${response.status} - ${await response.text()}`);
            }

            const data = await response.json();
            setResult(data);
            setViewDecrypted(data.map(() => true));
            setParsedKey(keyToSend);
            setLoading(false);


        } catch (error) {
            setLoading()
            setError('Chyba pri mapovaní: ' + error.message);
            console.error('Chyba pri mapovaní:', error);
        }
    };

    const handleCopy = (plaintext, id) => {
        navigator.clipboard.writeText(plaintext)
            .then(() =>  {
                setCopiedTextId(id);
                setTimeout(() => setCopiedTextId(null), 2000);
            })
            .catch(err => console.error("Error copying text: ", err));
    };

    const handleDownload = (plaintext) => {
        if (!isClient) return;
        const element = document.createElement("a");
        const file = new Blob([plaintext], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `text.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, ease: "easeOut"}}
            className="flex flex-col justify-center items-center mb-6">
            <h1 className="text-custom-dark-blue lg:text-fontSize61 md:text-fontSize48 text-fontSize32 font-bold mb-6 text-center mt-6 px-2">
                Mapovanie dokumentov
            </h1>

            <div
                className="grid gap-2 text-custom-dark-blue font-light md:text-fontSize16 text-fontSize12 text-center px-4 mb-5">
                Mapujte šifrovaný text na šifrovací kľúč alebo šifrovací kľúč na šifrované texty.
                <span className="font-semibold flex text-center justify-center items-center gap-2">
        Vyberte režim a zadajte vstup
        <div className="relative group inline-block">
            <FaInfoCircle className="text-custom-dark-blue cursor-pointer"/>
            <span
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 text-fontSize12 text-white bg-custom-dark-blue rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center z-10"
                        id="tooltipDocuments"
                    >
                        Prepínačom vyberte požadovaný režim mapovania.
                    </span>
        </div>
            </span>
            </div>


            <div className="bg-white shadow-lg rounded-lg sm:p-6 p-2 w-11/12 max-w-7xl">
                {/* Toggle Switch */}
                <motion.div className="flex justify-center mb-4">
                    <button
                        onClick={changeMappingMode}
                        className="flex items-center gap-2 px-4 py-2 bg-custom-dark-blue text-white rounded-full shadow hover:bg-custom-dark-blue-hover transition-colors duration-300"
                    >
        <span className="transition-transform duration-500 ease-in-out">
            {mappingMode ? 'Šifrovaný text' : 'Šifrovací kľúč'}
        </span>

                        <svg
                            className={`w-5 h-5 transform transition-transform duration-500 ${
                                mappingMode ? 'rotate-0' : 'rotate-180'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>

                        <span className="transition-transform duration-500 ease-in-out">
            {mappingMode ? 'Šifrovací kľúč' : 'Šifrovaný text'}
        </span>
                    </button>
                </motion.div>


                <AnimatePresence mode="wait">

                {/* Input Form */}
                {mappingMode ? (
                    <motion.div
                        key="mapMode"
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0.6 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col items-center">
                        <h2 className="text-custom-dark-blue text-fontSize24 font-semibold my-2 text-center">
                            Mapovať šifrovaný text na šifrovací kľúč
                        </h2>
                        <div className="my-3">
                            <label htmlFor="language"
                                   className="block mb-2 text-fontSize16 text-custom-dark-blue font-semibold">Vyberte
                                jazyk (využíva sa na frekvečnú analýzu dešifrovaného textu)</label>
                            <div className="flex flex-col items-center">
                                <select id="language"
                                        className="w-1/2 bg-gray-50 border border-custom-dark-blue focus:outline-custom-dark-blue text-custom-dark-blue text-fontSize16 rounded-xl focus:ring-custom-dark-blue-hover focus:border-custom-dark-blue-hover block p-2.5"
                                        onChange={(e) => setLanguage(e.target.value)}
                                        value={language}
                                >
                                    <option defaultChecked value="">Vyberte jazyk</option>
                                    <option value="english">Anglicky</option>
                                    <option value="french">Francúzsky</option>
                                    <option value="gernam">Nemecky</option>
                                </select>
                            </div>
                        </div>
                        <textarea
                            rows="10"
                            value={ciphertext}
                            onChange={(e) => setCiphertext(e.target.value)}
                            placeholder="Zadajte šifrovaný text (v tvare: #1 #4 #56 #222)"
                            className="mt-1 block w-full sm:w-2/3 rounded-3xl shadow-md sm:text-sm p-4 resize-none border-2 focus:outline-custom-dark-blue-hover border-dashed border-custom-dark-blue-hover"
                        />
                        <button
                            onClick={mapCiphertextToKey}
                            className="mt-4 px-6 py-2 bg-custom-light-blue text-custom-dark-blue text-fontSize16 font-semibold rounded-xl hover:bg-custom-light-blue-hover focus:outline-none"
                        >
                            Mapovať
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="keyMode"
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0.6 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <h2 className="text-custom-dark-blue text-fontSize24 font-semibold my-2">
                            Mapovať šifrovací kľúč na šifrované texty
                        </h2>
                        <textarea
                            value={key}
                            rows="10"
                            onChange={(e) => setKey(e.target.value)}
                            placeholder='Zadajte kľúč (napr. { "e": [1], "d": [4], "j": [56, 222, 333] })'
                            className="mt-1 block w-full sm:w-2/3 rounded-3xl shadow-md sm:text-sm p-4 resize-none border-2 focus:outline-custom-dark-blue-hover border-dashed border-custom-dark-blue-hover"
                        />
                        <button
                            onClick={mapKeyToCiphertexts}
                            className="mt-4 px-6 py-2 bg-custom-light-blue text-custom-dark-blue text-fontSize16 font-semibold rounded-xl hover:bg-custom-light-blue-hover focus:outline-none"
                        >
                            Mapovať
                        </button>
                    </motion.div>
                )}
                </AnimatePresence>


                {/* Error Message */}
                {error ? (
                    <div className="text-red-500 text-center mt-4">
                        {error}
                    </div>
                ) : (
                    <div className="text-red-500 text-center mt-4 invisible">
                        Error placeholder
                    </div>
                )}

                {/* Results */}
                {loading && (
                    <div className="flex flex-col items-center mt-6 min-h-[60vh] text-center px-4">
                        <div
                            className="animate-spin rounded-full h-10 w-10 border-t-4 border-custom-dark-blue mb-3"></div>

                        <p className="text-lg text-custom-dark-blue font-medium">Prebieha mapovanie...</p>

                        <p className="text-sm text-gray-500 mt-1">
                            Tento proces môže chvíľu trvať.&nbsp;
                            <span
                                className="block text-xs text-gray-400 mt-1 italic max-w-xs mx-auto transition-opacity duration-500">
            {facts[factIndex]}
        </span>
                        </p>
                    </div>

                )}
                {!loading && result && (
                    <div className="w-full">
                        <h3 className="text-custom-dark-blue text-fontSize28 md:text-fontSize48 font-bold mb-6 text-center">
                            Výsledky mapovania:
                        </h3>
                        {result.length === 0 ? (
                            <p className="text-center text-custom-dark-blue">
                                Žiadne výsledky nenájdené.
                            </p>
                        ) : (
                            <div className="flex flex-col items-center gap-6">
                                {result.map((item, index) => (
                                    <div
                                        key={index}
                                        className="max-w-full w-full sm:w-3/4 rounded-3xl px-6 py-5 bg-custom-dark-blue shadow-lg transform transition-all duration-500 ease-in-out opacity-0 animate-fadeIn"
                                    >
                                        <p className="text-white font-semibold text-fontSize24 text-center mb-3 flex justify-center items-center gap-2">
                                            <span
                                                className="text-fontSize28 font-bold">#{index + 1}</span> Skóre: {(item.score * 100).toFixed(2)} /
                                            100
                                        </p>
                                        {mappingMode ? (
                                            viewDecrypted[index] ? (
                                                <div>
                                                    <div className="flex mb-2 sm:justify-start justify-center">
                                                        <div className="relative flex items-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(item.plaintext, index)}
                                                                className="p-1 px-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-3xl sm:text-fontSize16 text-fontSize12 relative group">
                                                                <svg width="24" height="24" viewBox="0 0 24 24"
                                                                     fill="none"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <g clipPath="url(#clip0_118_80)">
                                                                        <path
                                                                            d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5M11 9H20C21.1046 9 22 9.89543 22 11V20C22 21.1046 21.1046 22 20 22H11C9.89543 22 9 21.1046 9 20V11C9 9.89543 9.89543 9 11 9Z"
                                                                            stroke="#D9D9D9" strokeWidth="4"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"/>
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0_118_80">
                                                                            <rect width="24" height="24" fill="white"/>
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                                <span
                                                                    className="absolute left-2/3 top-10 ml-2 whitespace-nowrap bg-custom-dark-blue text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Kopírovať dešifrovaný text
                                                </span>
                                                            </button>
                                                            {copiedTextId === index && (
                                                                <div
                                                                    className="absolute bg-custom-dark-blue-hover top-0 right-0 text-white text-sm px-2 py-1 rounded-3xl shadow-lg mt-[-35px] mr-2">
                                                                    Skopírované!
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="relative flex items-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDownload(item.plaintext)}
                                                                disabled={!isClient}
                                                                className="p-1 px-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-3xl sm:text-fontSize16 text-fontSize12 relative group">
                                                                <svg width="24" height="24" viewBox="0 0 24 24"
                                                                     fill="none"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z"
                                                                        fill="#FEF7FF"/>
                                                                </svg>
                                                                <span
                                                                    className="absolute left-2/3 top-10 ml-2 whitespace-nowrap bg-custom-dark-blue text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Stiahni .txt subor
                                            </span>

                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="justify-center sm:flex gap-6">
                                                        <div
                                                            className="mb-2 p-4 rounded-lg shadow-sm bg-custom-dark-blue-hover max-h-40 overflow-y-auto w-full sm:w-1/2">
                                                            <p className="text-white font-semibold mb-2 text-fontSize17">Šifrovaný text:</p>
                                                            <p className="break-all text-gray-50">{ciphertext}</p>
                                                        </div>
                                                        <div
                                                            className="mb-2 p-4 rounded-lg shadow-sm bg-custom-dark-blue-hover max-h-40 overflow-y-auto w-full sm:w-1/2">
                                                            <p className="text-white font-semibold mb-2 text-fontSize17">Dešifrovaný
                                                                text:</p>
                                                            <p className="break-all text-gray-50">{item.plaintext}</p>
                                                        </div>

                                                        <div
                                                            className="mb-2 p-4 rounded-lg shadow-sm bg-custom-dark-blue-hover max-h-40 overflow-y-auto w-full sm:w-1/2">
                                                            <p className="text-white font-semibold mb-2 text-fontSize17">Použitý
                                                                kľúč:</p>

                                                            {(resultData[index] &&
                                                                Object.entries(typeof resultData[index].key.key === "string" ? JSON.parse(resultData[index].key.key) : resultData[index].key.key)
                                                                    .map(([keyName, values]) => (
                                                                        <div key={keyName} className="my-2">
                                                                <span
                                                                    className="text-white font-bold">{keyName.toUpperCase()}:</span>
                                                                            <span className="text-white ml-2">
                                                                        {Array.isArray(values) ? values.join(", ") : Object.values(values).join(", ")}
                                                                    </span>
                                                                        </div>
                                                                    )))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null
                                        ) : (
                                            viewDecrypted[index] ? (
                                                <div>
                                                    <div className="flex mb-2 justify-start">
                                                        <div className="relative flex items-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(item.plaintext, index)}
                                                                className="p-1 px-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-3xl sm:text-fontSize16 text-fontSize12 relative group">
                                                                <svg width="24" height="24" viewBox="0 0 24 24"
                                                                     fill="none"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <g clipPath="url(#clip0_118_80)">
                                                                        <path
                                                                            d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5M11 9H20C21.1046 9 22 9.89543 22 11V20C22 21.1046 21.1046 22 20 22H11C9.89543 22 9 21.1046 9 20V11C9 9.89543 9.89543 9 11 9Z"
                                                                            stroke="#D9D9D9" strokeWidth="4"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"/>
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0_118_80">
                                                                            <rect width="24" height="24" fill="white"/>
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                                <span
                                                                    className="absolute right-2/3 top-10 ml-2 whitespace-nowrap bg-custom-dark-blue text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Kopírovať dešifrovaný text
                                                </span>
                                                            </button>
                                                            {copiedTextId === index && (
                                                                <div
                                                                    className="absolute bg-custom-dark-blue-hover top-0 right-0 text-white text-sm px-2 py-1 rounded-3xl shadow-lg mt-[-35px] mr-2">
                                                                    Skopírované!
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="relative flex items-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDownload(item.plaintext)}
                                                                disabled={!isClient}
                                                                className="p-1 px-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-3xl sm:text-fontSize16 text-fontSize12 relative group">
                                                                <svg width="24" height="24" viewBox="0 0 24 24"
                                                                     fill="none"
                                                                     xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z"
                                                                        fill="#FEF7FF"/>
                                                                </svg>
                                                                <span
                                                                    className="absolute right-2/3 top-10 ml-2 whitespace-nowrap bg-custom-dark-blue text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Stiahni .txt subor
                                            </span>

                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="justify-center sm:flex gap-6">
                                                        <div
                                                            className="mb-2 p-4 rounded-lg shadow-sm bg-custom-dark-blue-hover max-h-40 overflow-y-auto w-full sm:w-1/2">
                                                            <p className="text-white font-semibold mb-2 text-fontSize17">Šifrovaný
                                                                text:</p>
                                                            <p className="break-all text-gray-50">{item.document}</p>
                                                        </div>

                                                        <div
                                                            className="mb-2 p-4 rounded-lg shadow-sm bg-custom-dark-blue-hover max-h-40 overflow-y-auto w-full sm:w-1/2">
                                                            <p className="text-white font-semibold mb-2 text-fontSize17">Dešifrovaný
                                                                text:</p>
                                                            <p className="break-all text-gray-50">{item.plaintext}</p>
                                                        </div>
                                                        <div
                                                            className="mb-2 p-4 rounded-lg shadow-sm bg-custom-dark-blue-hover max-h-40 overflow-y-auto w-full sm:w-1/2">
                                                            <p className="text-white font-semibold mb-2 text-fontSize17">Použitý
                                                                kľúč:</p>

                                                            {parsedKey && Object.entries(
                                                                typeof parsedKey === "string" ? JSON.parse(parsedKey) : parsedKey
                                                            ).map(([keyName, values]) => (
                                                                <div key={keyName} className="my-2">
                                                                    <span
                                                                        className="text-white font-bold">{keyName.toUpperCase()}:</span>
                                                                    <span className="text-white ml-2">
                                                                  {Array.isArray(values)
                                                                      ? values.join(", ")
                                                                      : typeof values === "object"
                                                                          ? Object.values(values).join(", ")
                                                                          : values.toString()}
                                                                </span>
                                                                </div>
                                                            ))}

                                                        </div>
                                                    </div>

                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    )
        ;
};

export default Mapping;