import React, { useState, useEffect, useRef } from "react";

export default function EditKeyForm({ currentKey, onSave, onCancel, error, setError }) {
    const [formData, setFormData] = useState({
        name: currentKey.name || "",
        description: currentKey.description || "",
        country: currentKey.country || "",
        year: currentKey.year || -1,
        key: typeof currentKey.key === 'string' ? currentKey.key : JSON.stringify(currentKey.key, null, 2) || "{}"
    });

    // Sync formData when currentKey changes
    useEffect(() => {
        setFormData({
            name: currentKey.name || "",
            description: currentKey.description || "",
            country: currentKey.country || "",
            year: currentKey.year || -1,
            key: typeof currentKey.key === 'string' ? currentKey.key : JSON.stringify(currentKey.key, null, 2) || "{}"
        });
    }, [currentKey]);

    const keyTextareaRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!formData.key) {
                setError("Kľúč nesmie byť prázdny.");
                return;
            }

            // Skontrolujeme či je kľúč validný JSON
            const parsedKey = JSON.parse(formData.key);
            
            // Odošleme kľúč v pôvodnom formáte string
            await onSave({ ...formData, key: formData.key }, currentKey._id);
            setError(null);
        } catch (err) {
            setError("Kľuč musí byť vo formáte JSON.");
        }
    };

    const handleModalClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50 overflow-hidden" onClick={handleModalClick}>
            <div className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-xl w-1/2 max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn relative" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Upraviť kľúč</h2>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto">
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
                            <label htmlFor="key" className="block font-semibold text-gray-700 mb-2">Kľúč</label>
                            <textarea
                                ref={keyTextareaRef}
                                id="key"
                                name="key"
                                value={formData.key}
                                onChange={handleChange}
                                className="w-full p-3 border border-custom-dark-blue rounded-lg bg-white text-custom-dark-blue focus:outline-none focus:border-custom-dark-blue-hover focus:ring-1 focus:ring-custom-dark-blue-hover min-h-[150px] font-mono"
                            />
                        </div>
                        <div className="relative">
                            {error ? (
                                <div className="mb-5 text-red-600 text-center font-semibold p-3 rounded-lg sticky top-0 z-10">{error}</div>
                            ) : (
                                <div className="mb-5 text-red-500 text-center font-semibold invisible">Error Placeholder</div>
                            )}
                        </div>
                    </div>

                    <div className="mt-auto pt-4">
                        <div className="flex justify-end gap-4">
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
                    </div>
                </form>
            </div>
        </div>
    );
}
