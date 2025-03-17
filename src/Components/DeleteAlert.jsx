export default function DeleteAlert({ onConfirm, onDismiss, docType }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-6 border rounded-lg border-custom-dark-blue bg-custom-dark-blue w-96 shadow-lg">
                <div className="flex items-center">
                    <svg
                        className="shrink-0 w-6 h-6 me-2 dark:text-gray-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-300">
                        Ste si istý, že chcete vymazať {docType}?
                    </h3>
                </div>
                <div className="mt-2 mb-4 text-sm text-gray-300">
                    Táto akcia je nevratná. Po vymazaní nebude možné {docType} obnoviť.
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-3xl text-sm px-4 py-2"
                    >
                        Vymazať
                    </button>
                    <button
                        onClick={onDismiss}
                        className="text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-3xl text-sm px-4 py-2"
                    >
                        Zrušiť
                    </button>
                </div>
            </div>
        </div>
    );
}
