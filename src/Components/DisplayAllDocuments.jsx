import { useState, useEffect } from "react";
import axios from "axios";
import DisplayKey from "../Components/DisplayKey.jsx";
import DisplayDocument from "../Components/DisplayDocument.jsx";
import SearchBar from "../Components/Filters.jsx"; // Import SearchBar component

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
    });
    const [userId, setUserId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3000/api/keys"),
            axios.get("http://localhost:3000/api/documents", {
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

    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

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
                doc.year >= startYear && doc.year <= endYear || doc.year === -1
            );
            filteredKeys = filteredKeys.filter(key =>
                key.year >= startYear && key.year <= endYear || key.year === -1
            );
        }

        setFilteredKeys(filteredKeys);
        setFilteredDocuments(filteredDocuments);
        setCurrentPage(1); // Reset to first page when filters change
    }, [filters, keys, documents]);

    const handleSearchChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    // All keys + documents together
    const together = [...filteredKeys,   ...filteredDocuments];

    // Select only 'itemsPerPage' pages
    const paginatedTogether = together.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    //console.log("TOGETHER: ",paginatedTogether)

    // Keys that have been selected
    const paginatedKeys = paginatedTogether.filter((o) => (Object.hasOwn(o, 'key')));

    // Documents that have been selected
    const paginatedDocuments = paginatedTogether.filter((o) => (Object.hasOwn(o, 'document')));

    //console.log("KEYS ",paginatedKeys);
    //console.log("DOCUMENTS", paginatedDocuments);

    //const paginatedKeys = filteredKeys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); // pre 1. stranu 0-5
    //const paginatedDocuments = filteredDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Calculates how many pages are needed
    const totalPages = Math.ceil((filteredKeys.length + filteredDocuments.length) / itemsPerPage);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 border rounded ${currentPage === i ? "bg-custom-dark-blue text-white" : "bg-white text-black"}`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center space-x-2 mt-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Predchadzajúca
                </button>
                {pageNumbers}
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Ďalšia
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen p-4">
            <SearchBar filters={filters} onFilterChange={handleSearchChange}/>

            <div className="flex-grow">
                {filteredKeys.length === 0 && filteredDocuments.length === 0 && (
                    <div className="text-center text-fontSize28 text-custom-dark-blue font-bold">Žiadne dokumenty na zobrazenie.</div>
                )}

                {paginatedKeys.length > 0 && <DisplayKey userId={userId} keys={paginatedKeys} setKeys={setKeys}/>}
                {paginatedDocuments.length > 0 && <DisplayDocument userId={userId} docs={paginatedDocuments} setDocs={setDocuments}/>}
            </div>

            <div className="mt-auto">{renderPagination()}</div>
        </div>
    );
}
