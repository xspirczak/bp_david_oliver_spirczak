import { useState, useEffect } from "react";
import axios from "axios";
import DisplayKey from "../Components/DisplayKey.jsx";
import DisplayText from "./DisplayText.jsx";
import SearchBar from "../Components/Filters.jsx";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {normalizeString} from "../utils/functions.js";
import {motion} from "framer-motion";

export default function DisplayAllDocuments() {
    const [keys, setKeys] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        searchText: '',
        key: true,
        document: true,
        yearRange: { start: '', end: '' },
        language: [],
        source: [],
        country: []
    });
    const [userId, setUserId] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // axios.get("http://localhost:3000/api/keys"),
    // axios.get("http://localhost:3000/api/texts",
    useEffect(() => {
        Promise.all([

            axios.get(`${import.meta.env.VITE_API_URL}/api/keys`),
            axios.get(`${import.meta.env.VITE_API_URL}/api/texts`, {
                headers: {
                    'Authorization': localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ""
                },
            }),
        ])
            .then(([keysResponse, docsResponse]) => {
                setKeys(keysResponse.data);
                setDocuments(docsResponse.data.documents);
                setUserId(docsResponse.data.userId);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);



    useEffect(() => {
        let filteredKeys = keys;
        let filteredDocuments = documents;
        const normalizedSearchText = normalizeString(filters.searchText.toLowerCase());


        if (filters.searchText) {
            filteredKeys = filteredKeys.filter(key =>
                normalizeString(key.name.toLowerCase()).includes(normalizedSearchText)
            );
            filteredDocuments = filteredDocuments.filter(doc =>
                normalizeString(doc.name.toLowerCase()).includes(normalizedSearchText)
            );
        }

        if (!filters.key) filteredKeys = [];
        if (!filters.document) filteredDocuments = [];

        if (filters.yearRange.start && filters.yearRange.end) {
            const startYear = parseInt(filters.yearRange.start, 10);
            const endYear = parseInt(filters.yearRange.end, 10);

            filteredDocuments = filteredDocuments.filter(doc =>
                (typeof doc.year !== "number") || doc.year === -1 || (doc.year >= startYear && doc.year <= endYear)
            );

            filteredKeys = filteredKeys.filter(key =>
                (typeof key.year !== "number") || key.year === -1 || (key.year >= startYear && key.year <= endYear)
            );
        }

        if (filters.language && filters.language.length > 0) {
            const selectedLanguages = filters.language.map(lang => lang.toLowerCase());

            filteredDocuments = filteredDocuments.filter(doc =>
                doc.language &&
                (selectedLanguages.includes(doc.language.toLowerCase()) || doc.language.trim() === "")
            );

            filteredKeys = filteredKeys.filter(key =>
                key.language &&
                (selectedLanguages.includes(key.language.toLowerCase()) || key.language.trim() === "")
            );
        }


        if (filters.source && filters.source.length > 0) {
            const selectedSources = filters.source.map(lang => lang.toLowerCase());

            filteredDocuments = filteredDocuments.filter(doc =>
                doc.source &&
                (selectedSources.includes(doc.source.toLowerCase()) || doc.source.trim() === "")
            );

            filteredKeys = filteredKeys.filter(key =>
                key.source &&
                (selectedSources.includes(key.source.toLowerCase()) || key.source.trim() === "")
            );
        }

        if (filters.country && filters.country.length > 0) {
            const selectedCountries = filters.country.map(lang => lang.toLowerCase());

            filteredDocuments = filteredDocuments.filter(doc =>
                doc.country &&
                (selectedCountries.includes(doc.country.toLowerCase()) || doc.country.trim() === "")
            );

            filteredKeys = filteredKeys.filter(key =>
                key.country &&
                (selectedCountries.includes(key.country.toLowerCase()) || key.country.trim() === "")
            );
        }

        setFilteredKeys(filteredKeys);
        setFilteredDocuments(filteredDocuments);
        setCurrentPage(1);
    }, [filters, keys, documents]);

    const handleSearchChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };


    const deleteKey = (keyId) => {
        const updatedKeys = filteredKeys.filter(key => key._id !== keyId);
        setFilteredKeys(updatedKeys);
        setKeys(prevKeys => prevKeys.filter(key => key._id !== keyId)); // Aktualizuj aj hlavný zoznam
        adjustCurrentPage([...updatedKeys, ...filteredDocuments]);
    };

    const deleteDoc = (docId) => {
        const updatedDocs = filteredDocuments.filter(doc => doc._id !== docId);
        setFilteredDocuments(updatedDocs);
        setDocuments(prevDocs => prevDocs.filter(doc => doc._id !== docId)); // Aktualizuj aj hlavný zoznam
        adjustCurrentPage([...filteredKeys, ...updatedDocs]);
    };

    // Funkcia na úpravu currentPage po odstránení
    const adjustCurrentPage = (updatedItems) => {
        const newTotalPages = Math.ceil(updatedItems.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (newTotalPages === 0) {
            setCurrentPage(1); // Ak nie sú žiadne položky, vráť sa na stranu 1
        }
    };


    // Zlúčenie filtrovaných dát pred stránkovaním
    const filteredTogether = [...filteredKeys, ...filteredDocuments];


    // Aplikovanie stránkovania na zlúčené dáta
    const paginatedTogether = filteredTogether.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Rozdelenie na keys a documents po stránkovaní
    const paginatedKeys = paginatedTogether.filter(item => Object.hasOwn(item, 'key'));
    const paginatedDocuments = paginatedTogether.filter(item => Object.hasOwn(item, 'document'));


    // Calculates how many pages are needed
    const totalPages = Math.ceil(filteredTogether.length / itemsPerPage);



    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const isSmallScreen = windowWidth < 500;
        const buttons = [];

        // Predchádzajúca
        buttons.push(
            <button
                key="prev"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-2 border rounded disabled:opacity-50"
            >
                <GrFormPrevious />
            </button>
        );

        if (isSmallScreen) {
            // Prvá strana
            buttons.push(
                <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-custom-dark-blue text-white" : "bg-white text-black"}`}
                >
                    1
                </button>
            );

            // Ellipsis pred currentPage
            if (currentPage > 2 && currentPage < totalPages) {
                buttons.push(<span key="start-ellipsis" className="px-2">...</span>);
            }

            // Aktuálna strana
            if (currentPage !== 1 && currentPage !== totalPages) {
                buttons.push(
                    <button
                        key={currentPage}
                        onClick={() => setCurrentPage(currentPage)}
                        className="px-3 py-1 border rounded bg-custom-dark-blue text-white"
                    >
                        {currentPage}
                    </button>
                );
            }

            // Ellipsis za currentPage
            if (currentPage < totalPages - 1 && currentPage > 1) {
                buttons.push(<span key="end-ellipsis" className="px-2">...</span>);
            }

            // Posledná strana
            if (totalPages > 1) {
                buttons.push(
                    <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-3 py-1 border rounded ${currentPage === totalPages ? "bg-custom-dark-blue text-white" : "bg-white text-black"}`}
                    >
                        {totalPages}
                    </button>
                );
            }
        } else {
            // Pôvodná logika pre väčšie obrazovky
            const maxVisible = 2;
            const startPage = Math.max(2, currentPage - maxVisible);
            const endPage = Math.min(totalPages - 1, currentPage + maxVisible);

            buttons.push(
                <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-custom-dark-blue text-white" : "bg-white text-black"}`}
                >
                    1
                </button>
            );

            if (startPage > 2) buttons.push(<span key="start-ellipsis" className="px-2">...</span>);

            for (let i = startPage; i <= endPage; i++) {
                buttons.push(
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-1 border rounded ${currentPage === i ? "bg-custom-dark-blue text-white" : "bg-white text-black"}`}
                    >
                        {i}
                    </button>
                );
            }

            if (endPage < totalPages - 1) buttons.push(<span key="end-ellipsis" className="px-2">...</span>);

            if (totalPages > 1) {
                buttons.push(
                    <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-3 py-1 border rounded ${currentPage === totalPages ? "bg-custom-dark-blue text-white" : "bg-white text-black"}`}
                    >
                        {totalPages}
                    </button>
                );
            }
        }

        buttons.push(
            <button
                key="next"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-2 border rounded disabled:opacity-50"
            >
                <GrFormNext />
            </button>
        );

        return (
            <div className="flex justify-center space-x-2 mt-4 flex-wrap">
                {buttons}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-custom-dark-blue"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, ease: "easeOut"}}
            className="flex flex-col min-h-screen p-4">
            <SearchBar filters={filters} onFilterChange={handleSearchChange}/>

            <div className="flex-grow">
                {filteredKeys.length === 0 && filteredDocuments.length === 0 && (
                    <div className="text-center text-fontSize28 text-custom-dark-blue font-bold">Žiadne dokumenty na
                        zobrazenie.</div>
                )}


                    {paginatedKeys.length > 0 &&
                        <DisplayKey userId={userId} keys={paginatedKeys} setKeys={setKeys} deleteKey={deleteKey}/>}
                    {paginatedDocuments.length > 0 &&
                        <DisplayText userId={userId} docs={paginatedDocuments} setDocs={setDocuments}
                                     deleteDoc={deleteDoc}/>}
                </div>

                <div className="mt-auto">{renderPagination()}</div>
            </motion.div>
            );
            }
