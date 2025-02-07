import { useState, useEffect } from "react";
import axios from "axios";
import DisplayKey from "../Components/DisplayKey.jsx";
import DisplayDocument from "../Components/DisplayDocument.jsx";

export default function DisplayAllDocuments() {
    const [keys, setKeys] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch keys and documents simultaneously
        Promise.all([
            axios.get("http://localhost:3000/api/keys"),
            axios.get("http://localhost:3000/api/documents")
        ])
            .then(([keysResponse, docsResponse]) => {
                setKeys(keysResponse.data);
                setDocuments(docsResponse.data);
                setLoading(false); // Set loading to false only when both are fetched
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false); // Even if one request fails, stop loading
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <DisplayKey keys={keys}/>
            <DisplayDocument docs={documents}/>
        </>
)
    ;
}
