import React, { useState, useEffect } from "react";

export default function EditTextForm({ doc, onSave, onCancel, error, setError}) {
    const [formData, setFormData] = useState({
        name: doc.name || "",
        description: doc.description || "",
        country: doc.country || "",
        language: doc.language || "",
        source: doc.source || "",
        author: doc.author || "",
        year: doc.year || -1,
        document: doc.document || "",
    });

    // Synchronizácia
    useEffect(() => {
        setFormData({
            name: doc.name || "",
            description: doc.description || "",
            country: doc.country || "",
            language: doc.language || "",
            source: doc.source || "",
            author: doc.author || "",
            year: doc.year || -1,
            document: doc.document || "",
        });
    }, [doc]);

    // Ulož zmenu textu
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
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50 overflow-hidden" onClick={onCancel}>
            <div className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-xl w-1/2 max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn relative" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Upraviť text</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block font-semibold text-gray-700 mb-2">Názov</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-custom-dark-blue rounded-lg bg-white text-custom-dark-blue focus:outline-none focus:border-custom-dark-blue-hover focus:ring-1 focus:ring-custom-dark-blue-hover"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="author" className="block font-semibold text-gray-700 mb-2">Autor</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full p-3 border border-custom-dark-blue rounded-lg bg-white text-custom-dark-blue focus:outline-none focus:border-custom-dark-blue-hover focus:ring-1 focus:ring-custom-dark-blue-hover"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="description" className="block font-semibold text-gray-700 mb-2">Popis</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-3 border border-custom-dark-blue rounded-lg bg-white text-custom-dark-blue focus:outline-none focus:border-custom-dark-blue-hover focus:ring-1 focus:ring-custom-dark-blue-hover min-h-[100px]"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="country" className="block font-semibold text-gray-700 mb-2">Krajina</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full p-3 border border-custom-dark-blue rounded-lg bg-white text-custom-dark-blue focus:outline-none focus:border-custom-dark-blue-hover focus:ring-1 focus:ring-custom-dark-blue-hover"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="language" className="block font-semibold text-gray-700 mb-2">Jazyk</label>
                        <input
                            type="text"
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="w-full p-3 border border-custom-dark-blue rounded-lg bg-white text-custom-dark-blue focus:outline-none focus:border-custom-dark-blue-hover focus:ring-1 focus:ring-custom-dark-blue-hover"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="source" className="block font-semibold text-gray-700 mb-2">Zdroj</label>
                        <input
                            type="text"
                            id="source"
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            className="w-full p-3 border border-custom-dark-blue rounded-lg bg-white text-custom-dark-blue focus:outline-none focus:border-custom-dark-blue-hover focus:ring-1 focus:ring-custom-dark-blue-hover"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="year" className="block font-semibold text-gray-700 mb-2">Rok</label>
                        <input
                            type="number"
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full p-3 border border-custom-dark-blue rounded-lg bg-white text-custom-dark-blue focus:outline-none focus:border-custom-dark-blue-hover focus:ring-1 focus:ring-custom-dark-blue-hover"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="document" className="block font-semibold text-gray-700 mb-2">Text</label>
                        <textarea
                            id="document"
                            name="document"
                            value={formData.document}
                            onChange={handleChange}
                            className="w-full p-3 border border-custom-dark-blue rounded-lg bg-white text-custom-dark-blue focus:outline-none focus:border-custom-dark-blue-hover focus:ring-1 focus:ring-custom-dark-blue-hover min-h-[150px]"
                        />
                    </div>
                    {error ? (
                        <div className="mb-5 text-red-600 text-center font-semibold p-3 rounded-lg">{error}</div>
                    ) : (
                        <div className="mb-5 text-red-500 text-center font-semibold invisible">Error Placeholder</div>
                    )}

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-lg transition duration-200"
                        >
                            Zrušiť
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-lg transition duration-200"
                        >
                            Uložiť
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
