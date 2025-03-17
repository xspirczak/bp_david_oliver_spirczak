import React, { useState, useEffect, useRef } from "react";

export default function EditKeyForm({ currentKey, onSave, onCancel, error, setError }) {
    const [formData, setFormData] = useState({
        name: currentKey.name || "",
        description: currentKey.description || "",
        country: currentKey.country || "",
        year: currentKey.year || -1,
        key: JSON.stringify(currentKey.key) || {},
    });

    // Sync formData when currentKey changes
    useEffect(() => {
        setFormData({
            name: currentKey.name || "",
            description: currentKey.description || "",
            country: currentKey.country || "",
            year: currentKey.year || -1,
            key: JSON.stringify(currentKey.key) || {},
        });
    }, [currentKey]);

    const keyTextareaRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // Update formData fields
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            if (!formData.key) {
                setError("Kľúč nesmie byť prázdny.");
                return;
            }

            if (!JSON.parse(formData.key)) {
                setError("Kľúč musí byť vo formáte JSON.");
                return;
            }

            onSave({ ...formData, key: formData.key }, currentKey._id);
            setError(null);
        } catch (err) {
            setError("Kľuč musí byť vo formáte JSON.");
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-1/2 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Upravit kľúč</h2>
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
                        <label htmlFor="key" className="block font-semibold">Kľúč</label>
                        <textarea
                            ref={keyTextareaRef}
                            id="key"
                            name="key"
                            value={formData.key}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    {error ? (
                        <div className="mb-4 text-red-500 text-center font-semibold">{error}</div>
                    ) : (
                        <div className="mb-4 text-red-500 text-center font-semibold invisible">Error Placeholder</div>
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
