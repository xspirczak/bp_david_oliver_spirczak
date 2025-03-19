import React, { useState, useEffect } from "react";

export default function EditDocumentForm({ doc, onSave, onCancel, error, setError}) {
    const [formData, setFormData] = useState({
        name: doc.name || "",
        description: doc.description || "",
        country: doc.country || "",
        language: doc.language || "",
        year: doc.year || -1,
        document: doc.document || "",
    });

    useEffect(() => {
        setFormData({
            name: doc.name || "",
            description: doc.description || "",
            country: doc.country || "",
            language: doc.language || "",
            year: doc.year || -1,
            document: doc.document || "",
        });
    }, [doc]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "document" && value.trim() !== "") {
            setError(null);
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, doc._id);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">Upravit dokument</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block font-semibold">Názov</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block font-semibold">Popis</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="country" className="block font-semibold">Krajina</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="language" className="block font-semibold">Jazyk</label>
                        <input
                            type="text"
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="year" className="block font-semibold">Rok</label>
                        <input
                            type="number"
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="document" className="block font-semibold">Dokument</label>
                        <textarea
                            id="document"
                            name="document"
                            value={formData.document}
                            onChange={handleChange}
                            className="w-full min-h-fit p-2 border rounded"
                        />
                    </div>
                    {error ? (
                        <div className="mb-4 text-red-500 text-center font-semibold">{error}</div>

                    ) : (
                        <div className="mb-4 text-red-500 text-center font-semibold invisible">Error Placeholder
                        </div>

                    )}


                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Zrušiť
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Uložiť
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
