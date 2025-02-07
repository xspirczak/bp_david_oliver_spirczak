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

    // Fetch keys and documents
    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3000/api/keys"),
            axios.get("http://localhost:3000/api/documents"),
        ])
            .then(([keysResponse, docsResponse]) => {
                setKeys(keysResponse.data);
                setDocuments(docsResponse.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    function normalizeString(str) { // Normalizes the string for better search
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents
    }

    // Filter the keys and documents based on the search filters
    useEffect(() => {
        let filteredKeys = keys;
        let filteredDocuments = documents;

        const normalizedSearchText = normalizeString(filters.searchText.toLowerCase());

        // Filter by search text (if provided)
        if (filters.searchText) {
            filteredKeys = filteredKeys.filter(key =>
                normalizeString(key.name.toLowerCase()).includes(normalizedSearchText)
            );
            filteredDocuments = filteredDocuments.filter(doc =>
                normalizeString(doc.name.toLowerCase()).includes(normalizedSearchText)
            );
        }

        // Filter by key/document checkbox selection
        if (filters.key) {
            filteredKeys = filteredKeys; // Already filtered for keys
        } else {
            filteredKeys = [];
        }

        if (filters.document) {
            filteredDocuments = filteredDocuments; // Already filtered for documents
        } else {
            filteredDocuments = [];
        }

        // Filter by year range
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
    }, [filters, keys, documents]);

    const handleSearchChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <SearchBar filters={filters} onFilterChange={handleSearchChange}/>


            {filteredKeys.length > 0 && <DisplayKey keys={filteredKeys} />}
            {filteredDocuments.length > 0 && <DisplayDocument docs={filteredDocuments} />}
        </div>
    );
}
